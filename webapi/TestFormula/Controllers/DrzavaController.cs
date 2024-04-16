using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebAPI.Core;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Models.ViewModels;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class DrzavaController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public DrzavaController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        /*   public ViewResult GetAll()
           {
               var data = _unitOfWork.Drzava.GetAll();
               return View(data.ToList());
           }*/
        public ActionResult GetAll()
        {
            var data = _unitOfWork.Drzava.GetAll();
            return Ok(data.ToList());
        }

        [HttpGet]
        public ActionResult GetById(int id)
        {
            var drzava = _unitOfWork.Drzava.GetById(id);
            if (drzava == null)
            {
                return NotFound();
            }
            return Ok(drzava);
        }
        [HttpPost]
        public ActionResult Add(Drzava d)
        {
            _unitOfWork.Drzava.Add(d);
            _unitOfWork.Complete();
            return Ok();
        }
        [HttpDelete]
        public ActionResult DeleteById(int id)
        {
            var drzava = _unitOfWork.Drzava.GetById(id);
            if (drzava == null)
                return BadRequest("Drzava sa ovim id-om ne postoji");
            _unitOfWork.Drzava.Delete(drzava);
            _unitOfWork.Complete();
            return Ok();

        }
        [HttpPatch]
        public ActionResult Update(Drzava d)
        {
            var driver = _unitOfWork.Drzava.GetById(d.id);
            if (driver == null) NotFound();

            _unitOfWork.Drzava.Update(d);
            _unitOfWork.Complete();

            return Ok();
        }
    }
}
