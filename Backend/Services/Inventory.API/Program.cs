using Common.Middlewares;
using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Data.Repository;
using Inventory.API.MapperProfiles;
using Inventory.API.Services;
using Inventory.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

builder.Services.AddDbContext<InventoryDbContext>(
        opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("InventoryConnection"))
    );

//services
builder.Services.AddScoped<IKitchenService, KitchenService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductItemService, ProductItemService>();

//repositories
builder.Services.AddScoped<IKitchenRepository, KitchenRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductItemRepository, ProductItemRepository>();

builder.Services.AddControllers();

builder.Services.AddAutoMapper(cfg => { }, typeof(KitchenProfile));
builder.Services.AddExceptionHandler<StatusCodeExceptionHandler>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{ 
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseExceptionHandler(opt => { });
app.MapControllers();

app.Run();