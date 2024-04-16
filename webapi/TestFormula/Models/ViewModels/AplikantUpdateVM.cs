namespace webAPI.Models.ViewModels
{
    public class AplikantUpdateVM
    {
        public string opis { get; set; }
        public int posaoTip_id  { get; set; }
        public int aplikant_id  { get; set; }
        public int prijedlogSatnice  { get; set; }
        public string nivoObrazovanja  { get; set; }
        public string CV  { get; set; }
        public string slika  { get; set; }
        public string iskustvo { get; set; }
    }
}