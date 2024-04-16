using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Pitanje
    {
        [Key]
        public int id { get; set; }
        public string naziv { get; set; }
    }
}
