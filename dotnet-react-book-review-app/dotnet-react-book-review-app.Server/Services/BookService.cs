using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Server.Services;

public class BookService(ApplicationDbContext context)
{
    public async Task<IEnumerable<Book>> GetAllAsync()
    {
        return await context.Books
            .Include(b => b.Author)
            .Include(b => b.Reviews) // Include reviews if needed
            .Include(b => b.Category) // Include categories if needed
            .ToListAsync();
    }

    public async Task<Book?> GetByIdAsync(int id)
    {
        return await context.Books
            .Include(b => b.Author)
            .Include(b => b.Reviews)
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task AddAsync(Book entity)
    {
        context.Books.Add(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Book entity)
    {
        context.Books.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var book = await context.Books.FindAsync(id);
        if (book != null)
        {
            context.Books.Remove(book);
            await context.SaveChangesAsync();
        }
    }
}