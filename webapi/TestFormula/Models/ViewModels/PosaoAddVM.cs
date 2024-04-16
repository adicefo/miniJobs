namespace webAPI.Models.ViewModels
{
    public class PosaoAddVM
    {
      
            public string naziv { get; set; }
            public string adresa { get; set; }
            public int opstina_id { get; set; }
            public int cijena { get; set; }
            public string opis { get; set; }
        public string posaoTip { get; set; }
        public int posaoTip_id { get; set; }
            public int brojAplikanata { get; set; }
            public int deadline { get; set; }
            public int[] radnoVrijeme { get; set; }
            public int[] dodatnoPlacanje { get; set; }
            public int vrstaPlacanja { get; set; }
        public string poslodavacUserName { get; set; }
        public int posao_id { get; set; }


    }
}
