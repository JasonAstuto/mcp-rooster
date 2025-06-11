using Xunit;
using McpRooster.Services;

namespace McpRooster.Tests
{
    public class AlertServiceTests
    {
        [Fact]
        public void AnalyzeLog_ReturnsExpectedMessage()
        {
            var service = new AlertService();
            var result = service.AnalyzeLog("test log");
            Assert.Contains("Analyzed log", result);
        }
    }
}
