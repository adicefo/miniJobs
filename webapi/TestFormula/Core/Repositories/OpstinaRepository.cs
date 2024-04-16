
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography.X509Certificates;
using WebAPI.Data;
using WebAPI.Helper;
using WebAPI.Models;
using WebAPI.Models.ViewModels;

namespace WebAPI.Core.Repositories
{
    public class OpstinaRepository : GenericRepository<Opstina>, IOpstinaRepository
    {

        public OpstinaRepository(APIDbContext db, ILogger logger) : base(db, logger)
        {
        }


        public List<CmbStavke> GetByDrzava(int drzava_id)
        {
            var data = _db.Opstina.Where(x => x.drzava_id == drzava_id)
                 .OrderBy(s => s.description)
                 .Select(s => new CmbStavke()
                 {
                     id = s.id,
                     opis = s.description,
                 })
                 .AsQueryable();
            return data.ToList();
        }
        public List<CmbStavke> GetByAll()
        {
            var data = _db.Opstina
                .OrderBy(s => s.description)
                .Select(s => new CmbStavke()
                {
                    id = s.id,
                    opis = s.drzava.naziv + " - " + s.description
                })
                .AsQueryable();
            return data.Take(100).ToList();
        }

    }
}
