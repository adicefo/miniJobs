using Microsoft.AspNetCore.SignalR;
using WebAPI.Data;
using WebAPI.Models;

namespace webAPI.SignalR
{
    public class Chat:Hub
    {
        private readonly APIDbContext _db;
        public Chat(APIDbContext dbContext)
        {
            _db = dbContext;
        }
        public async void PosaljiPoruku(string username,string message,int pitanjeThreadId)
        {
            var user = _db.KorisnickiNalog.Where(k => k.korisnickoIme == username).FirstOrDefault();
            if (user != null)
            {
                var poruka = new Poruka()
                {
                    sadrzaj = message,
                    datum_kreiranja = DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss"),
                    pitanjeThread_id = pitanjeThreadId,
                    korisnickiNalog_id = user.id
                };
                _db.Add(poruka);
                _db.SaveChanges();
            }
           await Clients.All.SendAsync("novaPoruka",username, message,pitanjeThreadId);
        }
    }
}
