using Microsoft.AspNetCore.Mvc;
using WebAPI.Core;
using WebAPI.Helper;
using WebAPI.Models.ViewModels;
using WebAPI.Models;
using webAPI.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using WebAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{

    [ApiController]
    [Route("[controller]/[action]")]
    public class PosaoController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly APIDbContext _db;
        public PosaoController(IUnitOfWork unitOfWork, APIDbContext dbContext)
        {
            _unitOfWork = unitOfWork;
            _db = dbContext;
        }
        [Authorize]
        [HttpGet]

        public ActionResult GetAll()
        {
            var poslovi = from p in _db.Posao
                          join o in _db.Opstina on p.opstina_id equals o.id
                          join pt in _db.PosaoTip on p.posaoTip_id equals pt.id
                          join poslodavac in _db.Poslodavac on p.poslodavac_id equals poslodavac.id
                          join k in _db.KorisnickiNalog on p.poslodavac_id equals k.id
                          join pp in _db.PosaoPitanje on p.id equals pp.posao_id
                          where p.status == "Aktivan"
                          group new { p, o.description, pt.naziv, k.korisnickoIme } by new
                          { id = p.id, p.naziv, p.deadline, p.opis, p.status, p.brojAplikanata, o.description, tipPosla = pt.naziv, k.korisnickoIme, p.adresa, p.Cijena, p.opstina_id, p.posaoTip_id } into g
                          select new PosaoGetAllVM
                          {
                              id = g.Key.id,
                              naziv = g.Key.naziv,
                              poslodavac = g.Key.korisnickoIme,
                              opis = g.Key.opis,
                              status = g.Key.status,
                              brojRadnika = g.Key.brojAplikanata,
                              opstina = g.Key.description,                         
                              posaoTip = g.Key.tipPosla,
                              rasporedOdgovori = (from pitanje in _db.Pitanje
                                                  join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                                  join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                                  join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                                  where pp.posao_id == g.Key.id && pitanje.id == 1
                                                  select podg.odgovor).ToList(),
                              nacinPlacanja = (from pitanje in _db.Pitanje
                                               join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                               join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                               join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                               where pp.posao_id == g.Key.id && pitanje.id == 2
                                               select podg.odgovor).First(),
                              dodatnoPlacanjeOdgovori = (from pitanje in _db.Pitanje
                                                         join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                                         join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                                         join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                                         where pp.posao_id == g.Key.id && pitanje.id == 3
                                                         select podg.odgovor).ToList(),
                              adresa = g.Key.adresa,
                              cijena = g.Key.Cijena,
                           
                              deadline = g.Key.deadline
                          };


            return Ok(poslovi);
        }
            
            [HttpGet]
            public List<Posao> GetOdredeniBrojPoslova(int brojposlova=5)
            {
               return _unitOfWork.Posao.GetOdredeniBrojPoslova(brojposlova);
            }
        [HttpGet]
        public IActionResult GetPosloveByUsername(string username)
        {
            var korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);
            if (korisnik == null)
                return BadRequest();
          
            var poslovi = from p in _db.Posao
                         join o in _db.Opstina on p.opstina_id equals o.id
                         join pt in _db.PosaoTip on p.posaoTip_id equals pt.id
                         join poslodavac in _db.Poslodavac on p.poslodavac_id equals poslodavac.id
                         join k in _db.KorisnickiNalog on p.poslodavac_id equals k.id
                         join ap in _db.ApliciraniPosao on p.id equals ap.posao_id into joinResult
                         from ap in joinResult.DefaultIfEmpty()
                         join pp in _db.PosaoPitanje on p.id equals pp.posao_id
                         where (ap.status == "Aktivan" || ap.status==null) && k.id == korisnik.id && p.status!="Obrisan"
                         group new { p, o.description, pt.naziv, k.korisnickoIme } by new
                         { id = p.id, p.naziv,p.deadline, p.opis, p.status, p.brojAplikanata, o.description, tipPosla = pt.naziv, k.korisnickoIme,p.adresa,p.Cijena,p.opstina_id,p.posaoTip_id } into g
                         select new PosaoGetByUsernameVM
                         {
                             id = g.Key.id,
                             poslodavac=g.Key.korisnickoIme,
                        naziv = g.Key.naziv,
                        opis = g.Key.opis,
                        status = g.Key.status,
                        brojRadnika = g.Key.brojAplikanata,
                        opstina = g.Key.description,
                        opstina_id=g.Key.opstina_id,
                        posaoTip_id=g.Key.posaoTip_id,
                        posaoTip = g.Key.tipPosla,                           
                        rasporedOdgovori = (from pitanje in _db.Pitanje
                                    join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                    join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                    join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                    where pp.posao_id == g.Key.id && pitanje.id == 1
                                    select podg.id).ToList(),
                        nacinPlacanja= (from pitanje in _db.Pitanje
                                        join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                        join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                        join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                        where pp.posao_id == g.Key.id && pitanje.id == 2
                                        select podg.id).First(),
                        dodatnoPlacanjeOdgovori = (from pitanje in _db.Pitanje
                                                   join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                                   join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                                   join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                                   where pp.posao_id == g.Key.id && pitanje.id == 3
                                                   select podg.id).ToList(),
                        adresa=g.Key.adresa,
                        cijena=g.Key.Cijena,
                        brojApliciranja = _db.ApliciraniPosao.Where(ap=>ap.posao_id==g.Key.id).Count(),
                        deadline=g.Key.deadline
                    };



           //  var poslovi= _db.Posao.Where(p=>p.poslodavac.korisnickoIme==username).ToList();
            return Ok(poslovi);
        }

        [HttpGet]
        public IActionResult GetAplikantZavrsenePosloveByUsername(string username)
        {
            var korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);
            if (korisnik == null)
                return BadRequest();

            var result = from p in _db.Posao
                         join o in _db.Opstina on p.opstina_id equals o.id
                         join pt in _db.PosaoTip on p.posaoTip_id equals pt.id
                         join poslodavac in _db.Poslodavac on p.poslodavac_id equals poslodavac.id
                         join k in _db.KorisnickiNalog on p.poslodavac_id equals k.id
                         join ap in _db.ApliciraniPosao on p.id equals ap.posao_id into joinResult
                         from ap in joinResult.DefaultIfEmpty()
                         join pp in _db.PosaoPitanje on p.id equals pp.posao_id
                         where ap.aplikant_id == korisnik.id && p.status == "Zavrsen"
                         group new { p, o.description, pt.naziv, k.korisnickoIme } by new
                         { id = p.id, p.naziv, p.deadline, p.opis, p.status, p.brojAplikanata, o.description, tipPosla = pt.naziv, k.korisnickoIme, p.adresa, p.Cijena, p.opstina_id, p.posaoTip_id } into g
                         select new PosaoGetByUsernameVM
                         {
                             id = g.Key.id,
                             poslodavac = g.Key.korisnickoIme,
                             naziv = g.Key.naziv,
                             opis = g.Key.opis,
                             status = g.Key.status,
                             brojRadnika = g.Key.brojAplikanata,
                             opstina = g.Key.description,
                             opstina_id = g.Key.opstina_id,
                             posaoTip_id = g.Key.posaoTip_id,
                             posaoTip = g.Key.tipPosla,
                             rasporedOdgovori = (from pitanje in _db.Pitanje
                                                 join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                                 join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                                 join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                                 where pp.posao_id == g.Key.id && pitanje.id == 1
                                                 select podg.id).ToList(),
                             nacinPlacanja = (from pitanje in _db.Pitanje
                                              join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                              join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                              join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                              where pp.posao_id == g.Key.id && pitanje.id == 2
                                              select podg.id).First(),
                             dodatnoPlacanjeOdgovori = (from pitanje in _db.Pitanje
                                                        join pp in _db.PosaoPitanje on pitanje.id equals pp.pitanje_id
                                                        join po in _db.PitanjeOdgovor on pp.id equals po.posaoPitanje_id
                                                        join podg in _db.PonudjeniOdgovor on po.ponudjeniOdgovor_id equals podg.id
                                                        where pp.posao_id == g.Key.id && pitanje.id == 3
                                                        select podg.id).ToList(),
                             adresa = g.Key.adresa,
                             cijena = g.Key.Cijena,
                             brojApliciranja = _db.ApliciraniPosao.Where(ap => ap.posao_id == g.Key.id).Count(),
                             deadline = g.Key.deadline
                         };






            // var poslovi= _db.Posao.Where(p=>p.poslodavac.korisnickoIme==username).ToList();
            return Ok(result);
        }
        [HttpGet]
        public ActionResult GetById(int id)
        {
            var posao = _unitOfWork.Posao.GetById(id);
            if (posao == null)
            {
                return NotFound();
            }
            return Ok(posao);
        }
        [HttpPost]
        public ActionResult Add(PosaoAddVM p)
        {
        
            _unitOfWork.Posao.AddPosao(p);
            _unitOfWork.Complete();
            return Ok(new  { Message="Uspjesno dodan posao" });
        }
        [HttpDelete]
        public ActionResult DeleteById(int id)
        {

            var posao = _unitOfWork.Posao.GetById(id);
            if (posao == null)
                return BadRequest("Posao ne postoji");
            posao.status = "Obrisan";
            _db.SaveChanges();
            return Ok(new { Message = "Uspjesno obrisan posao" });

        }
        [HttpPost]
        public ActionResult Update(PosaoAddVM posao)
        {
            var org = _db.Posao.FirstOrDefault(p => p.id == posao.posao_id);
            if (posao.posaoTip_id == -1)
            {
                
                    _db.PosaoTip.Add(new PosaoTip() { naziv = posao.posaoTip });
                    _db.SaveChanges();
                    posao.posaoTip_id = _db.PosaoTip.FirstOrDefault(p => p.naziv == posao.posaoTip).id;
                
            }
            var opstinaa = posao.opstina_id;

            org.naziv = posao.naziv;
            org.adresa= posao.adresa;
            org.opstina_id= posao.opstina_id;
            org.posaoTip_id = posao.posaoTip_id;
            org.opis= posao.opis;
            org.Cijena = posao.cijena;
            org.brojAplikanata = posao.brojAplikanata;
            if (posao.deadline != 0)
                org.deadline = DateTime.Parse(org.deadline).AddDays(posao.deadline).ToString("dd.MM.yyyy. HH:mm:ss");


            
            var posaoPitanja = _db.PosaoPitanje.Where(p => p.posao_id == org.id).ToList();
            var posaoPitanjeRadnoVrijeme = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id == org.id);
            var posaoPitanjeNacinPlacanja = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == org.id);
            var posaoPitanjeDodatnoPlacanje = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == org.id);
           var temp1= _db.PitanjeOdgovor.Where(o => o.posaoPitanje_id == posaoPitanjeRadnoVrijeme.id).ToList();
            var temp2 = _db.PitanjeOdgovor.Where(o => o.posaoPitanje_id == posaoPitanjeNacinPlacanja.id).ToList();
            var temp3=_db.PitanjeOdgovor.Where(o => o.posaoPitanje_id == posaoPitanjeDodatnoPlacanje.id).ToList();
            _db.PitanjeOdgovor.RemoveRange(temp1);
            _db.PitanjeOdgovor.RemoveRange(temp2);
            _db.PitanjeOdgovor.RemoveRange(temp3);
            _db.SaveChanges();
            foreach (var odgovor in posao.radnoVrijeme)
            {
                _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme.id, ponudjeniOdgovor_id = odgovor });
            }
            _db.SaveChanges();
            foreach (var odgovor in posao.dodatnoPlacanje)
            {
                _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje.id, ponudjeniOdgovor_id = odgovor });
            }
            _db.SaveChanges();
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja.id, ponudjeniOdgovor_id = posao.vrstaPlacanja });
            _db.SaveChanges();

            return Ok((new { Message = "Uspjesno spremljene promjene" })  )  ;
        }
        [HttpGet]
        public IActionResult Paging(string username, int pageNumber = 1, int pageSize = 6,string status="Aktivan")
        {
            var korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);
            if (korisnik == null)
                return BadRequest();
            var poslovi = _db.Posao
                .Where(p => p.poslodavac.korisnickoIme == username&&p.status==status)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(poslovi);
        }
    }
}
