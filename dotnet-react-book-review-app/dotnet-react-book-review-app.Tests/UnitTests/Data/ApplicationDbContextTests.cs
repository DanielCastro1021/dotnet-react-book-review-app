using dotnet_react_book_review_app.Server.Data;
using dotnet_react_book_review_app.Tests.TestData;
using Microsoft.EntityFrameworkCore;

namespace dotnet_react_book_review_app.Tests.UnitTests.Data;

public class ApplicationDbContextTests : IDisposable
{
    private readonly ApplicationDbContext _context;

    public ApplicationDbContextTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    [Fact]
    public async Task AddBook_ShouldSaveToDatabase()
    {
        // Arrange
        var book = TestDataBuilder.CreateBook();
        book.Id = 0; // Reset ID for creation

        // Act
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Assert
        var savedBook = await _context.Books.FirstOrDefaultAsync(b => b.Title == book.Title);
        savedBook.Should().NotBeNull();
        savedBook!.Id.Should().BeGreaterThan(0);
        savedBook.Title.Should().Be(book.Title);
    }

    [Fact]
    public async Task GetBooksWithAuthors_ShouldIncludeAuthorData()
    {
        // Arrange
        var author = TestDataBuilder.CreateAuthor();
        var book = TestDataBuilder.CreateBook();
        book.AuthorId = author.Id;
        book.Author = author;

        _context.Authors.Add(author);
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Act
        var booksWithAuthors = await _context.Books
            .Include(b => b.Author)
            .ToListAsync();

        // Assert
        booksWithAuthors.Should().HaveCount(1);
        booksWithAuthors[0].Author.Should().NotBeNull();
        booksWithAuthors[0].Author!.FirstName.Should().Be(author.FirstName);
    }

    [Fact]
    public async Task DeleteBook_ShouldRemoveFromDatabase()
    {
        // Arrange
        var book = TestDataBuilder.CreateBook();
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Act
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        // Assert
        var deletedBook = await _context.Books.FindAsync(book.Id);
        deletedBook.Should().BeNull();
    }
}