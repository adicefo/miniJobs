using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using WebAPI.Models;

namespace webAPI.Models
{
    public class VerifikacijaEmail
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(korisnik))]
        public int korisnik_id { get; set; }
        public KorisnickiNalog korisnik { get; set; }
        public int verifikaciskiKod { get; set; }
        public string tip { get; set; } //login ili registracija
    }
}
