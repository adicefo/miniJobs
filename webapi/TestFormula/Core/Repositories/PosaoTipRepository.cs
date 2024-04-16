using System.Linq.Expressions;
using WebAPI.Core;
using WebAPI.Core.Repositories;
using WebAPI.Data;
using WebAPI.Models;

namespace webAPI.Core.Repositories
{
    public class PosaoTipRepository : GenericRepository<PosaoTip>, IPosaoTipRepository

    {
        public PosaoTipRepository(APIDbContext db, ILogger logger) : base(db, logger)
        {
        }
      
    }
}
