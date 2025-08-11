using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnet_react_book_review_app.Server.Models;

public class Author
{
    public int Id { get; init; }

    [Required] [StringLength(100)] public string FirstName { get; init; } = string.Empty;

    [Required] [StringLength(100)] public string LastName { get; init; } = string.Empty;

    [StringLength(500)] public string? Biography { get; init; }

    public DateTime? BirthDate { get; init; }

    // Navigation property for books
    [JsonIgnore] // Prevent circular reference in JSON serialization
    public ICollection<Book> Books { get; init; } = new List<Book>();

    // Computed property for full name
    public string FullName => $"{FirstName} {LastName}";
}