using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class ApliciraniPosao
    {
        [Key]
        public int id { get; set; }
        public string status { get; set; }
        public string datum_apliciranja { get; set; }
        
      //     [ForeignKey(nameof(aplikant))]
        public int aplikant_id { get; set; }
        public Aplikant aplikant { get; set; }

      //  [ForeignKey(nameof(posao))]
        public int posao_id { get; set; }
        public Posao posao { get; set; }
        public List<Ocjena> ocjene { get; set; }





    }
}
