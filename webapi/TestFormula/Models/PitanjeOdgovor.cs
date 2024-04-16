using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class PitanjeOdgovor
    {
        [Key]
        public int id { get; set; }
     //   [ForeignKey(nameof(posaoPitanje))]
        public int posaoPitanje_id { get; set; }
        public PosaoPitanje posaoPitanje { get; set; }

    //    [ForeignKey(nameof(ponudjeniOdgovor))]
        public int ponudjeniOdgovor_id { get; set; }
        public PonudjeniOdgovor ponudjeniOdgovor { get; set; }
    }
}
