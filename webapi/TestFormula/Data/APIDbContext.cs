using Microsoft.EntityFrameworkCore;
using webAPI.Models;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class APIDbContext: DbContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
         //   modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
           // modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
                modelBuilder.Entity<ApliciraniPosao>()
                    .HasOne(a => a.aplikant)
                    .WithMany(ap => ap.apliciraniPoslovi)
                    .HasForeignKey(ai => ai.aplikant_id).
                    OnDelete(DeleteBehavior.ClientSetNull);
                modelBuilder.Entity<ApliciraniPosao>()
                    .HasOne(p => p.posao)
                    .WithMany(ap => ap.apliciraniPoslovi)
                    .HasForeignKey(pi =>pi.posao_id).
                    OnDelete(DeleteBehavior.ClientSetNull);

            // sprjecavanje cascade delete za PitanjeOdgovor
           modelBuilder.Entity<PitanjeOdgovor>()
                   .HasOne(po => po.ponudjeniOdgovor)
                   .WithMany(pp => pp.pitanjeOdgovor)
                   .HasForeignKey(poi => poi.ponudjeniOdgovor_id).
                   OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<PitanjeOdgovor>()
                .HasOne(pp => pp.posaoPitanje)
                .WithMany(pp => pp.pitanjeOdgovor)
                .HasForeignKey(pi => pi.posaoPitanje_id).
                OnDelete(DeleteBehavior.ClientSetNull);

            // sprjecavanje cascade delete za SpremljeniPosao
            modelBuilder.Entity<SpremljeniPosao>()
                    .HasOne(a => a.aplikant)
                    .WithMany(sp =>sp.spremljeniPosao)
                    .HasForeignKey(poi => poi.aplikant_id).
                    OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<SpremljeniPosao>()
                .HasOne(pp => pp.posao)
                .WithMany(pp => pp.spremljeniPosao)
                .HasForeignKey(pi => pi.posao_id).
                OnDelete(DeleteBehavior.ClientSetNull);

            // sprjecavanje cascade delete za Poruka
            modelBuilder.Entity<Poruka>()
                .HasOne(pp => pp.pitanjeThread)
                .WithMany(pp => pp.poruke)
                .HasForeignKey(pi => pi.pitanjeThread_id).
                OnDelete(DeleteBehavior.ClientSetNull);

            //sprecavanje cascade delete za Ocjene
            modelBuilder.Entity<Ocjena>()
                   .HasOne(a => a.ocjenjuje)
                   .WithMany(sp => sp.ocjene)
                   .HasForeignKey(poi => poi.ocjenjuje_id).
                   OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<Ocjena>()
                .HasOne(pp => pp.apliciraniPosao)
                .WithMany(pp => pp.ocjene)
                .HasForeignKey(pi => pi.apliciraniPosao_id).
                OnDelete(DeleteBehavior.ClientSetNull);

            // sprjecavanje cascade delete za Posao
            modelBuilder.Entity<Posao>()
           .HasOne(p => p.poslodavac)
           .WithMany()
           .HasForeignKey(p => p.poslodavac_id)
           .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Poslodavac>()
                .HasOne(p => p.opstina)
                .WithMany()
                .HasForeignKey(p => p.opstina_id)
                .OnDelete(DeleteBehavior.NoAction);
        }
        public APIDbContext(DbContextOptions<APIDbContext> options):base(options)
        {

        }
        public DbSet<Drzava> Drzava { get; set; }
        public DbSet<Posao> Posao { get; set; }
        public DbSet<ApliciraniPosao> ApliciraniPosao { get; set; }
        public DbSet<PosaoTip> PosaoTip { get; set; }
        public DbSet<PosaoPitanje> PosaoPitanje { get; set; }
        public DbSet<SpremljeniPosao> SpremljeniPosao { get; set; }
        public DbSet<Opstina> Opstina { get; set; }
        public DbSet<PonudjeniOdgovor> PonudjeniOdgovor { get; set; }
        public DbSet<PitanjeThread> PitanjeThread { get; set; }
        public DbSet<PitanjeOdgovor> PitanjeOdgovor { get; set; }

        public DbSet<Poruka> Poruka { get; set; } 
        public DbSet<Preporuka> Preporuka { get; set; }
        public DbSet<Pitanje> Pitanje { get; set; }
        public DbSet<PreporukaTipPosla> PreporukaTipPosla { get; set; }
        public DbSet<KorisnickiNalog> KorisnickiNalog { get; set; }
        public DbSet<Aplikant> Aplikant { get; set; }
        public DbSet<Poslodavac> Poslodavac { get; set; }
        public DbSet<Ocjena> Ocjena { get; set; }
        public DbSet<AplikantPosaoTip> aplikantPosaoTip { get; set; }

        public DbSet<VerifikacijaEmail> verifikacijaEmail { get; set; }




    }
}
