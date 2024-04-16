using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("Posao")]

    public class Posao
    {
        [Key]
        public int id { get; set; }
        public string naziv { get; set; }
        public string opis { get; set; }
        public string adresa { get; set; }
        public string status { get; set; }
        public string datum_kreiranja { get; set; }
        public string deadline { get; set; }
        public int Cijena { get; set; }
        public int brojAplikanata { get; set; }

        [ForeignKey(nameof (opstina))]
        public int opstina_id { get; set; }
        public Opstina opstina { get; set; }

        [ForeignKey(nameof(posaoTip))]
        public int posaoTip_id { get; set; }
        public PosaoTip posaoTip { get; set; }

     //   [ForeignKey(nameof(poslodavac))]
        public int poslodavac_id { get; set; }
        public Poslodavac poslodavac { get; set; }
      //  public ICollection<Aplikant> aplikanti { get; set; }
        public List<ApliciraniPosao> apliciraniPoslovi { get; set; }
        //  public List<PitanjeOdgovor> pitanjeOdgovor { get; set; }
        public List<SpremljeniPosao> spremljeniPosao { get; set; }




    }
}
