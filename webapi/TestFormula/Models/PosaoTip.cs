using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class PosaoTip
    {
        [Key]
        public int id { get; set; }
        public string naziv { get; set; }
    }
}
