using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class PitanjeThread
    {
        [Key]
        public int id { get; set; }
        public string datum_kreiranja { get; set; }
        public string naziv { get; set; }

        [ForeignKey(nameof(posao))]
        public int posao_id { get; set; }
        public Posao posao { get; set; }
        public List<Poruka> poruke { get; set; }


    }
}
