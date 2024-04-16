using WebAPI.Core.Repositories;
using WebAPI.Core;
using WebAPI.Models;
using WebAPI.Data;
using WebAPI.Helper;
using Microsoft.EntityFrameworkCore;

namespace webAPI.Core.Repositories
{
    public class PonudjeniOdgovoriRepository: GenericRepository<PonudjeniOdgovor>, IPonudjeniOdgovoriRepository
    {
        public PonudjeniOdgovoriRepository(APIDbContext db, ILogger logger) : base(db, logger)
        {
        }

        public List<CmbStavke> GetByPitanjeId(int pitanje_id)
        {
          var data=_db.PonudjeniOdgovor.Where(po=>po.pitanje_id== pitanje_id).Select(s=> new CmbStavke()
          {
              id = s.id,
              opis =s.odgovor,
          }

            ).ToList();
            return data;
        }
    }
}
