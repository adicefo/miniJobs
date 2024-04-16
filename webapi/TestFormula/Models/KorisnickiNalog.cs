using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebAPI.Models
{
    [Table("KorisnickiNalog")]
    public class KorisnickiNalog
    {
        [Key]
        public int id { get; set; }
        public string korisnickoIme { get; set; }
       
        public string? datumRegistracije { get; set; }
        public string? brojTelefona { get; set; }
        public int? status { get; set; }
        public string? spol { get; set; }
        public string? datumRodjenja { get; set; }
        public string email { get; set; }
        public bool emailPotvrđen { get; set; }
        public string token { get; set; }
        public string refreshToken { get; set; }
        public DateTime refreshTokenExpiryTime { get; set; }


        [JsonIgnore]
        public string lozinka { get; set; }
        public byte[]? slika{ get; set; }

   
        public Aplikant aplikant => this as Aplikant;
       
      
        public Poslodavac poslodavac => this as Poslodavac;
        public bool? isAplikant => aplikant != null;
        public bool? isPoslodavac => poslodavac != null;
        public bool? isAdmin { get; set; }
        public List<Ocjena> ocjene { get; set; }





    }
}
