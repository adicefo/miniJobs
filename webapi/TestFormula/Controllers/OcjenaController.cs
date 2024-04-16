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
    public class OcjenaController : Controller
    {
        private readonly APIDbContext _db;

        public OcjenaController(APIDbContext db)
        {
            _db = db;

        }
        [HttpPost]
        public ActionResult Add(OcjenaAddVM ocjena)
        {

            var ocjenjujeKorisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == ocjena.ocjenjujeUsername);
            if (ocjenjujeKorisnik == null)
                return BadRequest();

            var ocjenjeniKorisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == ocjena.ocjenjeniUsername);
            if (ocjenjeniKorisnik == null)
                return BadRequest();

            var testOcjena = _db.Ocjena.Where(o => o.ocjenjen_id == ocjenjeniKorisnik.id &&
            o.ocjenjuje_id == ocjenjujeKorisnik.id).FirstOrDefault();
            if (testOcjena != null)
                return BadRequest("Ocjena vec postoji");

            if ((bool)ocjenjujeKorisnik.isPoslodavac)
            {
                // kada poslodavac ocjenjuje

                //uzima se id apliciranog
                var tempAplicirani=_db.ApliciraniPosao.Where(ap=>ap.posao_id==ocjena.posao_id
                &&ap.aplikant_id==ocjenjeniKorisnik.id).FirstOrDefault();

                var ocjenaObj = new Ocjena()
                {
                    ocjenjuje_id = ocjenjujeKorisnik.id,
                    ocjenjen_id = ocjenjeniKorisnik.id,
                    vrijednost = ocjena.ocjena,
                    komentar = ocjena.komentar,
                    datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                    apliciraniPosao_id = tempAplicirani.id,
                    // ako ocjenjuje poslodavac oznaciti kao status nevalidna jer je moguce da ocjeni pogresnog aplikanta
                    //tek kada aplikant ocjeni poslodavca tada postaviti status ocjene kao validna
               //     status = "nevalidna"
                };
                _db.Ocjena.Add(ocjenaObj);
                _db.SaveChanges();
                var obavljeniPosao = _db.Posao.FirstOrDefault(p => p.id == ocjena.posao_id);
                if (obavljeniPosao.brojAplikanata == 1)
                    obavljeniPosao.status = "Završen";
                else
                {
                    var ocjenjeniAplikanti = _db.Ocjena.Where(o => o.ocjenjuje_id == ocjenjujeKorisnik.id && o.apliciraniPosao_id == ocjena.posao_id).ToList().Count();
                    if (obavljeniPosao.brojAplikanata == ocjenjeniAplikanti)
                        obavljeniPosao.status = "Završen";
                }

                _db.SaveChanges();

            }
            //Ovo je za tebe adi
               else
               {
                  var tempAplicirani=_db.ApliciraniPosao.Where(ap=>ap.posao_id==ocjena.posao_id
                  &&ap.aplikant_id==ocjenjujeKorisnik.id).FirstOrDefault();
                   //aplikanat ocjenjuje
                   var ocjenaObj = new Ocjena()
                   {
                       ocjenjuje_id = ocjenjujeKorisnik.id,
                       ocjenjen_id = ocjenjeniKorisnik.id,
                       vrijednost = ocjena.ocjena,
                       komentar = ocjena.komentar,
                       datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                       apliciraniPosao_id = tempAplicirani.id,
                      // status = "validna"
                   };
                   _db.Ocjena.Add(ocjenaObj);
                   var ocjenaOdPoslodavca = _db.Ocjena.FirstOrDefault(o => o.apliciraniPosao_id == ocjena.posao_id && o.ocjenjuje_id == ocjenjeniKorisnik.id && o.ocjenjen_id == ocjenjujeKorisnik.id);
                  // ocjenaOdPoslodavca.status = "validna";
                   _db.SaveChanges();
                   var obavljeniPosao = _db.Posao.FirstOrDefault(p => p.id == ocjena.posao_id);
                   if (obavljeniPosao.brojAplikanata == 1)
                       obavljeniPosao.status = "Završen";
                   else
                   {
                       var ocjenjeniAplikanti = _db.Ocjena.Where(o => o.ocjenjen_id == ocjenjeniKorisnik.id && o.apliciraniPosao_id == ocjena.posao_id).ToList().Count();
                       if (obavljeniPosao.brojAplikanata == ocjenjeniAplikanti)
                           obavljeniPosao.status = "Završen";
                   }

                   _db.SaveChanges();
               }

            return Ok();
        }
        [HttpGet]
        public ActionResult GetOcjenjeneAplikanteByPosaoId(int posao_id)
        {
            var posao = _db.Posao.FirstOrDefault(p => p.id == posao_id);
            if (posao == null)
                return BadRequest();
            var ocjenjeniAplikanti = (from o in _db.Ocjena
                                      join k in _db.KorisnickiNalog on o.ocjenjen_id equals k.id
                                      where o.apliciraniPosao_id == posao_id && o.ocjenjuje_id == posao.poslodavac_id
                                      select k.korisnickoIme)
                           .ToList();

            var result = ocjenjeniAplikanti.Select(username => new { username }).ToList();

            return Ok(result);
        }

        [HttpGet]
        public IActionResult GetOcjene(int id)
        {
            var korisnik = _db.KorisnickiNalog.Find(id);
            if( korisnik == null)
                return BadRequest();
            var ocjene=_db.Ocjena.
                Where(o=>o.ocjenjen_id == id).Include("apliciraniPosao").FirstOrDefault();
            return Ok(ocjene);
        }
    }
}
