using WebAPI.Helper;
using WebAPI.Models;

namespace WebAPI.Core
{
    public interface IOpstinaRepository : IGenericRepository<Opstina>
    {
        List<CmbStavke> GetByDrzava(int drzava_id);
        List<CmbStavke> GetByAll();



    }
}
