using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Server.Utils;

public static class Utils
{
    public static async Task SeedDataAsync(ApplicationDbContext context, ILogger logger)
    {
        // Only seed if database is empty
        if (await context.Books.AnyAsync())
        {
            logger.LogInformation("Database already contains data. Skipping seeding.");
            return;
        }

        logger.LogInformation("Seeding initial data...");

        try
        {
            // Add sample categories
            var categories = new[]
            {
                new Category { Name = "Fiction", Description = "Fictional literature" },
                new Category { Name = "Non-Fiction", Description = "Non-fictional works" },
                new Category { Name = "Science Fiction", Description = "Science fiction novels" },
                new Category { Name = "Mystery", Description = "Mystery and thriller books" }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            // Add sample authors
            var authors = new[]
            {
                new Author { FirstName = "Jane", LastName = "Doe", Biography = "Sample author biography", BirthDate = new DateTime(1980, 5, 15) },
                new Author { FirstName = "John", LastName = "Smith", Biography = "Another sample author", BirthDate = new DateTime(1975, 8, 22) }
            };

            context.Authors.AddRange(authors);
            await context.SaveChangesAsync();

            // Get the created category and author IDs
            var fictionCategory = await context.Categories.FirstAsync(c => c.Name == "Fiction");
            var sciFiCategory = await context.Categories.FirstAsync(c => c.Name == "Science Fiction");
            var author1 = await context.Authors.FirstAsync(a => a.FirstName == "Jane");
            var author2 = await context.Authors.FirstAsync(a => a.FirstName == "John");

            // Add sample books
            var books = new[]
            {
                new Book
                {
                    Title = "Sample Fiction Book",
                    Isbn = "978-0123456789",
                    Description = "A great fictional story",
                    PublishedDate = DateTime.Now.AddYears(-1),
                    AuthorId = author1.Id,
                    CategoryId = fictionCategory.Id
                },
                new Book
                {
                    Title = "Science Fiction Adventure",
                    Isbn = "978-9876543210",
                    Description = "An exciting sci-fi adventure",
                    PublishedDate = DateTime.Now.AddMonths(-6),
                    AuthorId = author2.Id,
                    CategoryId = sciFiCategory.Id
                }
            };

            context.Books.AddRange(books);
            await context.SaveChangesAsync();

            logger.LogInformation("Initial data seeded successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}