using WebAPI.Core;
using WebAPI.Helper;
using WebAPI.Models;

namespace webAPI.Core
{
    public interface IPonudjeniOdgovoriRepository : IGenericRepository<PonudjeniOdgovor>
    {
        List<CmbStavke> GetByPitanjeId(int pitanje_id);
    }
}
