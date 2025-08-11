using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Server.Services;
public class ReviewService(ApplicationDbContext context)
{
    public async Task<IEnumerable<Review>> GetAllAsync()
    {
        return await context.Reviews
            .Include(r => r.Book)
            .Include(r => r.User)
            .ToListAsync();
    }

    public async Task<Review?> GetByIdAsync(int id)
    {
        return await context.Reviews
            .Include(r => r.Book)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task AddAsync(Review entity)
    {
        await context.Reviews.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Review entity)
    {
        context.Reviews.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var review = await GetByIdAsync(id);
        if (review != null)
        {
            context.Reviews.Remove(review);
            await context.SaveChangesAsync();
        }
    }
}