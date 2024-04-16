using Microsoft.EntityFrameworkCore;
using webAPI.Models.ViewModels;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Models.ViewModels;

namespace WebAPI.Core.Repositories
{
    public class PosaoRepository : GenericRepository<Posao>, IPosaoRepository
    {
        public PosaoRepository(APIDbContext db, ILogger logger) : base(db, logger)
        {
        }
           public  List<Posao> GetOdredeniBrojPoslova(int brojPoslova)
           {
               return _db.Posao.Take(brojPoslova).Include("opstina").Include("poslodavac").ToList() ;
           }
        public   void AddPosao(PosaoAddVM posao)
        {
            var poslodavac = _db.Poslodavac.FirstOrDefault(p => p.korisnickoIme == posao.poslodavacUserName);
                if (posao.posaoTip_id == -1)
            {
                _db.PosaoTip.Add(new PosaoTip() { naziv = posao.posaoTip });
                _db.SaveChanges();
                posao.posaoTip_id = _db.PosaoTip.FirstOrDefault(p => p.naziv == posao.posaoTip).id;
            }
               
          

            _db.Posao.Add(new Posao { 
            naziv=posao.naziv,
            adresa=posao.adresa,
            opis=posao.opis,
            opstina_id=posao.opstina_id,
            datum_kreiranja=DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
            deadline=DateTime.Now.AddDays(posao.deadline).ToString("dd.MM.yyyy. HH:mm:ss"),
            Cijena=posao.cijena,
            brojAplikanata=posao.brojAplikanata,
            posaoTip_id=posao.posaoTip_id,
            poslodavac=poslodavac,
            status="Aktivan"

            });
            _db.SaveChanges();

            var postavljeniPosao=_db.Posao.FirstOrDefault(p=>p.poslodavac_id==poslodavac.id && p.naziv==posao.naziv);
            _db.PosaoPitanje.Add(new PosaoPitanje { pitanje_id = 1, posao_id = postavljeniPosao.id });
            _db.PosaoPitanje.Add(new PosaoPitanje { pitanje_id = 2, posao_id = postavljeniPosao.id });
            _db.PosaoPitanje.Add(new PosaoPitanje { pitanje_id = 3, posao_id = postavljeniPosao.id });
            _db.SaveChanges();
            var posaoPitanja=_db.PosaoPitanje.Where(p=>p.posao_id==postavljeniPosao.id).ToList();
            var posaoPitanjeRadnoVrijeme = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id==postavljeniPosao.id);
            var posaoPitanjeNacinPlacanja = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == postavljeniPosao.id);
            var posaoPitanjeDodatnoPlacanje = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == postavljeniPosao.id);

            foreach (var odgovor in posao.radnoVrijeme)
            {
                _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme.id, ponudjeniOdgovor_id = odgovor });
            }
            foreach (var odgovor in posao.dodatnoPlacanje)
            {
                _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje.id, ponudjeniOdgovor_id = odgovor });
            }
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja.id, ponudjeniOdgovor_id = posao.vrstaPlacanja });
            _db.SaveChanges();
        }
    }
}
