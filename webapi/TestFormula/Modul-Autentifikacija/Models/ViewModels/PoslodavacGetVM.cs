using System.Text.Json.Serialization;
using WebAPI.Models;

namespace webAPI.Modul_Autentifikacija.Models.ViewModels
{
    public class PoslodavacGetVM
    {

        public string korisnickoIme { get; set; }
        public int id { get; set; }
        public string brojTelefona { get; set; }
        public string email { get; set; }
        public string slika { get; set; }
        public string ime { get; set; }
        public string prezime { get; set; }
        public string adresa { get; set; }
        public string ponuda { get; set; }


        public string nazivFirme { get; set; }  
        public string opstina { get; set; }

    }
}
