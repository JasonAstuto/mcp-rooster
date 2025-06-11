using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace McpRooster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckController : ControllerBase
    {
        private readonly ILogger<HealthCheckController> _logger;
        private static readonly DateTime _startupTime = DateTime.UtcNow;

        public HealthCheckController(ILogger<HealthCheckController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Health check requested.");

            var result = new
            {
                status = "Healthy",
                service = "MCP Rooster API",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                timestamp = DateTime.UtcNow,
                uptime = (DateTime.UtcNow - _startupTime).ToString(@"dd\.hh\:mm\:ss")
            };

            return Ok(result);
        }
    }
}
