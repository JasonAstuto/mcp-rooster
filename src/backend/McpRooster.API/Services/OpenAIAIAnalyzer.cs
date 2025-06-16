using McpRooster.API.Interfaces;
using OpenAI_API;
using OpenAI_API.Chat;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using McpRooster.API.Models;

namespace McpRooster.API.Services
{
    public class OpenAIAIAnalyzer : IAIAnalyzer
    {
        private readonly OpenAIAPI _api;
        private readonly ILogger<OpenAIAIAnalyzer> _logger;
        private string? apiKey;

        public OpenAIAIAnalyzer(IAmazonSecretsManager secretsManager, ILogger<OpenAIAIAnalyzer> logger)
        {
            _logger = logger;
            var secretValue = GetSecretValue(secretsManager, "OpenAI-API-Key").GetAwaiter().GetResult();
            var json = JsonSerializer.Deserialize<Dictionary<string, string>>(secretValue);
            apiKey = json?["ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogError("OpenAI API key not found in secret");
                throw new Exception("OpenAI API key not found in AWS Secrets Manager.");
            }

            _api = new OpenAIAPI(apiKey);
        }

        private async Task<string> GetSecretValue(IAmazonSecretsManager client, string secretName)
        {
            try
            {
                var request = new GetSecretValueRequest { SecretId = secretName };
                var response = await client.GetSecretValueAsync(request);
                return response.SecretString;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving secret {SecretName}", secretName);
                throw;
            }
        }

        public async Task<McpAnalysisResult> AnalyzeAsync(string logContent)
        {
            var api = new OpenAIAPI(apiKey);
            var result = new McpAnalysisResult();

            result.RedTeam = await AnalyzeWithRole(api, logContent, "You are a red team operator. Analyze the logs and identify how you would exploit any weakness.");
            result.BlueTeam = await AnalyzeWithRole(api, logContent, "You are a blue team analyst. Identify the possible threat and how to respond.");
            result.Executive = await AnalyzeWithRole(api, logContent, "You are a security executive. Summarize the risk and business impact in clear terms.");

            return result;
        }

        private async Task<string> AnalyzeWithRole(OpenAIAPI api, string input, string systemPrompt)
        {
            var chat = api.Chat.CreateConversation();
            chat.RequestParameters.Temperature = 0.7;
            chat.RequestParameters.MaxTokens = 500;

            chat.AppendSystemMessage(systemPrompt);
            chat.AppendUserInput(input);

            try
            {
                return await chat.GetResponseFromChatbotAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OpenAI analysis failed");
                return "Error: unable to retrieve AI analysis.";
            }
        }
    }
}
