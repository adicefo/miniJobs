using webAPI.Core;
using webAPI.Core.Repositories;
using WebAPI.Core;
using WebAPI.Core.Repositories;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly APIDbContext _db;


        public UnitOfWork(APIDbContext db, ILoggerFactory loggerFactory)
        {
            _db = db;
            var _logger = loggerFactory.CreateLogger("logs");
            Drzava = new DrzavaRepository(_db, _logger);
            Opstina = new OpstinaRepository(_db, _logger);
            Posao = new PosaoRepository(_db, _logger);
            PosaoTip =new PosaoTipRepository(_db, _logger);
            PonudjeniOdgovori = new PonudjeniOdgovoriRepository(_db, _logger);

        }

        public IDrzavaRepository Drzava { get; private set; }
        public IOpstinaRepository Opstina { get; private set; }
        public IPosaoRepository Posao { get; private set; }

        public IPosaoTipRepository PosaoTip { get; private set; }
        public IPonudjeniOdgovoriRepository PonudjeniOdgovori { get; private set; }


        public void Complete()
        {
            _db.SaveChanges();
        }
        public void Dispose()
        {
            _db.Dispose();
        }
    }
}
