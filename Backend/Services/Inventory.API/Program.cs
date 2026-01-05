using Common.Middlewares;
using Inventory.API.Data.Context;
using Inventory.API.MapperProfiles;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<InventoryDbContext>(
    opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("InventoryConnection"))
    );

builder.Services.AddControllers();

builder.Services.AddAutoMapper(cfg => { }, typeof(KitchenProfile));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseStatusCodeException(); // custom middleware for handling exceptions

app.MapControllers();

app.Run();