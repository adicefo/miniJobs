using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Text;
using WebAPI.Data;
using WebAPI.Models;
using webAPI.Modul_Autentifikacija.Models.ViewModels;
using webAPI.Helper;
using WebAPI.Helper;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;
using webAPI.Models;
using Azure.Identity;
using System.Buffers.Text;

namespace webAPI.Modul_Autentifikacija
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class AutentifikacijaController : Controller
    {
        private readonly APIDbContext _db;

        public AutentifikacijaController(APIDbContext db)
        {
            _db = db;

        }
        [HttpPost]
        public ActionResult Login([FromBody] LoginVM login)
        {

            var korisnik = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == login.username);
            if (korisnik == null || korisnik.status==0)
                return BadRequest("Korisnik ne postoji!");
            // radi bržeg testiranja ovo sam zakomentarisao
            /*if (!korisnik.emailPotvrđen)
                return BadRequest("Email nije verifikovan.");*/
            if (!LozinkaHasher.VerifikujLozinku(login.password, korisnik.lozinka))
                return BadRequest("Korisnik ne postoji!");
            var kod = GenerisiRandomBroj();
            var result = SendVerificationEmail("27topcic.mahir@gmail.com", "topcic27", kod, "login");
            if (result)
            {
                var verifikacijaEmailObj= _db.verifikacijaEmail.Include(ve => ve.korisnik).
                                                                  FirstOrDefault(ve => ve.korisnik.email == korisnik.email && ve.tip =="login");
                if (verifikacijaEmailObj == null)
                    _db.verifikacijaEmail.Add(new webAPI.Models.VerifikacijaEmail { korisnik = korisnik, verifikaciskiKod = kod, tip = "login" });
                else
                    verifikacijaEmailObj.verifikaciskiKod = kod;

            }
            _db.SaveChanges();


            korisnik.token = TokenGenerator.kreirajJwt(korisnik);
            var noviAccessToken = korisnik.token;
            var noviRefreshToken = kreirajRefreshToken();
            korisnik.refreshToken = noviRefreshToken;
            korisnik.refreshTokenExpiryTime = DateTime.Now.AddDays(5);
            _db.SaveChanges();
            return Ok(new
            
            {
                accessToken = noviAccessToken,
                refreshToken = noviRefreshToken,
                email=korisnik.email
            }
                );
        }
        [HttpPost]
        public async Task<IActionResult> Registracija([FromBody] RegistracijaVM reg)
        {

            //check username
            if (ProvjeriKorisnickoIme(reg.korisnickoIme))
                return BadRequest(new
                {
                    Message = "Korisnicko ime već postoji."
                });
            //check email
         /*   if (ProvjeriEmail(reg.email))
                return BadRequest(new
                {
                    Message = "Email već postoji."
                });*/
            //check password
            var pass = ProvjeriLozinku(reg.lozinka);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass });

            reg.lozinka = LozinkaHasher.HashPassword(reg.lozinka);
           
             
                var aplikant = new Aplikant
                {
                    ime = reg.ime,
                    prezime = reg.prezime,
                    lozinka = reg.lozinka,
                    korisnickoIme = reg.korisnickoIme,
                    email = reg.email,
                };
                await _db.Aplikant.AddAsync(aplikant);

                var kod = GenerisiRandomBroj();
                var result = SendVerificationEmail(reg.email, reg.korisnickoIme, kod,"registracija");
                if (result)
                {

                var verifikacijaEmailObj = _db.verifikacijaEmail.Include(ve => ve.korisnik).
                                                             FirstOrDefault(ve => ve.korisnik.email == aplikant.email && ve.tip == "registracija");
                if (verifikacijaEmailObj == null)
                    _db.verifikacijaEmail.Add(new webAPI.Models.VerifikacijaEmail { korisnik = aplikant, verifikaciskiKod = kod, tip = "registracija" });
                else
                    verifikacijaEmailObj.verifikaciskiKod = kod;

            }

            
            await _db.SaveChangesAsync();
            return Ok(new
            {
                Message = "Korisnik je registrovan."
            });
        }
        [HttpPost]
        public async Task<IActionResult> RegistracijaPoslodavac([FromBody] RegistracijaPoslodavacVM reg)
        {

            //check username
            if (ProvjeriKorisnickoIme(reg.korisnickoIme))
                return BadRequest(new
                {
                    Message = "Korisnicko ime već postoji."
                });
            //check email
               if (ProvjeriEmail(reg.email))
                   return BadRequest(new
                   {
                       Message = "Email već postoji."
                   });
            //check password
            var pass = ProvjeriLozinku(reg.lozinka);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass });

            reg.lozinka = LozinkaHasher.HashPassword(reg.lozinka);


            var opstina = _db.Opstina.FirstOrDefault(o => o.description == reg.lokacija);
                var poslodavac = new Poslodavac
                {
                    ime = reg.ime,
                    prezime = reg.prezime,
                    lozinka = reg.lozinka,
                    korisnickoIme = reg.korisnickoIme,
                    email = reg.email,
                    emailPotvrđen = false,
                    nazivFirme=reg.nazivFirme,
                    brojTelefona= reg.brojTelefona,
                    opstina_id=opstina.id
                };

                await _db.Poslodavac.AddAsync(poslodavac);

                var kod = GenerisiRandomBroj();
                var result = SendVerificationEmail(reg.email, reg.korisnickoIme, kod, "registracija");
                if (result)
            {
                var verifikacijaEmailObj = _db.verifikacijaEmail.Include(ve => ve.korisnik).
                                                         FirstOrDefault(ve => ve.korisnik.email == poslodavac.email && ve.tip == "registracija");
                if (verifikacijaEmailObj == null)
                    _db.verifikacijaEmail.Add(new webAPI.Models.VerifikacijaEmail { korisnik = poslodavac, verifikaciskiKod = kod, tip = "registracija" });
                else
                    verifikacijaEmailObj.verifikaciskiKod = kod;

            }
         
            await _db.SaveChangesAsync();
            return Ok(new
            {
                Message = "Korisnik je registrovan."
            });
        }
        [HttpPost]
        public async Task<IActionResult> ResendVerifikacijaEmail([FromBody] ResendVerifikacijaEmail obj)
        {
            var kod = GenerisiRandomBroj();
            var _korisnik = await _db.KorisnickiNalog.Where(k => k.email == obj.email).FirstOrDefaultAsync();
            var result = SendVerificationEmail("27topcic.mahir@gmail.com", "topcic27", kod,obj.tip);

            if (result)
            {
                var verifikacijaEmail = await _db.verifikacijaEmail.Include(ve => ve.korisnik).
                                                                  FirstOrDefaultAsync(ve => ve.korisnik.email == obj.email && ve.tip==obj.tip);
                verifikacijaEmail.verifikaciskiKod = kod;
                await _db.SaveChangesAsync();

            }
            return Ok(new
            {
                Message = "Novi verifikaciski kod je poslan."
            }
            );
        }

        [HttpGet]
        public ActionResult GetUserByUsername(string username, string role)
        {
            KorisnickiNalog korisnik;
            if(role =="")
                korisnik= _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);

           
            else if (role == "Poslodavac")
            {
                korisnik = _db.KorisnickiNalog.Include(k => (k as Poslodavac).opstina).FirstOrDefault(k => k.korisnickoIme == username);
                if (korisnik == null)
                    return BadRequest(new
                    {
                        Message = "Pogrešni podaci!"
                    });
                var user = new PoslodavacGetVM()
                {
                    id=korisnik.id,
                    korisnickoIme = korisnik.korisnickoIme,
                    brojTelefona = korisnik.brojTelefona,
                    email = korisnik.email,

                    ime = korisnik.poslodavac.ime,

                    prezime = korisnik.poslodavac.prezime,
                    adresa = korisnik.poslodavac.prezime,
                    ponuda = korisnik.poslodavac.ponuda,


                    nazivFirme = korisnik.poslodavac.nazivFirme,
                    opstina = korisnik.poslodavac.opstina.description
                };
                if (korisnik.slika != null)
                {
                    user.slika= Convert.ToBase64String(korisnik.slika);
                }
                return Ok(user);
            }

            else
            {
                korisnik = _db.KorisnickiNalog.Include(k => (k as Aplikant).opstina_rodjenja).FirstOrDefault(k => k.korisnickoIme == username);
            }

            if (korisnik == null)
                return BadRequest(new
                {
                    Message = "Pogrešni podaci!"
                });


            //  string json = JsonConvert.SerializeObject(korisnik);
            return Ok(korisnik);
        }
        [HttpPost]
        public async Task<IActionResult> ZamjeniLozinku([FromBody] NovaLozinkaVM novaLozinka)
        {
            var korisnik= await _db.KorisnickiNalog.FirstOrDefaultAsync(k=>k.email== novaLozinka.email);
            korisnik.lozinka = LozinkaHasher.HashPassword(novaLozinka.novaLozinka);
            _db.SaveChanges();
            return Ok(new
            {
                Message = "Uspješno zamjenuta lozinka"
            });

        }

        [HttpPost]
        public async Task<IActionResult> VerifikacijaEmail([FromBody] VerifikacijaEmailVM verifikacija)
        {
            var korisnikVerifikacija = await _db.verifikacijaEmail
                                     .Include(ve => ve.korisnik)
                                     .FirstOrDefaultAsync(ve => ve.korisnik.email == verifikacija.Email && ve.tip==verifikacija.tip);
            if (korisnikVerifikacija.verifikaciskiKod == verifikacija.kod)
            {
                if (  verifikacija.tip != "login")
                {
                    korisnikVerifikacija.korisnik.emailPotvrđen = true;
                    _db.SaveChanges();
                }

               
                return Ok(new
                {
                    Message = "Uspješno potvrđen kod."
                });

            }
            return Ok(new
            {
                Message = "Molimo Vas pokušajte ponovo"
            });

        }
        private string ProvjeriLozinku(string lozinka)
        {
            StringBuilder sb = new StringBuilder();
            if (lozinka.Length < 8)
                sb.Append("Minimalna velićina lozinke bi trebala biti 8 karaktera" + Environment.NewLine);
            if (!Regex.IsMatch(lozinka, "(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])"))
                sb.Append("Lozinka treba da sadrži broj,malo i veliko slovo" + Environment.NewLine);
            if (!Regex.IsMatch(lozinka, "[#,?,!,@,$,%,^,&,*,-,<,>,+,/]"))
                sb.Append("Lozinka treba da sadrži bar jedan specijalni znak." + Environment.NewLine);
            return sb.ToString();


        }

        private bool SendVerificationEmail(string userEmail, string userName, int verificationCode,string tipVerifikacije)
        {
            try
            {
                // Create a new message object
                MailMessage message = new MailMessage();

                // Set the sender, recipient, and subject
                message.From = new MailAddress("minijobs2023@gmail.com");
                message.To.Add(new MailAddress(userEmail));
                message.Subject = "Verifikacija računa";

                // Set the body of the email
                if(tipVerifikacije== "registracija")
                message.Body = string.Format(" {0},<br /><br />Hvala Vam što ste registrovali na našu aplikaciju! Da bi završili registraciju, molim vas unesite ovaj kod:<br /><br /><a href='{1}'>{1}</a><br /><br />,<br />MiniJobs", userName, verificationCode);
                else
                    message.Body = string.Format(" {0},<br /><br /> Da biste završili logiranje, molim vas unesite ovaj kod:<br /><br /><a href='{1}'>{1}</a><br /><br />,<br />MiniJobs", userName, verificationCode);

                // Set the message body as HTML
                message.IsBodyHtml = true;

                // Set the SMTP client details
                SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("minijobs2023@gmail.com", "mqpeirblrthovtjd");

                // Send the message
                client.Send(message);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private int GenerisiRandomBroj()
        {
            var random = new Random();
            return random.Next(1000, 9999);
        }


        private bool ProvjeriKorisnickoIme(string korisnickoIme)
        {
            return _db.KorisnickiNalog.Any(k => k.korisnickoIme == korisnickoIme);
        }
        private bool ProvjeriEmail(string email)
        {
            return _db.KorisnickiNalog.Any(k => k.email == email);
        }
        private string kreirajRefreshToken()
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _db.KorisnickiNalog.
                Any(k => k.refreshToken == refreshToken);
            if (tokenInUser)
                return kreirajRefreshToken();
            return refreshToken;
        }
        private ClaimsPrincipal GetPrincipleFromExpiredToken(string token)
        {
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.
                Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Token nije validan");
            return principal;
        }
        [HttpPost]
        public IActionResult Refresh(TokenVM tokenVM)
        {
            if (tokenVM is null)
                return BadRequest("Invalid Client Request");
            string accessToken = tokenVM.accessToken;
            string refreshToken = tokenVM.refreshToken;
            var principal = GetPrincipleFromExpiredToken(accessToken);
            var username = principal.Identity.Name;
            var user = _db.KorisnickiNalog.FirstOrDefault(k => k.korisnickoIme == username);
            if (user is null || user.refreshToken != refreshToken || user.refreshTokenExpiryTime <= DateTime.Now)
                return BadRequest("Invalid request");
            var newAccessToken = TokenGenerator.kreirajJwt(user);
            var newRefreshToken = kreirajRefreshToken();
            user.refreshToken = newRefreshToken;
            _db.SaveChanges();
            return Ok(new TokenVM
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken,
            });
        }
    }
}
