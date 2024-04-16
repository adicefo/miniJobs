using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class PonudjeniOdgovor
    {
        [Key]
        public int id { get; set; }
        public string  odgovor { get; set; }

        [ForeignKey(nameof(pitanje))]
        public int pitanje_id { get; set; }
        public Pitanje pitanje { get; set; }
        public List<PitanjeOdgovor> pitanjeOdgovor { get; set; }

    }
}
