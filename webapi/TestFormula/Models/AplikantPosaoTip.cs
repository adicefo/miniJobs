using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class AplikantPosaoTip
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(aplikant))]
        public int aplikant_id { get; set; }
        public Aplikant aplikant { get; set; }

        [ForeignKey(nameof(posaoTip))]
        public int posaoTip_id { get; set; }
        public PosaoTip posaoTip { get; set; }
    }
}
