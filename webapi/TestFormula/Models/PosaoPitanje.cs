using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class PosaoPitanje
    {
        [Key]
        public int id { get; set; }
        [ForeignKey(nameof(pitanje))]
        public int pitanje_id { get; set; }
        public Pitanje pitanje { get; set; }

        [ForeignKey(nameof(posao))]
        public int posao_id { get; set; }
        public Posao posao { get; set; }
        public List<PitanjeOdgovor> pitanjeOdgovor { get; set; }


    }
}
