using McpRooster.Services.Interfaces;

namespace McpRooster.Services
{
    public class AlertService : IAlertService
    {
        public string AnalyzeLog(string log)
        {
            return $"Analyzed log: {log}";
        }
    }
}
