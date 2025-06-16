using Microsoft.AspNetCore.Mvc;
using McpRooster.API.Interfaces;
using McpRooster.API.Models;
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

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AnalysisRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.LogSnippet))
                return BadRequest("LogSnippet is required.");

            try
            {
                _logger.LogInformation("AI analysis requested for protocol {Protocol}", request.Protocol);
                AnalysisResult result = await _aiAnalyzer.AnalyzeAsync(request.LogSnippet);

                return Ok(new
                {
                    protocol = request.Protocol,
                    input = request.LogSnippet,
                    redTeam = result.RedTeam,
                    blueTeam = result.BlueTeam,
                    executive = result.Executive
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
