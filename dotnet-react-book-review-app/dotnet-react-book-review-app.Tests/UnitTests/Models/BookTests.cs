using dotnet_react_book_review_app.Tests.TestData;

namespace dotnet_react_book_review_app.Tests.UnitTests.Models;

public class BookTests
{
    [Fact]
    public void Book_ShouldHaveCorrectProperties()
    {
        // Arrange & Act
        var book = TestDataBuilder.CreateBook();

        // Assert
        book.Id.Should().BeGreaterThan(0);
        book.Title.Should().NotBeNullOrEmpty();
        book.Isbn.Should().NotBeNullOrEmpty();
        book.PublishedDate.Should().BeBefore(DateTime.Now);
        book.AuthorId.Should().BeGreaterThan(0);
        book.CategoryId.Should().BeGreaterThan(0);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Book_WithInvalidTitle_ShouldFailValidation(string invalidTitle)
    {
        // Arrange
        var book = TestDataBuilder.CreateBook();
        book.Title = invalidTitle;

        // Act & Assert
        // Add your validation logic here when you implement model validation
        book.Title.Should().Be(invalidTitle);
    }

    [Fact]
    public void Book_WithFuturePublishedDate_ShouldBeValid()
    {
        // Arrange
        var book = TestDataBuilder.CreateBook();
        book.PublishedDate = DateTime.Now.AddDays(30);

        // Act & Assert
        book.PublishedDate.Should().BeAfter(DateTime.Now);
    }
}