using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webAPI.Helper;
using webAPI.Models.ViewModels;
using webAPI.Modul_Autentifikacija.Models.ViewModels;
using WebAPI.Data;
using WebAPI.Helper;
using WebAPI.Models;

namespace webAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class KorisnikController : Controller
    {
        private readonly APIDbContext _db;

        public KorisnikController(APIDbContext db)
        {
            _db = db;

        }
        [HttpPost]
        public ActionResult PoslodavacUpdatePodatke([FromBody] PoslodavacUpdateVMcs user)
        {

            var korisnik = _db.KorisnickiNalog.Include(k => (k as Poslodavac).opstina).FirstOrDefault(k => k.email == user.email);
            var opstina = _db.Opstina.FirstOrDefault(o => o.description == user.lokacija);
            korisnik.korisnickoIme = user.korisnickoIme;
            korisnik.poslodavac.ime = user.ime;
            korisnik.poslodavac.prezime = user.prezime;
            korisnik.brojTelefona = user.brojTelefona;
            korisnik.poslodavac.adresa = user.adresa;
            korisnik.poslodavac.opstina_id = opstina.id;
            korisnik.poslodavac.nazivFirme = user.nazivFirme;
            _db.SaveChanges();
            return Ok(new
            {
                Message = "Uspješno ažurirani podaci."
            });


        }
        [HttpPost]
        public ActionResult AplikantUpdatePodatke([FromBody] PoslodavacUpdateVMcs user)
        {

            var korisnik = _db.KorisnickiNalog.Include(k => (k as Aplikant).opstina_rodjenja).FirstOrDefault(k => k.email == user.email);
            var opstina = _db.Opstina.FirstOrDefault(o => o.description == user.lokacija);
            korisnik.korisnickoIme = user.korisnickoIme;
            korisnik.aplikant.ime = user.ime;
            korisnik.aplikant.prezime = user.prezime;
            korisnik.brojTelefona = user.brojTelefona;
            korisnik.aplikant.opstina_rodjenja_id = opstina.id;
     
            _db.SaveChanges();
            return Ok(new
            {
                Message = "Uspješno ažurirani podaci."
            });


        }

        [HttpPost]
        public ActionResult AddDodatneInformacije([FromBody] DodatneInformacijeVM x)
        {
        

            var korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == x.username);
            if (korisnik == null)
                return BadRequest(new
                {
                    Message = "Pogrešni podaci!"
                });
            if (x.slika!=null && x.slika!="")
            {
                byte[] slikaParse = x.slika.ParsirajBase64();
                korisnik.slika =  slikaParse;
            }
            korisnik.poslodavac.ponuda = x.ponuda;
                
            _db.SaveChanges();
            return Ok(new
            {
                Message = "Uspješno dodano."
            });


        }
        [HttpGet]
        public ActionResult GetProfilByUsername(string username)
        {
            KorisnickiNalog korisnik;
          
                korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);
            if (korisnik == null)
                return BadRequest(new
                {
                    Message = "Pogrešni podaci!"
                });
            if ((bool)korisnik.isPoslodavac)
            {
                korisnik = _db.KorisnickiNalog.Include(k => (k as Poslodavac).opstina).FirstOrDefault(k => k.korisnickoIme == username);
                var user = new GetPoslodavacProfilVM()
                {
                    korisnickoIme = korisnik.korisnickoIme,
                    brojTelefona = korisnik.brojTelefona,
                    tipKorisnika="Poslodavac",
                   
                    ponuda = korisnik.poslodavac.ponuda,


                    nazivFirme = korisnik.poslodavac.nazivFirme,
                    opstina = korisnik.poslodavac.opstina.description,
                   


            };

                if (korisnik.slika != null)
                {
                    user.slika = Convert.ToBase64String(korisnik.slika);
                }
                user.prosjecnaocjena = _db.Ocjena
                                                .Where(o => o.ocjenjen_id == korisnik.id)
                                                .Select(o => o.vrijednost).ToList()
                                                .DefaultIfEmpty(0) 
                                                .Average();
                return Ok(user);
            }

            else
            {
                korisnik = _db.KorisnickiNalog.Include(k => (k as Aplikant).opstina_rodjenja).FirstOrDefault(k => k.korisnickoIme == username);
                var user = new AplikantProfilVM()
                {
                    opis = korisnik.aplikant.opis,
                    brojTelefona = korisnik.brojTelefona,
                    opstina = korisnik.aplikant.opstina_rodjenja?.description,
                    iskustvo=korisnik.aplikant.iskustvo,
                    prijedlogSatince=korisnik.aplikant.prijedlogSatince,
                    nivoObrazovanja=korisnik.aplikant.nivoObrazovanja,
                    tipKorisnika = "Aplikant"



                };

                if (korisnik.aplikant.slika != null)
                {
                    user.slika = Convert.ToBase64String(korisnik.aplikant.slika);
                }
                else
                    user.slika = "";
                user.prosjecnaocjena = _db.Ocjena
                                                .Where(o => o.ocjenjen_id == korisnik.id)
                                                .Select(o => o.vrijednost).ToList()
                                                .DefaultIfEmpty(0)
                                                .Average();
                var aplikantPosaoTip=_db.aplikantPosaoTip.Include(ap=>ap.posaoTip).FirstOrDefault(ap=>ap.aplikant_id==korisnik.id);
                if (aplikantPosaoTip != null)
                    user.posaoTip = aplikantPosaoTip.posaoTip.naziv;

                return Ok(user);
            }



          
        }
     
        [HttpGet]
        public ActionResult GetDojmoveByUsername(string username)
        {
            KorisnickiNalog korisnik;

            korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);
            if (korisnik == null)
                return BadRequest(new
                {
                    Message = "Pogrešni podaci!"
                });

            var dojmovi = _db.Ocjena.Where(o => o.ocjenjen_id == korisnik.id).Select(o => new DojamVM()
            {
                komentar = o.komentar,
                username=o.ocjenjuje.korisnickoIme,
                datumKreiranja = o.datum_kreiranja,
                slikaCopy =o.ocjenjuje.slika

            }).ToList();
            foreach (var d in dojmovi)
            {
                if (d.slikaCopy != null)
                {
                    d.slika = Convert.ToBase64String(d.slikaCopy);
                }
                else
                    d.slika = "";

                d.slikaCopy =null;
            }
                                         
            //  string json = JsonConvert.SerializeObject(korisnik);
            return Ok(dojmovi);
        }
        [HttpGet]
        public ActionResult GetById(int id)
        {
            var korisnik = _db.KorisnickiNalog.Find(id);
            if (korisnik == null)
                return BadRequest();
            return Ok(korisnik);
        }
        [HttpPost]
        public ActionResult ObrisiKorisnickiNalog([FromBody] string userName)
        {

            var korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == userName);
            korisnik.status = 0;
            _db.SaveChanges();
            return Ok(new
            {
                Message = "Uspješno obrisan korisnički nalog."
            });


        }

    }
}
