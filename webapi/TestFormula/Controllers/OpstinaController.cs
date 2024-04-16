using Microsoft.AspNetCore.Mvc;
using WebAPI.Core;
using WebAPI.Helper;
using WebAPI.Models;
using WebAPI.Models.ViewModels;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class OpstinaController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public OpstinaController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ActionResult GetAll(string nazivDrzave="false")
        {
            if(nazivDrzave != "false")
                return Ok( _unitOfWork.Opstina.GetAll(filter:(o=>o.drzava.naziv== nazivDrzave),// filtrira opstine po nazivu drzave
                    orderBy:(q => q.OrderBy(opstina => opstina.description )),// orderBy 
                    includeProperties: "drzava")); 
            else
                return Ok(_unitOfWork.Opstina.GetAll(orderBy: (q => q.OrderBy(opstina => opstina.description)),includeProperties: "drzava"));
        }
        [HttpGet]
        public List<CmbStavke> GetByDrzava(int drzava_id)
        {
            return _unitOfWork.Opstina.GetByDrzava(drzava_id);

        }
        [HttpGet]
        public List<CmbStavke> GetByAll()
        {
            return _unitOfWork.Opstina.GetByAll();

        }
        [HttpGet]
        public ActionResult GetById(int id)
        {
            var opstina = _unitOfWork.Opstina.GetById(id);
            if (opstina == null)
            {
                return NotFound();
            }
            return Ok(opstina);
        }
        [HttpPost]
        public ActionResult Add(OpstinaAddVM x)
        {
            var opstina = new Opstina
            {
                description = x.opis,
                drzava_id = x.drzava_id,
            };
            _unitOfWork.Opstina.Add(opstina);
            _unitOfWork.Complete();
            return Ok(opstina);
        }
        [HttpDelete]
        public ActionResult DeleteById(int id)
        {

            var opstina = _unitOfWork.Opstina.GetById(id);
            if (opstina == null)
                return BadRequest("Driver with that id doesn't exists.");
            _unitOfWork.Opstina.Delete(opstina);
            _unitOfWork.Complete();
            return Ok(opstina);

        }
        [HttpPatch]
        public ActionResult Update(OpstinaAddVM x)
        {
            var novaOpstina = new Opstina
            {
                description = x.opis,
                drzava_id = x.drzava_id,
            };
            var opstina = _unitOfWork.Opstina.GetById(x.id);
            if (opstina == null) NotFound();

            _unitOfWork.Opstina.Update(novaOpstina);
            _unitOfWork.Complete();

            return Ok(novaOpstina);
        }
    }
}
