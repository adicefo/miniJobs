using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Core.Repositories
{
    public class DrzavaRepository : GenericRepository<Drzava>, IDrzavaRepository
    {
        public DrzavaRepository(APIDbContext db, ILogger logger) : base(db, logger)
        {
        }






    }
}
