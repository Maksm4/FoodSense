using Inventory.API.Data.Context;
using Inventory.API.MapperProfiles;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<InventoryDbContext>(
    opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("InventoryConnection"))
    );

builder.Services.AddControllers();

builder.Services.AddAutoMapper(cfg => { }, typeof(KitchenProfile));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();