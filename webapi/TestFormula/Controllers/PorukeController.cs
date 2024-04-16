using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webAPI.Models.ViewModels;
using WebAPI.Data;
using WebAPI.Models;

namespace webAPI.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class PorukeController : ControllerBase
    {
        private readonly APIDbContext _db;

        public PorukeController(APIDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult Get()
        {
            var data = _db.Poruka.Include("korisnickiNalog")?.ToList();
            return Ok(data);
        }
    }
}
