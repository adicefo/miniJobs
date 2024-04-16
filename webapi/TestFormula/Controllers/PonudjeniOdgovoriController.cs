using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Core;

namespace webAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class PonudjeniOdgovoriController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public PonudjeniOdgovoriController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]

        public ActionResult GetByPosaoId(int posao_id)
        {
            var data = _unitOfWork.PonudjeniOdgovori.GetByPitanjeId(posao_id);
            return Ok(data);
        }

    }
}
