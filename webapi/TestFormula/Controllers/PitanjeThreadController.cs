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
    public class PitanjeThreadController : ControllerBase
    {
        private readonly APIDbContext _db;

        public PitanjeThreadController(APIDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult Get() 
        {
            var data = _db.PitanjeThread.Include("posao").
                ToList();
            return Ok(data);
        }
        [HttpPost]
        public ActionResult Add([FromBody]PitanjeThreadVM x) 
        {
            var posao = _db.Posao.Find(x.posao_id);
            if(posao == null) 
            {
                return BadRequest();
            }
            var novoPitanje = new PitanjeThread()
            {
                datum_kreiranja=DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss"),
                naziv=x.naziv,
                posao_id=x.posao_id
            };
            _db.Add(novoPitanje);
            _db.SaveChanges();
            return Ok(novoPitanje);
        }
    }
}
