using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace McpRooster.API.Services
{
    public class EmbeddingService : IEmbeddingService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<EmbeddingService> _logger;

        public EmbeddingService(HttpClient httpClient, IConfiguration config, ILogger<EmbeddingService> logger)
        {
            _httpClient = httpClient;
            _apiKey = config["OpenAI:ApiKey"] ?? throw new ArgumentNullException("OpenAI API key is missing");
            _logger = logger;
        }

        public async Task<float[]> GetEmbeddingAsync(string input)
        {
            var request = new
            {
                input = input,
                model = "text-embedding-3-small"
            };

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/embeddings")
            {
                Content = JsonContent.Create(request)
            };
            httpRequest.Headers.Add("Authorization", $"Bearer {_apiKey}");

            var response = await _httpClient.SendAsync(httpRequest);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("OpenAI embedding request failed: {Status} - {Reason}", response.StatusCode, response.ReasonPhrase);
                throw new ApplicationException("Failed to get embedding from OpenAI");
            }

            using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);
            var vector = doc.RootElement.GetProperty("data")[0].GetProperty("embedding")
                .EnumerateArray()
                .Select(x => x.GetSingle())
                .ToArray();

            return vector;
        }
    }


}
