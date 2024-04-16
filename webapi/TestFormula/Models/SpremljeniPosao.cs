using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class SpremljeniPosao
    {
        [Key]
        public int id { get; set; }
        public int status { get; set; }
      //  [ForeignKey(nameof(aplikant))]
        public int aplikant_id { get; set; }
        public Aplikant aplikant { get; set; }
      //  [ForeignKey(nameof(posao))]
        public int posao_id { get; set; }
        public Posao posao { get; set; }
    }
}
