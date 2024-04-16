namespace webAPI.Models.ViewModels
{
    public class AplikantGetVM
    {
        public int id { get; set; }
        public string username { get; set; }
        public int? opstina_id { get; set; }
        public string? opstina { get; set; }
        public int brojZavrsenihPoslova { get; set; }
        public string slika { get; set; }
        public byte[] slikaCopy { get; set; }
        public string posaoTip { get; set; }


    }
}
