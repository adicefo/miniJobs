namespace webAPI.Models.ViewModels
{
    public class PosaoGetAllVM {
       public int id { get; set; }
    public string opis { get; set; }
    public string naziv { get; set; }
    public string adresa { get; set; }
    public int cijena { get; set; }
    public string status { get; set; }
    public int brojRadnika { get; set; }
    public string opstina { get; set; }

    public string posaoTip { get; set; }
    public List<string> rasporedOdgovori { get; set; }
    public string nacinPlacanja { get; set; }
    public List<string> dodatnoPlacanjeOdgovori { get; set; }

    public string deadline { get; set; }
    public string poslodavac { get; set; }

}
}
