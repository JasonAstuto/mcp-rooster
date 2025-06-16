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
    public class OpenAI_AIAnalyzer : IAIAnalyzer
    {
        private readonly ILogger<OpenAI_AIAnalyzer> _logger;
        private readonly IAmazonSecretsManager _secretsManager;
        private OpenAIAPI? _api;
        private string? _apiKey;

        public OpenAI_AIAnalyzer(IAmazonSecretsManager secretsManager, ILogger<OpenAI_AIAnalyzer> logger)
        {
            _logger = logger;
            _secretsManager = secretsManager;
        }

        public async Task<AnalysisResult> AnalyzeAsync(string logContent)
        {
            if (_apiKey is null)
            {
                var secretValue = await GetSecretValueAsync(_secretsManager, "OpenAI-API-Key");
                var json = JsonSerializer.Deserialize<Dictionary<string, string>>(secretValue);
                _apiKey = json?["ApiKey"];

                if (string.IsNullOrWhiteSpace(_apiKey))
                {
                    _logger.LogError("OpenAI API key not found in secret");
                    throw new Exception("OpenAI API key not found in AWS Secrets Manager.");
                }

                _api = new OpenAIAPI(_apiKey);
            }

            if (_api is null)
                throw new InvalidOperationException("OpenAI API not initialized.");

            var result = new AnalysisResult
            {
                RedTeam = await AnalyzeWithRole(_api, logContent, "You are a red team operator. Analyze the logs and identify how you would exploit any weakness."),
                BlueTeam = await AnalyzeWithRole(_api, logContent, "You are a blue team analyst. Analyze the logs and identify any possible threat and how to respond."),
                Executive = await AnalyzeWithRole(_api, logContent, "You are a security executive. Analyze the logs and summarize the risk and business impact in clear terms.")
            };

            return result;
        }

        private async Task<string> AnalyzeWithRole(OpenAIAPI api, string input, string systemPrompt)
        {
            //this is how we tune our model, tunafish!
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

        private async Task<string> GetSecretValueAsync(IAmazonSecretsManager client, string secretName)
        {
            try
            {
                var request = new GetSecretValueRequest { SecretId = secretName };
                var response = await client.GetSecretValueAsync(request);
                return response.SecretString ?? throw new InvalidOperationException("Secret value was null.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving secret {SecretName}", secretName);
                throw;
            }
        }
    }
}
