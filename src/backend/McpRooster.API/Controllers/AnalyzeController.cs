using Microsoft.AspNetCore.Mvc;
using McpRooster.API.Interfaces;
using Microsoft.Extensions.Logging;

namespace McpRooster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly IAIAnalyzer _aiAnalyzer;
        private readonly ILogger<AnalyzeController> _logger;

        public AnalyzeController(IAIAnalyzer aiAnalyzer, ILogger<AnalyzeController> logger)
        {
            _aiAnalyzer = aiAnalyzer;
            _logger = logger;
        }

        public class AnalyzeRequest
        {
            public string Protocol { get; set; } = "HTTP";
            public string LogSnippet { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AnalyzeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.LogSnippet))
                return BadRequest("LogSnippet is required.");

            try
            {
                _logger.LogInformation("AI analysis requested for protocol {Protocol}", request.Protocol);
                var result = await _aiAnalyzer.AnalyzeAsync(request.LogSnippet);
                return Ok(new
                {
                    protocol = request.Protocol,
                    input = request.LogSnippet,
                    analysis = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during AI analysis");
                return StatusCode(500, "AI analysis failed. See logs for details.");
            }
        }
    }
}
