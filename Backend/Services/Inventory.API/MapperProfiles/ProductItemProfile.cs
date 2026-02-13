using AutoMapper;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;

namespace Inventory.API.MapperProfiles;

public class ProductItemProfile : Profile
{
    public ProductItemProfile()
    {
        CreateMap<ProductItem, ProductItemResponseDTO>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Product.Brand))
            .ForMember(dest => dest.MainCategory, opt => opt.MapFrom(src => src.Product.Categories.LastOrDefault() != null ? src.Product.Categories.LastOrDefault()!.Name : string.Empty))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Product.VisualRepresentation));
        
        CreateMap<UpdateProductItemDto, ProductItem>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<Product, ProductResponseDTO>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.VisualRepresentation));
        ;
        CreateMap<CreateProductItemDto, ProductItem>();
        CreateMap<CreateProductRequestDto, Product>();
    }
}