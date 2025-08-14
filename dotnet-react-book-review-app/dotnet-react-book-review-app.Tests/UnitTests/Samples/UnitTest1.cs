using dotnet_react_book_review_app.Tests.TestData;

namespace dotnet_react_book_review_app.Tests.UnitTests.Samples;

public class SampleTests
{
    [Fact]
    public void TestDataBuilder_ShouldCreateValidBook()
    {
        // Act
        var book = TestDataBuilder.CreateBook();

        // Assert
        book.Should().NotBeNull();
        book.Title.Should().NotBeNullOrEmpty();
        book.Isbn.Should().NotBeNullOrEmpty();
        book.Id.Should().BeGreaterThan(0);
    }

    [Fact]
    public void TestDataBuilder_ShouldCreateMultipleBooks()
    {
        // Act
        var books = TestDataBuilder.CreateBooks(5);

        // Assert
        books.Should().HaveCount(5);
        books.Should().OnlyContain(b => !string.IsNullOrEmpty(b.Title));
    }
}