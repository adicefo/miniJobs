using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webAPI.Models.ViewModels;
using WebAPI.Data;
using WebAPI.Models;

namespace webAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class SpremljeniPosaoController : Controller
    {
        private readonly APIDbContext _db;
        public SpremljeniPosaoController(APIDbContext dbContext)
        {
            _db= dbContext;
        }

        [HttpPost]
        public ActionResult Add([FromBody] SpremljeniPosaoAddVM x)
        {
            var posao = _db.Posao.Find(x.posao_id);
            if (posao == null)
                return NotFound();

            //provjera oglašavanja na posao
            var testAplicirani = _db.ApliciraniPosao.Where(ap => ap.posao_id == x.posao_id &&
            ap.aplikant_id == x.aplikant_id).FirstOrDefault();
            var testSpremljeni = _db.SpremljeniPosao.Where(sp => sp.posao_id == x.posao_id &&
            sp.aplikant_id == x.aplikant_id).FirstOrDefault();
            if (testAplicirani != null||testSpremljeni!=null)
                return BadRequest("Oglas već zapremljen");
            var spremljeniPosao = new SpremljeniPosao()
            {
                status = x.status,
                posao_id = x.posao_id,
                aplikant_id = x.aplikant_id
            };
            _db.Add(spremljeniPosao);
            _db.SaveChanges();
            return Ok(spremljeniPosao);
        }

        [HttpGet]
        public ActionResult GetByID(int id)
        {
            var poslovi=_db.SpremljeniPosao.Include("posao")
                .Where(sp=>sp.aplikant_id==id).ToList();
            return Ok(poslovi);
        }
        [HttpDelete]
        public ActionResult RemoveByID(int id) 
        {
            var spremljeniPosao = _db.SpremljeniPosao.Find(id);
            _db.Remove(spremljeniPosao);
            _db.SaveChanges();
            return Ok("Posao uklonjen");
        }

    }
}
