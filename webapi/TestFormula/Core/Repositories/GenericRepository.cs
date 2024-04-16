using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WebAPI.Data;

namespace WebAPI.Core.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class

    {
        protected APIDbContext _db;
        internal DbSet<T> dbSet;
        protected readonly ILogger _logger;
        public GenericRepository(APIDbContext db, ILogger logger)
        {
            _db = db;
            this.dbSet = db.Set<T>();
            _logger = logger;
        }

        public virtual IEnumerable<T> GetAll(
             Expression<Func<T, bool>> filter = null,
             Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
             string includeProperties = "")
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }
        public virtual T GetById(int id)
        {
            return dbSet.Find(id);
        }

        public virtual void Add(T entity)
        {
            dbSet.Add(entity);
        }

        public virtual void Update(T entity)
        {
            dbSet.Attach(entity);
            _db.Entry(entity).State = EntityState.Modified;
        }

        public virtual void Delete(T entity)
        {
            if (_db.Entry(entity).State == EntityState.Detached)
            {
                dbSet.Attach(entity);
            }
            dbSet.Remove(entity);
        }
    }
}
