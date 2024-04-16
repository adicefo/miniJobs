using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Helper;
using WebAPI.Models;

namespace WebAPI.Modul_TestniPodaci.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class TestniPodaciController : Controller
    {
        private readonly APIDbContext _db;
        public TestniPodaciController(APIDbContext dbContext)
        {
            _db = dbContext;
        }
        [HttpPost]
        public ActionResult Generisi()
        {
            var drzave = new List<Drzava>();
            var opstine = new List<Opstina>();
            var pitanje = new List<Pitanje>();
            var PosaoTipovi = new List<PosaoTip>();
            var aplikanti = new List<Aplikant>();
            var poslodavci = new List<Poslodavac>();
            var ponudjeniOdgovori = new List<PonudjeniOdgovor>();
            var apliciraniPoslovi = new List<ApliciraniPosao>();


            var poslovi = new List<Posao>();
         

            pitanje.Add(new Pitanje { naziv = "Koje je radno vrijeme posla? " });
            pitanje.Add(new Pitanje { naziv = "Način plaćanja? " });
            pitanje.Add(new Pitanje { naziv = "Da li plaćanje? " });
            var rasporedi = new List<string> {
                "prva smjena",
                "druga smjena",
                "noćna smjena",
                "vikend",
                "1h-2h",
                "2h-3h",
                "4h i više",
                "po dogovoru",
                "pon-pet",
                "vikend",
                "praznici",
                "dan smjena",
             };
            var tipoviPosla = new List<string> {
            "Čišćenje",
                "Dostavljanje hrane",
                "Vrtlarenje",
                "Cijepanje drva",
                "Popravak električnih aparata",
                "Čuvanje kućnih ljubimaca",
                "Pomoć u kući",
                "Pomoć u kupovini",
                "Pomoć pri oblačenju i kupanju",
                "Priprema obroka",
                "Pomoć u održavanju higijene doma",
                "Pomoć u organizaciji lijekova",
                "Uklanjanje stabala i grmlja",
                "Keramičar",
                "Vodoinstalater",
                "Konobar",
                "Utovar/istovar",
                "Pomoćni radnik",
                "Kućna njega",
                "Radnik",
                "Električar"
            };
            foreach (var r in rasporedi)
            {
                ponudjeniOdgovori.Add(new PonudjeniOdgovor { odgovor =r, pitanje_id = 1 });
            }
            foreach (var tp in tipoviPosla)
            {
                PosaoTipovi.Add(new PosaoTip { naziv = tp });
            }
            ponudjeniOdgovori.Add(new PonudjeniOdgovor { odgovor = "po satu", pitanje_id = 2 });
            ponudjeniOdgovori.Add(new PonudjeniOdgovor { odgovor = "dnevnica", pitanje_id = 2 });
            ponudjeniOdgovori.Add(new PonudjeniOdgovor { odgovor = "po dogovoru", pitanje_id = 2 });


            ponudjeniOdgovori.Add(new PonudjeniOdgovor { odgovor = "Prekovremene sate", pitanje_id = 3});
            ponudjeniOdgovori.Add(new PonudjeniOdgovor { odgovor = "Topli obrok", pitanje_id = 3 });




            drzave.Add(new Drzava { naziv = "BiH" });
            drzave.Add(new Drzava { naziv = "HR" });
            drzave.Add(new Drzava { naziv = "Njemacka" });
            drzave.Add(new Drzava { naziv = "Austrija" });
            drzave.Add(new Drzava { naziv = "SAD" });
            drzave.Add(new Drzava { naziv = "Malezija" });

            var lokacije = new List<string> {"Banovići", "Banja Luka", "Berkovići", "Bihać", "Bijeljina", "Bileća", "Bosanska Krupa",
                                             "Bosanski Petrovac", "Bosansko Grahovo", "Bratunac", "Brčko", "Breza", "Brod", "Bugojno",
                                             "Busovača", "Bužim", "Cazin", "Centar", "Čajniče", "Čapljina", "Čelić", "Čelinac", "Čitluk",
                                             "Derventa", "Doboj", "Doboj-Istok", "Doboj-Jug", "Dobretići", "Domaljevac-Šamac", "Donji Vakuf",
                                             "Donji Žabar", "Drvar", "Foča (FBiH)", "Fojnica", "Gacko", "Glamoč", "Goražde",
                                             "Gornji Vakuf-Uskoplje", "Gračanica", "Gradačac", "Gradiška", "Grude", "Hadžići", "Han-Pijesak",
                                             "Ilidža", "Ilijaš", "Jablanica", "Jajce", "Kakanj", "Kalesija", "Kalinovik", "Kiseljak", "Kladanj",
                                             "Ključ", "Konjic", "Kotor Varoš", "Kreševo", "Krupa na Uni", "Krupanj (RS)", "Kupres", "Laktaši",
                                             "Livno", "Lopare", "Lukavac", "Ljubinje", "Ljubuški", "Maglaj", "Milići", "Modriča", "Mostar",
                                             "Mrkonjić Grad", "Neum", "Nevesinje", "Novi Grad (Bosanski Novi)", "Novi Grad (Sarajevo)",
                                             "Novo Sarajevo", "Odžak", "Olovo", "Orašje", "Osmaci", "Oštra Luka", "Pale-Prača", "Pelagićevo",
                                             "Petrovac", "Petrovo", "Posušje", "Prozor-Rama", "Prijedor", "Prnjavor", "Ravno", "Ribnik", "Rogatica",
                                             "Rudo", "Sanski Most", "Sapna", "Sarajevo-Centar", "Sarajevo-Novi Grad", "Sarajevo-Stari Grad",
                                             "Sarajevo-Čengić Vila", "Sarajevo-Ilidža", "Sarajevo-Nahorevo", "Sarajevo-Vogošća", "Srebrenik",
                                             "Srebrenica", "Sokolac", "Srbac", "Srednji", "Stari Grad", "Šekovići", "Šipovo", "Široki Brijeg",
                                             "Štrpci", "Teočak", "Teslić", "Tešanj", "Tomislavgrad", "Travnik", "Trebinje",
                                             "Trnovo","Tuzla","Ugljevik","Usora","Vareš"
                                             ,"Velika Kladuša","Visoko","Višegrad",
                                             "Vitez","Vlasenica","Vogošća","Vukosavlje","Zavidovići",
                                              "Zenica","Zvornik","Žepče","Živinice" };

            foreach (var l in lokacije)
            {
                opstine.Add(new Opstina { description = l, drzava = drzave[0] });
            }


            poslodavci.Add(new Poslodavac { ime = "Ahmet", prezime = "Smajic", korisnickoIme = "ahmet", lozinka = "test",opstina_id=1 });
            poslodavci.Add(new Poslodavac { ime = "Almin", prezime = "Besic", korisnickoIme = "almin", lozinka = "test", opstina_id = 21 });
            poslodavci.Add(new Poslodavac { ime = "Edin", prezime = "Elez", korisnickoIme = "edin", lozinka = "test", opstina_id = 12 });
            poslodavci.Add(new Poslodavac { ime = "Nejla", prezime = "Mijic", korisnickoIme = "nejla", lozinka = "test", opstina_id = 9 });
            poslodavci.Add(new Poslodavac { ime = "Edvin", prezime = "Topic", korisnickoIme = "edvin", lozinka = "test", opstina_id = 6 });


            poslovi.Add(new Posao
            {
                poslodavac_id = 5,
                naziv = "Potrebni radnici za utovar/istovar robe",
                opis = "<p>Kratki opis posla za posao tipa utovar/istovar robe obuhvata aktivnosti vezane za fizičko preme&scaron;tanje i manipulaciju robom prilikom njenog utovara na vozilo ili istovara sa vozila. Ovaj posao uključuje sljedeće zadatke:</p>  <ol>  <li>  <p>Utovar robe: Radnik će biti odgovoran za pravilno i efikasno utovaranje robe na vozilo. To može uključivati pakovanje, sortiranje i organizaciju robe u odgovarajuće palete, sanduke ili kontejnere. Također će biti potrebno pridržavanje sigurnosnih standarda kako bi se spriječile o&scaron;tećenja robe prilikom utovara.</p>  </li>  <li>  <p>Istovar robe: Radnik će biti zadužen za praćenje pristigle robe, prepoznavanje odredi&scaron;ta i pravilno istovaranje robe sa vozila. To može uključivati praćenje inventara, provjeru ispravnosti i kvalitete robe prilikom istovara te pravilno raspoređivanje robe na odgovarajuće lokacije.</p>  </li>  <li>  <p>Manipulacija robom: Ovaj posao može uključivati i manipulaciju robom unutar skladi&scaron;ta ili radnog prostora. To može obuhvatati premje&scaron;tanje i organizaciju robe na policama ili drugim mjestima za skladi&scaron;tenje, kao i pripremu robe za daljnju distribuciju ili transport.</p>  </li>  <li>  <p>Sigurnost: Radnik treba biti svjestan sigurnosnih protokola i postupati u skladu s njima kako bi se osigurala sigurnost sebe i drugih. To može uključivati pravilno kori&scaron;tenje za&scaron;titne opreme, sigurno rukovanje teretom te po&scaron;tivanje sigurnosnih uputa i propisa.</p>  </li> </ol>  <p>Ukratko, posao utovara/istovara robe obuhvata fizički zahtjevne zadatke vezane za premje&scaron;tanje i manipulaciju robom kako bi se osiguralo pravilno i sigurno preme&scaron;tanje robe na odgovarajuće lokacije.</p> ",

                datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                brojAplikanata = 6,
                status = "Aktivan",
                Cijena = 100,
                opstina_id = 10,
                deadline = DateTime.Now.AddDays(7).ToString("dd.MM.yyyy. HH:mm:ss"),
                posaoTip_id = 17
            });
            poslovi.Add(new Posao
            {
                poslodavac_id = 3,
                naziv = "Traži se konobar",
                opis = "<p>Posao konobara obuhvata zadatke vezane za pružanje usluga gostima u ugostiteljskom objektu kao &scaron;to je restoran, kafić ili bar. Ovaj posao uključuje sljedeće aktivnosti:</p>  <ol>  <li>  <p>Usluživanje gostiju: Konobar će biti odgovoran za dobrodo&scaron;licu gostima, praćenje njihovih potreba i pružanje usluga u skladu s njihovim zahtjevima. To može uključivati preporuku jela i pića, uzimanje narudžbi, posluživanje hrane i pića te osiguranje da gosti budu zadovoljni tijekom cijelog boravka.</p>  </li>  <li>  <p>Priprema stolova: Konobar će biti zadužen za pripremu stolova prije dolaska gostiju. To uključuje postavljanje pribora za jelo, salveta, ča&scaron;a i tanjura te osiguravanje čistoće i urednosti stolova kako bi se gostima pružio ugodan dojam.</p>  </li>  <li>  <p>Održavanje inventara: Konobar će biti odgovoran za održavanje inventara pića, hrane i ostalih potrep&scaron;tina. To može uključivati praćenje zaliha, naručivanje potrebnih namirnica i osiguravanje da su sve potrebne stavke dostupne za pružanje usluga gostima.</p>  </li>  <li>  <p>Naplata i obrada plaćanja: Konobar će trebati obrađivati račune gostiju, pružati im informacije o cijenama, primati plaćanja i izdavati potrebne potvrde ili račune. To zahtijeva preciznost i pažnju kako bi se osiguralo točno fakturiranje i naplata.</p>  </li> </ol> ",

                datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                brojAplikanata = 2,
                Cijena = 70,
                opstina_id = 10,
                deadline = DateTime.Now.AddDays(5).ToString("dd.MM.yyyy. HH:mm:ss"),
                status = "Aktivan",
                posaoTip_id = 16
            });
            poslovi.Add(new Posao
            {
                poslodavac_id = 1,
                naziv = "Potreban električar",
                opis = "<p>Potrebno popraviti ve&scaron; ma&scaron;inu.</p> ",
                datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                brojAplikanata = 1,
                Cijena = -2,
                opstina_id = 16,
                deadline = DateTime.Now.AddDays(4).ToString("dd.MM.yyyy. HH:mm:ss"),
                status = "Aktivan",
                posaoTip_id = 21
            });
            poslovi.Add(new Posao
            {
                poslodavac_id = 1,
                naziv = "Potrebna čistačica",
                opis = "<p>Čistačicu kuće obuhvata zadatke vezane za održavanje čistoće i urednosti prostora. Ovaj posao uključuje sljedeće aktivnosti:</p>  <ol>  <li>  <p>Či&scaron;ćenje prostora: Čistačica će biti odgovorna za redovito či&scaron;ćenje prostorija, uključujući pra&scaron;enje, usisavanje, brisanje podova i povr&scaron;ina, či&scaron;ćenje kupatila i kuhinje te uklanjanje otpada. Cilj je održavati čist i ugodan prostor za stanovanje ili rad.</p>  </li>  <li>  <p>Održavanje higijene: Čistačica će se brinuti o higijeni prostora, uključujući či&scaron;ćenje sanitarnih prostorija, dezinfekciju povr&scaron;ina, či&scaron;ćenje kuhinjskih povr&scaron;ina i uređaja te osiguravanje da su svi prostori higijenski sigurni.</p>  </li>  <li>  <p>Organizacija prostora: Čistačica će pomoći u organizaciji prostora, uključujući sređivanje namje&scaron;taja, sortiranje i slaganje predmeta te održavanje općeg reda. To uključuje spremanje kreveta, pospremanje stvari na njihova mjesta i osiguravanje da prostor izgleda uredno.</p>  </li>  <li>  <p>Održavanje inventara i potrep&scaron;tina: Čistačica će pratiti zalihe i potrebne potrep&scaron;tine za či&scaron;ćenje, kao &scaron;to su sredstva za či&scaron;ćenje, krpe, spužve i ostali alati. Osiguravanje da su potrebni materijali dostupni olak&scaron;ava učinkovito obavljanje posla.</p>  </li> </ol>  <p>Ukratko, posao čistačice kuće obuhvata redovito či&scaron;ćenje, održavanje higijene prostora, organizaciju prostora i brigu o inventaru. Čistačica treba biti temeljita, pažljiva i marljiva kako bi osigurala čist i ugodan prostor za stanovanje ili rad.</p> ",
                datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                brojAplikanata = 1,
                Cijena = 70,
                opstina_id = 20,
                deadline = DateTime.Now.AddDays(3).ToString("dd.MM.yyyy. HH:mm:ss"),
                posaoTip_id = 1,
                status = "Aktivan"
            });
            poslovi.Add(new Posao
            {
                poslodavac_id = 2,
                naziv = "Traži se radnik za dostavu hrane",
                opis = "<p>Ukratko, posao dostavljača hrane obuhvaća preuzimanje i dostavu hrane, upravljanje vozilom, komunikaciju s klijentima, sigurnost hrane i brzu dostavu. Dostavljač hrane treba biti odgovoran, komunikativan i sposoban upravljati vremenom kako bi pružio kvalitetnu uslugu dostave hrane.</p> ",
                datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                brojAplikanata = 1,
                Cijena = 8,
                opstina_id = 30,
                deadline = DateTime.Now.AddDays(2).ToString("dd.MM.yyyy. HH:mm:ss"),
                posaoTip_id = 2,
                status = "Aktivan"
            });
            apliciraniPoslovi.Add(new ApliciraniPosao { 
            posao_id= 1,
            datum_apliciranja= DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
            status="Aktivan",
            aplikant_id=6
            });
            apliciraniPoslovi.Add(new ApliciraniPosao
            {
                posao_id = 2,
                datum_apliciranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                status = "Aktivan",
                aplikant_id = 7
            });
            apliciraniPoslovi.Add(new ApliciraniPosao
            {
                posao_id = 2,
                datum_apliciranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                status = "Aktivan",
                aplikant_id = 8
            });
            apliciraniPoslovi.Add(new ApliciraniPosao
            {
                posao_id = 2,
                datum_apliciranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                status = "Aktivan",
                aplikant_id = 9
            });
            apliciraniPoslovi.Add(new ApliciraniPosao
            {
                posao_id = 2,
                datum_apliciranja = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                status = "Aktivan",
                aplikant_id = 10
            });
       

            aplikanti.Add(new Aplikant
            {
                datumRegistracije = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                ime = "Adil",
                prezime = "Kurić",
                korisnickoIme = "adilkuric",
                lozinka = "test",
                opstina_rodjenja_id= 1,
                
            });
            aplikanti.Add(new Aplikant
            {
                datumRegistracije = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                ime = "Almina",
                prezime = "Topić",
                korisnickoIme = "alminatopic",
                lozinka = "test",
                opstina_rodjenja_id = 2,

            });
            aplikanti.Add(new Aplikant
            {
                datumRegistracije = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                ime = "Adel",
                prezime = "Kadić",
                korisnickoIme = "adel1999",
                lozinka = "test",
                opstina_rodjenja_id = 5,

            });

            aplikanti.Add(new Aplikant
            {
                datumRegistracije = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                ime = "Amar",
                prezime = "Dizdar",
                korisnickoIme = "dizdar001",
                lozinka = "test",
                opstina_rodjenja_id = 6,

            });
            aplikanti.Add(new Aplikant
            {
                datumRegistracije = DateTime.Now.ToString("dd.MM.yyyy. HH:mm:ss"),
                ime = "Emir",
                prezime = "Smajić",
                korisnickoIme = "smajke20",
                lozinka = "test",
                opstina_rodjenja_id = 6,

            });

        

            _db.AddRange(opstine);
            _db.AddRange(poslodavci);
            _db.AddRange(drzave);
            _db.AddRange(PosaoTipovi);
            _db.AddRange(pitanje);
            _db.SaveChanges();
            _db.AddRange(aplikanti);
            _db.AddRange(poslovi);
            _db.SaveChanges();

           
            _db.AddRange(ponudjeniOdgovori);
            _db.AddRange(apliciraniPoslovi);
            _db.SaveChanges();
          




       
            // pitanja odgovori za 1. posao
            for (int i = 1; i <= 5; i++)
            {
                _db.PosaoPitanje.Add(new PosaoPitanje { pitanje_id = 1, posao_id = i });
                _db.PosaoPitanje.Add(new PosaoPitanje { pitanje_id = 2, posao_id = i });
                _db.PosaoPitanje.Add(new PosaoPitanje { pitanje_id = 3, posao_id = i });

            }
            _db.SaveChanges();
            // pitanja odgovori za 1. posao
            var posaoPitanja = _db.PosaoPitanje.Where(p => p.posao_id == 1).ToList();
            var posaoPitanjeRadnoVrijeme = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id == 1);
            var posaoPitanjeNacinPlacanja = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == 1);
            var posaoPitanjeDodatnoPlacanje = posaoPitanja.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == 1);



            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme.id, ponudjeniOdgovor_id = 9 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje.id, ponudjeniOdgovor_id = 17 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja.id, ponudjeniOdgovor_id = 14 });

            // pitanja odgovori za 2. posao
            var posaoPitanja2 = _db.PosaoPitanje.Where(p => p.posao_id == 2).ToList();
            var posaoPitanjeRadnoVrijeme2 = posaoPitanja2.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id == 2);
            var posaoPitanjeNacinPlacanja2 = posaoPitanja2.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == 2);
            var posaoPitanjeDodatnoPlacanje2 = posaoPitanja2.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == 2);



            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme2.id, ponudjeniOdgovor_id = 9 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme2.id, ponudjeniOdgovor_id = 2 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme2.id, ponudjeniOdgovor_id = 1 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje2.id, ponudjeniOdgovor_id = 16 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje2.id, ponudjeniOdgovor_id = 17 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja2.id, ponudjeniOdgovor_id = 14 });


            // pitanja odgovori za 3. posao
            var posaoPitanja3 = _db.PosaoPitanje.Where(p => p.posao_id == 3).ToList();
            var posaoPitanjeRadnoVrijeme3 = posaoPitanja3.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id == 3);
            var posaoPitanjeNacinPlacanja3 = posaoPitanja3.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == 3);
            var posaoPitanjeDodatnoPlacanje3 = posaoPitanja3.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == 3);



            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme3.id, ponudjeniOdgovor_id = 8 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja3.id, ponudjeniOdgovor_id = 15 });

            // pitanja odgovori za 4. posao
            var posaoPitanja4 = _db.PosaoPitanje.Where(p => p.posao_id == 4).ToList();
            var posaoPitanjeRadnoVrijeme4 = posaoPitanja4.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id == 4);
            var posaoPitanjeNacinPlacanja4 = posaoPitanja4.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == 4);
            var posaoPitanjeDodatnoPlacanje4 = posaoPitanja4.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == 4);



            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme4.id, ponudjeniOdgovor_id = 9 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme4.id, ponudjeniOdgovor_id = 1 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje4.id, ponudjeniOdgovor_id = 16 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje4.id, ponudjeniOdgovor_id = 17 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja4.id, ponudjeniOdgovor_id = 14 });

            // pitanja odgovori za 5. posao
            var posaoPitanja5 = _db.PosaoPitanje.Where(p => p.posao_id == 5).ToList();
            var posaoPitanjeRadnoVrijeme5 = posaoPitanja5.FirstOrDefault(p => p.pitanje_id == 1 && p.posao_id == 5);
            var posaoPitanjeNacinPlacanja5 = posaoPitanja5.FirstOrDefault(p => p.pitanje_id == 2 && p.posao_id == 5);
            var posaoPitanjeDodatnoPlacanje5 = posaoPitanja5.FirstOrDefault(p => p.pitanje_id == 3 && p.posao_id == 5);



            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeRadnoVrijeme5.id, ponudjeniOdgovor_id = 2 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje5.id, ponudjeniOdgovor_id = 16 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeDodatnoPlacanje5.id, ponudjeniOdgovor_id = 17 });
            _db.PitanjeOdgovor.Add(new PitanjeOdgovor { posaoPitanje_id = posaoPitanjeNacinPlacanja5.id, ponudjeniOdgovor_id = 14 });
            _db.SaveChanges();

            return Count();
        }
        [HttpGet]
        public ActionResult Count()
        {
            Dictionary<string, int> data = new Dictionary<string, int>();
            data.Add("Poslodavac", _db.Poslodavac.Count());
            data.Add("Aplikant", _db.Aplikant.Count());
            data.Add("KorisnickiNalog", _db.KorisnickiNalog.Count());
            data.Add("Opstina", _db.Opstina.Count());
            data.Add("PosaoTip", _db.PosaoTip.Count());
            data.Add("Pitanje", _db.Pitanje.Count());
            data.Add("Posao", _db.Posao.Count());
            data.Add("Drzava", _db.Drzava.Count());

            return Ok(data);
        }
    }
}
