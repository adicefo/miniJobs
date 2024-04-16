using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("Poslodavac")]

    public class Poslodavac : KorisnickiNalog
    {
        public string ime { get; set; }
        public string prezime { get; set; }
        public string? adresa { get; set; }
        public string? ponuda { get; set; }


        public string? nazivFirme { get; set; }
      //  [ForeignKey(nameof(opstina))]
        public int? opstina_id { get; set; }
        public Opstina? opstina { get; set; }
    }
}
