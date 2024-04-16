using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webAPI.Helper;
using webAPI.Models.ViewModels;
using WebAPI.Data;
using WebAPI.Models;

namespace webAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class AplikantController : ControllerBase
    {
        private readonly APIDbContext _db;
        public AplikantController(APIDbContext dbContext)
        {
            _db = dbContext;
        }
        [HttpGet]
        public IActionResult Get() {
            
            
            var data =_db.Aplikant.Select(a=>new AplikantGetVM()
            {
                id=a.id,
                username=a.korisnickoIme,
                opstina_id=a.opstina_rodjenja_id,
                opstina=a.opstina_rodjenja.description,
                slikaCopy=a.slika
            }).ToList();
            foreach (var d in data)
            {
                d.brojZavrsenihPoslova=_db.ApliciraniPosao.Include(p=>p.posao).Where(ap=>ap.aplikant_id==d.id && ap.posao.status=="Zavrsen").ToList().Count;
                var aplikantPosaoTip = _db.aplikantPosaoTip.Include(ap => ap.posaoTip).FirstOrDefault(ap => ap.aplikant_id == d.id);
                if (aplikantPosaoTip != null)
                    d.posaoTip = aplikantPosaoTip.posaoTip.naziv;
                if (d.slikaCopy != null)
                {
                    d.slika = Convert.ToBase64String(d.slikaCopy);
                }
                else
                    d.slika = "";

                d.slikaCopy = null;
            }
       
            return Ok(data);
        }
        [HttpGet]
        public IActionResult GetByPosaoId(int id )
        {
            var posao = _db.Posao.FirstOrDefault(p=>p.id==id);
            if (posao == null)
                return BadRequest();

            var data = _db.Aplikant.Include(ap=>ap.apliciraniPoslovi).Where(a=>a.apliciraniPoslovi.Any(ap => ap.posao_id == posao.id)).Select(a => new AplikantGetVM()
            {
                id = a.id,
                username = a.korisnickoIme,
                opstina_id = a.opstina_rodjenja_id,
                opstina = a.opstina_rodjenja.description,
                slikaCopy = a.slika
            }).ToList();
            foreach (var d in data)
            {
                d.brojZavrsenihPoslova = _db.ApliciraniPosao.Include(p => p.posao).Where(ap => ap.aplikant_id == d.id && ap.posao.status == "Zavrsen").ToList().Count;
                var aplikantPosaoTip = _db.aplikantPosaoTip.Include(ap => ap.posaoTip).FirstOrDefault(ap => ap.aplikant_id == d.id);
                if (aplikantPosaoTip != null)
                    d.posaoTip = aplikantPosaoTip.posaoTip.naziv;
                if (d.slikaCopy != null)
                {
                    d.slika = Convert.ToBase64String(d.slikaCopy);
                }
                else
                    d.slika = "";

                d.slikaCopy = null;
            }

            return Ok(data);
        }
        [HttpPatch]
        public IActionResult Update([FromBody] AplikantUpdateVM x) 
        {
            var aplikant = _db.Aplikant.Find(x.aplikant_id);
            
            aplikant.opis = x.opis;
            aplikant.prijedlogSatince = x.prijedlogSatnice;
            aplikant.nivoObrazovanja = x.nivoObrazovanja;
            aplikant.iskustvo = x.iskustvo;
            
            if(x.slika!=null)
            {
                byte[] slikaParse = x.slika.ParsirajBase64();
                aplikant.slika = slikaParse;
            }

            if (x.CV != null)
            {
                byte[] cvParse = x.CV.ParsirajBase64();
                aplikant.CV = cvParse;
            }

            var posaoTipAplikant = new AplikantPosaoTip()
            {
                posaoTip_id=x.posaoTip_id,
                aplikant_id=x.aplikant_id
            };
            _db.Add(posaoTipAplikant);

            _db.SaveChanges();

            return Ok(aplikant);
        }
        [HttpGet]
        public IActionResult GetInformacije([FromBody] AplikantUpdateVM x)
        {
            var aplikant = _db.Aplikant.Find(x.aplikant_id);

            aplikant.opis = x.opis;
            aplikant.prijedlogSatince = x.prijedlogSatnice;
            aplikant.nivoObrazovanja = x.nivoObrazovanja;
            aplikant.iskustvo = x.iskustvo;

            if (x.slika != null)
            {
                byte[] slikaParse = x.slika.ParsirajBase64();
                aplikant.slika = slikaParse;
            }

            if (x.CV != null)
            {
                byte[] cvParse = x.CV.ParsirajBase64();
                aplikant.CV = cvParse;
            }

            var posaoTipAplikant = new AplikantPosaoTip()
            {
                posaoTip_id = x.posaoTip_id,
                aplikant_id = x.aplikant_id
            };
            _db.Add(posaoTipAplikant);

            _db.SaveChanges();

            return Ok(aplikant);
        }
    }
}
