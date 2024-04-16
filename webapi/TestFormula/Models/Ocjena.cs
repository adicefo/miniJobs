using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Ocjena
    {
        [Key]
        public int id { get; set; }
        public int vrijednost { get; set; }
       public string  komentar { get; set; }

        public int ocjenjen_id { get; set; }
        public KorisnickiNalog ocjenjen { get; set; }

        public int ocjenjuje_id { get; set; }
        public KorisnickiNalog ocjenjuje { get; set; }

        public int apliciraniPosao_id { get; set; }
        public ApliciraniPosao apliciraniPosao { get; set; }

        public string datum_kreiranja { get; set; }

    }
}
