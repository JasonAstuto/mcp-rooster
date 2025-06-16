using System.Threading.Tasks;
using McpRooster.API.Models;
using OpenAI_API;

namespace McpRooster.API.Interfaces
{
    /// <summary>
    /// Defines a contract for analyzing logs using an AI service like OpenAI.
    /// </summary>
    public interface IAIAnalyzer
    {
        /// <summary>
        /// Analyzes a log snippet and returns a human-readable interpretation or anomaly detection insight.
        /// </summary>
        /// <param name="logSnippet">The raw log string to analyze.</param>
        /// <param name="protocolContext">The context or protocol type (e.g., HTTP, HTTPS, TLS) to guide the AI.</param>
        /// <returns>A human-readable string with the AI-generated analysis or insight.</returns>
        Task<McpAnalysisResult> AnalyzeAsync(string logContent);
        
    }
}
