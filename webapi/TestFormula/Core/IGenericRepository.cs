using System.Linq.Expressions;

namespace WebAPI.Core
{
    public interface IGenericRepository<T> where T : class

    {
        //   Task<IEnumerable<T>> GetAll();
        IEnumerable<T> GetAll(
               Expression<Func<T, bool>> filter = null,
               Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
               string includeProperties = "");
        T? GetById(int id);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);




    }
}
