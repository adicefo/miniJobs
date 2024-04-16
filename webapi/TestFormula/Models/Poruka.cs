using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Poruka
    {
        [Key]
        public int id { get; set; }
        public string sadrzaj { get; set; }
        public string datum_kreiranja { get; set; }

     //   [ForeignKey(nameof(pitanjeThread))]
        public int pitanjeThread_id { get; set; }
        public PitanjeThread pitanjeThread { get; set; }

        [ForeignKey(nameof(korisnickiNalog))]
        public int korisnickiNalog_id { get; set; }
        public KorisnickiNalog korisnickiNalog { get; set; }

    }
}
