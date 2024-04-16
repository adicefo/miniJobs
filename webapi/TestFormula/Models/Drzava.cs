using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Drzava
    {
        [Key]
        public int id { get; set; }
        public string naziv { get; set; }

    }
}
