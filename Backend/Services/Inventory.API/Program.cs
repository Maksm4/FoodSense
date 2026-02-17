using System.Text;
using System.Text.Json.Serialization;
using Common.Middlewares;
using Common.Services;
using Inventory.API.Config;
using Inventory.API.Data.Context;
using Inventory.API.Data.Context.Seeder;
using Inventory.API.Data.Interfaces;
using Inventory.API.Data.Repository;
using Inventory.API.MapperProfiles;
using Inventory.API.Services;
using Inventory.API.Services.Interfaces;
using Inventory.API.Services.Translator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

builder.Services.AddDbContext<InventoryDbContext>(
        opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            sqlOptions => sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null)
            )
        );
//config
builder.Services.Configure<AzureSettings>(builder.Configuration.GetSection("Azure"));

//services
builder.Services.AddScoped<IKitchenService, KitchenService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductItemService, ProductItemService>();
builder.Services.AddScoped<IKitchenInviteService, KitchenInviteService>();
builder.Services.AddScoped<CsvProductSeeder>();
builder.Services.AddHttpClient<ITranslatorService, AzureTranslatorService>(client =>
{
    client.BaseAddress = new Uri("https://api.cognitive.microsofttranslator.com");
    client.Timeout = TimeSpan.FromSeconds(5);
});

//repositories
builder.Services.AddScoped<IKitchenRepository, KitchenRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductItemRepository, ProductItemRepository>();

//Common
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, HeaderCurrentUser>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAutoMapper(cfg => { }, typeof(Program));
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
var app = builder.Build();

app.UseExceptionHandler(opt => { });
if (app.Environment.IsDevelopment())
{ 
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); for now disable
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<InventoryDbContext>();
        var seeder = services.GetRequiredService<CsvProductSeeder>();
        
        context.Database.Migrate();
        var csvPath = Path.Combine(AppContext.BaseDirectory, "Data", "Seeding", "off_products.csv");
        
        if (File.Exists(csvPath) && !context.Products.Any())
        {
            await seeder.SeedFromCsv(csvPath);
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration/seeding");
    }
}

app.Run();