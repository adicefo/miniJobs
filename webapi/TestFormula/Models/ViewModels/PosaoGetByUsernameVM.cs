namespace webAPI.Models.ViewModels
{
    public class PosaoGetByUsernameVM
    {
        public int id { get; set; }
        public string opis { get; set; }
        public string naziv { get; set; }
        public string adresa { get; set; }
        public int cijena { get; set; }
        public string status { get; set; }
        public int brojRadnika { get; set; }
        public string opstina { get; set; }
        public int opstina_id { get; set; }
        public int posaoTip_id { get; set; }

        public string posaoTip { get; set; }
        public List<int> rasporedOdgovori { get; set; }
        public int nacinPlacanja { get; set; }
        public List<int> dodatnoPlacanjeOdgovori { get; set; }
        public int brojApliciranja { get; set; }
        public string deadline { get; set; }
        public string  poslodavac { get; set; }


    }
}
