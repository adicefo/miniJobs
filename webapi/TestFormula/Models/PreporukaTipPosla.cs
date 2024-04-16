using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class PreporukaTipPosla
    {

        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(posaoTip))]
        public int posaoTip_id { get; set; }
        public PosaoTip posaoTip { get; set; }

        [ForeignKey(nameof(preporuka))]
        public int preporuka_id { get; set; }
        public Preporuka preporuka { get; set; }
    }
}
