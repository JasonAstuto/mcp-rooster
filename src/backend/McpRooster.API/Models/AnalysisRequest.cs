namespace McpRooster.API.Models
{
    public class AnalysisRequest
    {
        public string Protocol { get; set; } = "HTTP";
        public string LogSnippet { get; set; } = string.Empty;
    }
}
