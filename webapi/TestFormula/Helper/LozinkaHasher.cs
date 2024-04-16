using System.Security.Cryptography;
using System.Text;
using webAPI.Modul_Autentifikacija.Models.ViewModels;

namespace webAPI.Helper
{
    public class LozinkaHasher
    {
        public static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                // Convert the password string to a byte array
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

                // Compute the hash value of the password
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);

                // Convert the hashed password to a string representation
                string hashedPassword = Convert.ToBase64String(hashBytes);

                return hashedPassword;
            }
        }
        public static bool VerifikujLozinku(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
    
    

    
}