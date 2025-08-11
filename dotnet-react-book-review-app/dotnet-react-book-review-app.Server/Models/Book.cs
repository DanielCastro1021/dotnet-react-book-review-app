using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnet_react_book_review_app.Server.Models;

public class Book
{
    public int Id { get; init; }

    [Required] [StringLength(200)] public string Title { get; init; } = string.Empty;

    [StringLength(13)] public string? ISBN { get; init; }

    [StringLength(1000)] public string? Description { get; init; }

    public DateTime PublishedDate { get; init; }

    public int AuthorId { get; init; }
    public Author Author { get; init; } = null!;

    public int? CategoryId { get; init; }
    public Category? Category { get; init; }

    // Navigation property for reviews
    [JsonIgnore] // Prevent circular reference in JSON serialization
    public ICollection<Review> Reviews { get; init; } = new List<Review>();
}