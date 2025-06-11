using McpRooster.API.Interfaces;
using OpenAI_API;
using OpenAI_API.Chat;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace McpRooster.API.Services
{
    public class OpenAIAIAnalyzer : IAIAnalyzer
    {
        private readonly OpenAIAPI _api;
        private readonly ILogger<OpenAIAIAnalyzer> _logger;

        public OpenAIAIAnalyzer(IAmazonSecretsManager secretsManager, ILogger<OpenAIAIAnalyzer> logger)
        {
            _logger = logger;
            var secretValue = GetSecretValue(secretsManager, "OpenAI-API-Key").GetAwaiter().GetResult();
            var json = JsonSerializer.Deserialize<Dictionary<string, string>>(secretValue);
            var apiKey = json?["ApiKey"];

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

        public async Task<string> AnalyzeAsync(string logSnippet, string protocolContext)
        {
            try
            {
                var chatRequest = new ChatRequest
                {
                    Model = "gpt-4",
                    Temperature = 0.2,
                    MaxTokens = 400,
                    Messages = new List<ChatMessage>
                    {
                        new ChatMessage(ChatMessageRole.System, $"You are a security analyst specializing in {protocolContext} traffic. Help detect anomalies."),
                        new ChatMessage(ChatMessageRole.User, $"Analyze the following log:\n\n{logSnippet}")
                    }
                };

                var chatResult = await _api.Chat.CreateChatCompletionAsync(chatRequest);

                return chatResult.Choices.First().Message.Content.Trim();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OpenAI analysis failed");
                return "Error: AI analysis failed. Please check logs for details.";
            }
        }
    }
}
