using Microsoft.AspNetCore.Mvc;
using McpRooster.Services.Interfaces;

namespace McpRooster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertController : ControllerBase
    {
        private readonly IAlertService _alertService;

        public AlertController(IAlertService alertService)
        {
            _alertService = alertService;
        }

        [HttpPost]
        public IActionResult Analyze([FromBody] string log)
        {
            var result = _alertService.AnalyzeLog(log);
            return Ok(new { result });
        }
    }
}
