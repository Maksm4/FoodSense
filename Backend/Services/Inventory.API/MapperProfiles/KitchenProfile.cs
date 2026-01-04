using AutoMapper;
using Inventory.API.DTOs.Request;
using Inventory.API.Models;

namespace Inventory.API.MapperProfiles
{
    public class KitchenProfile : Profile
    {
        public KitchenProfile()
        {
            CreateMap<CreateKitchenDto, Kitchen>();
        }
    }
}