using webAPI.Core;

namespace WebAPI.Core
{
    public interface IUnitOfWork
    {
        IDrzavaRepository Drzava { get; }
        IOpstinaRepository Opstina { get; }
        IPosaoRepository Posao { get; }
        IPosaoTipRepository PosaoTip { get; }
        IPonudjeniOdgovoriRepository PonudjeniOdgovori { get; }


        void Complete();
    }
}
