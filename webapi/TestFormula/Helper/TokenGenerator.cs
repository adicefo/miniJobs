using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebAPI.Models;

namespace WebAPI.Helper
{
    public class TokenGenerator
    {
        public static string kreirajJwt(KorisnickiNalog user)
        {
            var jwtTokenHeandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role,user.isAplikant==true?"Aplikant":"Poslodavac"),
                new Claim(ClaimTypes.Name,user.korisnickoIme)
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddMinutes(10),
                SigningCredentials = credentials
            };
            var token = jwtTokenHeandler.CreateToken(tokenDescriptor);
            return jwtTokenHeandler.WriteToken(token);
        }
       
        public static string GenerisiIme(int size)
        {
            // Characters except I, l, O, 1, and 0 to decrease confusion when hand typing tokens
            var charSet = "ABCDEFGHJKLMNPQRSTUVWXYZ".ToLower();
            var chars = charSet.ToCharArray();
            var data = new byte[1];
#pragma warning disable SYSLIB0023 // Type or member is obsolete
            var crypto = new RNGCryptoServiceProvider();
#pragma warning restore SYSLIB0023 // Type or member is obsolete
            crypto.GetNonZeroBytes(data);
            data = new byte[size];
            crypto.GetNonZeroBytes(data);
            var result = new StringBuilder(size);
            foreach (var b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }
            var s = result.ToString();
            return "S" + result;
        }
    }
}
