using System.Text;
using System.Text.Json.Serialization;
using Common.Middlewares;
using Common.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Recipe.API.Config;
using Recipe.API.Data.Context;
using Recipe.API.Data.Repository;
using Recipe.API.ExternalAPIs;
using Recipe.API.ExternalAPIs.Edamam.V2;
using Recipe.API.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

builder.Services.AddDbContext<RecipeDbContext>(
        opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null)
        ));

//services
builder.Services.AddScoped<IRecipeService, RecipeService>();

//Common
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, HeaderCurrentUser>();
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddExceptionHandler<StatusCodeExceptionHandler>();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!)), 
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.Configure<Edamam>(
    builder.Configuration.GetSection(Edamam.SectionName));

builder.Services.AddHttpClient<IRecipeProvider, EdamamRecipeProvider>(client =>
{
    client.BaseAddress = new Uri("https://api.edamam.com");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("Edamam-Account-User", "test-user"); //for now test user
});

builder.Services.AddAutoMapper(_ => { }, typeof(Program));

var app = builder.Build();

app.UseExceptionHandler(opt => { });
if (app.Environment.IsDevelopment())
{ 
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); for now disabled
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<RecipeDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database");
    }
}

app.Run();