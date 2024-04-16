using Microsoft.AspNetCore.Mvc;
using WebAPI.Core;
using webAPI.Models.ViewModels;
using WebAPI.Data;
using WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using webAPI.Modul_Autentifikacija;
using Microsoft.EntityFrameworkCore;

namespace webAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ApliciraniPosaoController : Controller
    {
        private readonly APIDbContext _db;

        public ApliciraniPosaoController(APIDbContext db)
        {
            this._db = db;
        }


        [HttpPost]
        public ActionResult Add([FromBody]ApliciraniPosaoAddVM x)
        {
            var posao = _db.Posao.Find(x.posao_id);
            if(posao == null)
                return NotFound();

            //provjera apliciranja na posao
            var testAplicirani=_db.ApliciraniPosao.Where(ap=>ap.posao_id==x.posao_id&&
            ap.aplikant_id==x.aplikant_id).FirstOrDefault();
            if(testAplicirani!=null)
                return BadRequest("Aplicirali ste već na ovaj oglas");
            var apliciraniPosao=new ApliciraniPosao() 
            { 
                status=x.status==""?"Aktivan":x.status,
                datum_apliciranja=DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                posao_id=x.posao_id,aplikant_id=x.aplikant_id
            };

            var spremljeni = _db.SpremljeniPosao.Where(sp => sp.posao_id == x.posao_id &&
            sp.aplikant_id == x.aplikant_id).FirstOrDefault();
            if (spremljeni != null)
                _db.Remove(spremljeni);

            _db.Add(apliciraniPosao);
            _db.SaveChanges();
            return Ok(apliciraniPosao);
        }
        [HttpGet]
        public ActionResult GetByID(int id)
        {
            var poslovi = _db.ApliciraniPosao.Include("posao")
                .Where(sp => sp.aplikant_id == id).ToList();
            return Ok(poslovi);
        }
        [HttpDelete]
        public ActionResult RemoveByID(int id)
        {
            var apliciraniPosao = _db.ApliciraniPosao.Find(id);
            _db.Remove(apliciraniPosao);
            _db.SaveChanges();
            return Ok("Posao uklonjen");
        }



    }
}
