using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Server.Services;

public class AuthorService(ApplicationDbContext context)
{
    public async Task<IEnumerable<Author>> GetAllAsync()
    {
        return await context.Authors.Include(a => a.Books).ToListAsync();
    }

    public async Task<Author?> GetByIdAsync(int id)
    {
        return await context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task AddAsync(Author entity)
    {
        context.Authors.Add(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Author entity)
    {
        context.Authors.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var author = await context.Authors.FindAsync(id);
        if (author != null)
        {
            context.Authors.Remove(author);
            await context.SaveChangesAsync();
        }
    }
}