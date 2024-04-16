using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Core;

namespace webAPI.Controllers
{   [ApiController]
    [Route("[controller]/[action]")]
    public class PosaoTipController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public PosaoTipController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]

        public ActionResult GetAll()
        {
            var data = _unitOfWork.PosaoTip.GetAll();
            return Ok(data);
        }

    }
}
