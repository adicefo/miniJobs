namespace webAPI.Models.ViewModels
{
    public class ApliciraniPosaoAddVM
    {
        public string status { get; set; }
        public DateTime datum_apliciranja { get; set; }
        public int posao_id { get; set; }
        public int aplikant_id { get; set; }
    }
}
