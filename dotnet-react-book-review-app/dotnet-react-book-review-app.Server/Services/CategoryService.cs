using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Server.Services;

public class CategoryService(ApplicationDbContext context)
{
    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await context.Categories.Include(c => c.Books).ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await context.Categories.Include(c => c.Books).FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddAsync(Category entity)
    {
        context.Categories.Add(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Category entity)
    {
        context.Categories.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category != null)
        {
            context.Categories.Remove(category);
            await context.SaveChangesAsync();
        }
    }

    public async Task<int> CountAsync()
    {
        return await context.Reviews.CountAsync();
    }
}