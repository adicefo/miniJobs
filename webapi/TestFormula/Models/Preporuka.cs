using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Preporuka
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(opstina))]
        public int opstina_id { get; set; }
        public Opstina opstina { get; set; }

    }
}
