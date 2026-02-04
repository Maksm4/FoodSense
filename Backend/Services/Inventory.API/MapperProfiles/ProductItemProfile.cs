using AutoMapper;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;

namespace Inventory.API.MapperProfiles;

public class ProductItemProfile : Profile
{
    public ProductItemProfile()
    {
        CreateMap<ProductItem, ProductItemResponseDTO>();
        CreateMap<UpdateProductItemDto, ProductItem>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<Product, ProductResponseDTO>();
        CreateMap<CreateProductItemDto, ProductItem>();
        CreateMap<CreateProductRequestDto, Product>();
    }
}