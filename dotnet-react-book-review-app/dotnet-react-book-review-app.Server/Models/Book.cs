using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnet_react_book_review_app.Server.Models;

public class Book
{
    public int Id { get; set; }

    [Required] [StringLength(200)] public string Title { get; set; } = string.Empty;

    [StringLength(17)] public string? Isbn { get; set; }

    [StringLength(1000)] public string? Description { get; set; }

    public DateTime PublishedDate { get; set; }

    public int AuthorId { get; set; }
    public Author Author { get; set; } = null!;

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    // Navigation property for reviews
    [JsonIgnore] // Prevent circular reference in JSON serialization
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}