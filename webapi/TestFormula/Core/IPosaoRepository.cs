using webAPI.Models.ViewModels;
using WebAPI.Models;

namespace WebAPI.Core
{
    public interface IPosaoRepository : IGenericRepository<Posao>
    {
         List<Posao> GetOdredeniBrojPoslova(int brojPoslova);
        void AddPosao(PosaoAddVM posao);

    }
}
