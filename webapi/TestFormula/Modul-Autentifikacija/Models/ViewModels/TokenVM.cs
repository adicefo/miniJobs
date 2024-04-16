namespace webAPI.Modul_Autentifikacija.Models.ViewModels
{
    public class TokenVM
    {
        public string accessToken { get; set; } = string.Empty;
        public string refreshToken { get; set; } = string.Empty;

    }
}
