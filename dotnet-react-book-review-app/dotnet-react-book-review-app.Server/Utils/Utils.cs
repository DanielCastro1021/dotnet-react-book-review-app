using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace dotnet_react_book_review_app.Server.Utils;

public static class Utils
{
    public static async Task SeedDataAsync(ApplicationDbContext context, UserManager<IdentityUser> userManager, ILogger logger)
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

            // Add sample users
            var users = new[]
            {
                new IdentityUser { UserName = "reviewer1@example.com", Email = "reviewer1@example.com", EmailConfirmed = true },
                new IdentityUser { UserName = "reviewer2@example.com", Email = "reviewer2@example.com", EmailConfirmed = true },
                new IdentityUser { UserName = "bookworm@example.com", Email = "bookworm@example.com", EmailConfirmed = true }
            };

            foreach (var user in users)
            {
                var result = await userManager.CreateAsync(user, "Password123!");
                if (!result.Succeeded)
                {
                    logger.LogError("Failed to create user {UserName}: {Errors}", user.UserName, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }

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

            // Get the created users and books for reviews
            var user1 = await userManager.FindByEmailAsync("reviewer1@example.com");
            var user2 = await userManager.FindByEmailAsync("reviewer2@example.com");
            var user3 = await userManager.FindByEmailAsync("bookworm@example.com");
            var book1 = await context.Books.FirstAsync(b => b.Title == "Sample Fiction Book");
            var book2 = await context.Books.FirstAsync(b => b.Title == "Science Fiction Adventure");

            // Add sample reviews
            var reviews = new[]
            {
                new Review
                {
                    Content = "This is an excellent book! The story was captivating and I couldn't put it down. The character development was outstanding.",
                    Rating = 5,
                    BookId = book1.Id,
                    UserId = user1!.Id,
                    CreatedDate = DateTime.UtcNow.AddDays(-10)
                },
                new Review
                {
                    Content = "Good read, but not exceptional. The plot was interesting but the pacing felt a bit slow at times.",
                    Rating = 3,
                    BookId = book1.Id,
                    UserId = user2!.Id,
                    CreatedDate = DateTime.UtcNow.AddDays(-5)
                },
                new Review
                {
                    Content = "Amazing sci-fi adventure! The world-building is incredible and the technology concepts are fascinating.",
                    Rating = 5,
                    BookId = book2.Id,
                    UserId = user3!.Id,
                    CreatedDate = DateTime.UtcNow.AddDays(-3)
                },
                new Review
                {
                    Content = "A solid science fiction book with great action sequences. Would recommend to any sci-fi fan.",
                    Rating = 4,
                    BookId = book2.Id,
                    UserId = user1!.Id,
                    CreatedDate = DateTime.UtcNow.AddDays(-1)
                }
            };

            context.Reviews.AddRange(reviews);
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