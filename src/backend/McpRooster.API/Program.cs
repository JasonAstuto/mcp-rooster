using McpRooster.API.Interfaces;
using McpRooster.API.Services;
using Amazon;
using Amazon.SecretsManager;
using Amazon.Extensions.NETCore.Setup;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ---------- Serilog Setup ----------
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/mcp-rooster-log.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// ---------- AWS Configuration ----------
builder.Services.AddDefaultAWSOptions(new AWSOptions
{
    Region = RegionEndpoint.USWest2 // change to your region
});
builder.Services.AddAWSService<IAmazonSecretsManager>();

// ---------- Services & DI ----------
builder.Services.AddScoped<IAIAnalyzer, OpenAIAIAnalyzer>();
builder.Services.AddControllers();

// ---------- CORS (for frontend) ----------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ---------- Swagger (Dev Only) ----------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MCP Rooster – The Early Warning System",
        Version = "v1"
    });
});

var app = builder.Build();

// ---------- Middleware ----------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MCP Rooster API v1");
    });
}

app.UseSerilogRequestLogging(); // structured log for HTTP requests
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
