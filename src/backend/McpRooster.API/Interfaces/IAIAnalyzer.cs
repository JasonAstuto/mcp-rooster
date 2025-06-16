using System.Threading.Tasks;
using McpRooster.API.Models;
using OpenAI_API;

namespace McpRooster.API.Interfaces
{
    public interface IAIAnalyzer
    {
        Task<AnalysisResult> AnalyzeAsync(string logContent);
        
    }
}
