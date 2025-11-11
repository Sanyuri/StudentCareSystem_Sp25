using Finbuckle.MultiTenant;

using Serilog;

using StudentCareSystem.API.Configs;
using StudentCareSystem.API.Configs.Autos;
using StudentCareSystem.API.Configs.Securities;
using StudentCareSystem.API.Configs.Swagger;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;


var builder = WebApplication.CreateBuilder(args);

// Add host configuration
builder.Host.ConfigureLog();

// Add services to the container.
builder.Services.ConfigureAutos();
builder.Services.ConfigureSwagger();
builder.Services.ConfigureController();
builder.Services.ConfigureHangfire(builder.Configuration);
builder.Services.ConfigureDbContext(builder.Configuration, builder.Environment);
builder.Services.ConfigureHttpClient(builder.Configuration);
builder.Services.ConfigureRedisServer(builder.Configuration);
builder.Services.ConfigureHealthChecks(builder.Configuration);
builder.Services.ConfigSecurity(builder.Configuration, "AllowAll", builder.Environment);

// Build the app
var app = builder.Build();
app.UseMultiTenant();
app.UseSerilogRequestLogging();
// Register the Hangfire jobs
using (var scope = app.Services.CreateScope())
{
    var jobService = scope.ServiceProvider.GetRequiredService<IJobService>();
    await jobService.RegisterJobs();
}
// Configure the HTTP request pipeline.
app.ConfigureHttpRequest(app.Environment);

await app.RunAsync();

