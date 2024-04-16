using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("Aplikant")]
    public class Aplikant : KorisnickiNalog
    {
        public string ime { get; set; }
        public string prezime { get; set; }
        public int? prijedlogSatince { get; set; }
        public string? opis { get; set; }
        public string? iskustvo { get; set; }
        public byte[]? slika { get; set; }
        public string? nivoObrazovanja { get; set; }
        public byte[]? CV { get; set; }

     
        [ForeignKey(nameof(opstina_rodjenja))]
        public int? opstina_rodjenja_id { get; set; }
        public Opstina opstina_rodjenja { get; set; }
        [ForeignKey(nameof(preporuka))]
        public int? preporuka_id { get; set; }
        public Preporuka preporuka { get; set; }
     //   public ICollection<Posao> poslovi { get; set; }
        public List<ApliciraniPosao> apliciraniPoslovi { get; set; }
        public List<SpremljeniPosao> spremljeniPosao { get; set; }




    }
}
