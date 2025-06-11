using Xunit;
using Moq;
using FluentAssertions;
using McpRooster.API.Services;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;

namespace McpRooster.Tests.Services
{
    public class OpenAIAIAnalyzerTests
    {
        private const string DummyApiKey = "sk-test-dummy";

        private Mock<IAmazonSecretsManager> SetupSecretsManager()
        {
            var secretJson = JsonSerializer.Serialize(new Dictionary<string, string>
            {
                { "ApiKey", DummyApiKey }
            });

            var secretsManager = new Mock<IAmazonSecretsManager>();
            secretsManager.Setup(sm => sm.GetSecretValueAsync(
                    It.Is<GetSecretValueRequest>(r => r.SecretId == "OpenAI-API-Key"),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new GetSecretValueResponse
                {
                    SecretString = secretJson
                });

            return secretsManager;
        }

        [Fact]
        public async Task AnalyzeAsync_WithMockLog_ReturnsExpectedFormat()
        {
            // Arrange
            var mockSecretsManager = SetupSecretsManager();
            var mockLogger = new Mock<ILogger<OpenAIAIAnalyzer>>();

            var analyzer = new OpenAIAIAnalyzer(mockSecretsManager.Object, mockLogger.Object);

            var result = await analyzer.AnalyzeAsync("GET /admin.php", "HTTP");

            // Act & Assert
            result.Should().NotBeNullOrWhiteSpace();
            result.Should().ContainAny("admin", "request", "log", "anomal");
        }

        [Fact]
        public async Task Constructor_MissingApiKey_ThrowsException()
        {
            // Arrange: simulate missing key
            var brokenSecretsManager = new Mock<IAmazonSecretsManager>();
            brokenSecretsManager.Setup(sm => sm.GetSecretValueAsync(
                    It.IsAny<GetSecretValueRequest>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new GetSecretValueResponse
                {
                    SecretString = "{}"
                });

            var mockLogger = new Mock<ILogger<OpenAIAIAnalyzer>>();

            // Act
            var ex = Record.Exception(() => new OpenAIAIAnalyzer(brokenSecretsManager.Object, mockLogger.Object));

            // Assert
            ex.Should().NotBeNull();
            ex.Message.Should().Contain("OpenAI API key not found");
        }
    }
}
