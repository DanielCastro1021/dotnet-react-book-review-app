using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Server.Utils;

public static class Utils
{
    public static async Task CreateCustomTablesAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            // Check if tables exist and create them if they don't
            var connection = context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
                await connection.OpenAsync();

            await using var command = connection.CreateCommand();

            // Create Categories table
            command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Categories (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name NVARCHAR(50) NOT NULL,
                    Description NVARCHAR(200) NULL
                )";
            await command.ExecuteNonQueryAsync();

            // Create Authors table
            command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Authors (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    FirstName NVARCHAR(100) NOT NULL,
                    LastName NVARCHAR(100) NOT NULL,
                    Biography NVARCHAR(500) NULL,
                    BirthDate DATETIME NULL
                )";
            await command.ExecuteNonQueryAsync();

            // Create Books table
            command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Books (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title NVARCHAR(200) NOT NULL,
                    ISBN NVARCHAR(13) NULL,
                    Description NVARCHAR(1000) NULL,
                    PublishedDate DATETIME NOT NULL,
                    AuthorId INTEGER NOT NULL,
                    CategoryId INTEGER NULL,
                    FOREIGN KEY (AuthorId) REFERENCES Authors(Id),
                    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
                )";
            await command.ExecuteNonQueryAsync();

            // Create Reviews table
            command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Reviews (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Content NVARCHAR(1000) NOT NULL,
                    Rating INTEGER NOT NULL CHECK(Rating >= 1 AND Rating <= 5),
                    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    BookId INTEGER NOT NULL,
                    UserId NVARCHAR(450) NOT NULL,
                    FOREIGN KEY (BookId) REFERENCES Books(Id),
                    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id)
                )";
            await command.ExecuteNonQueryAsync();

            logger.LogInformation("Custom tables created successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating custom tables.");
            throw;
        }
    }

    public static async Task SeedDataAsync(ApplicationDbContext context, ILogger logger)
    {
        // Only seed if database is empty
        if (context.Books.Any())
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
                new Author { FirstName = "Jane", LastName = "Doe", Biography = "Sample author biography" },
                new Author { FirstName = "John", LastName = "Smith", Biography = "Another sample author" }
            };

            context.Authors.AddRange(authors);
            await context.SaveChangesAsync();

            // Add sample books
            var books = new[]
            {
                new Book
                {
                    Title = "Sample Fiction Book",
                    ISBN = "978-0123456789",
                    Description = "A great fictional story",
                    PublishedDate = DateTime.Now.AddYears(-1),
                    AuthorId = 1,
                    CategoryId = 1
                },
                new Book
                {
                    Title = "Science Fiction Adventure",
                    ISBN = "978-9876543210",
                    Description = "An exciting sci-fi adventure",
                    PublishedDate = DateTime.Now.AddMonths(-6),
                    AuthorId = 2,
                    CategoryId = 3
                }
            };

            context.Books.AddRange(books);
            await context.SaveChangesAsync();

            logger.LogInformation("Initial data seeded successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}