using AutoMapper;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;

namespace Inventory.API.MapperProfiles
{
    public class KitchenProfile : Profile
    {
        public KitchenProfile()
        {
            CreateMap<CreateKitchenDto, Kitchen>();
            CreateMap<Kitchen, KitchenResponseDTO>()
                .ForMember(dest => dest.Users, opt => opt.MapFrom(src => 
                        src.UserKitchens.Select(uk => uk.UserId) //change it to username
                ));

            CreateMap<KitchenInvite, InviteLinkResponseDto>()
                .ForMember(dest => dest.InviteLink,
                    opt => opt.MapFrom(src => $"{src.KitchenId}/invite/{src.InviteCode}"));
        }
    }
}