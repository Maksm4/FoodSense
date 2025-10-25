using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KitchenController : ControllerBase
    {
        private readonly IMapper _mapper;

        //service 

        public KitchenController(IMapper mapper)
        {
            _mapper = mapper;
        }
    }
}