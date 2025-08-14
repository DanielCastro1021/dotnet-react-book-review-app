using Bogus;
using dotnet_react_book_review_app.Server.Models;

namespace dotnet_react_book_review_app.Tests.TestData;

public static class TestDataBuilder
{
    public static Faker<Book> BookFaker => new Faker<Book>()
        .RuleFor(b => b.Id, f => f.Random.Int(1, 1000))
        .RuleFor(b => b.Title, f => f.Lorem.Sentence(3))
        .RuleFor(b => b.Isbn, f => f.Random.String2(13, "0123456789"))
        .RuleFor(b => b.PublishedDate, f => f.Date.Past(20))
        .RuleFor(b => b.Description, f => f.Lorem.Paragraph())
        .RuleFor(b => b.AuthorId, f => f.Random.Int(1, 100))
        .RuleFor(b => b.CategoryId, f => f.Random.Int(1, 20));

    public static Faker<Author> AuthorFaker => new Faker<Author>()
        .RuleFor(a => a.Id, f => f.Random.Int(1, 1000))
        .RuleFor(a => a.FirstName, f => f.Name.FirstName())
        .RuleFor(a => a.LastName, f => f.Name.LastName())
        .RuleFor(a => a.Biography, f => f.Lorem.Paragraph())
        .RuleFor(a => a.BirthDate, f => f.Date.Past(80, DateTime.Now.AddYears(-20)));

    public static Faker<Category> CategoryFaker => new Faker<Category>()
        .RuleFor(c => c.Id, f => f.Random.Int(1, 1000))
        .RuleFor(c => c.Name, f => f.Commerce.Categories(1)[0])
        .RuleFor(c => c.Description, f => f.Lorem.Sentence());

    public static Faker<Review> ReviewFaker => new Faker<Review>()
        .RuleFor(r => r.Id, f => f.Random.Int(1, 1000))
        .RuleFor(r => r.Rating, f => f.Random.Int(1, 5))
        .RuleFor(r => r.Content, f => f.Rant.Review())
        .RuleFor(r => r.CreatedDate, f => f.Date.Recent(365))
        .RuleFor(r => r.BookId, f => f.Random.Int(1, 100));

    public static Book CreateBook()
    {
        return BookFaker.Generate();
    }

    public static List<Book> CreateBooks(int count)
    {
        return BookFaker.Generate(count);
    }

    public static Author CreateAuthor()
    {
        return AuthorFaker.Generate();
    }

    public static List<Author> CreateAuthors(int count)
    {
        return AuthorFaker.Generate(count);
    }

    public static Category CreateCategory()
    {
        return CategoryFaker.Generate();
    }

    public static List<Category> CreateCategories(int count)
    {
        return CategoryFaker.Generate(count);
    }

    public static Review CreateReview()
    {
        return ReviewFaker.Generate();
    }
}