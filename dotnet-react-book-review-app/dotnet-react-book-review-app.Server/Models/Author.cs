using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnet_react_book_review_app.Server.Models;

public class Author
{
    public int Id { get; set; }

    [Required] [StringLength(100)] public string FirstName { get; set; } = string.Empty;

    [Required] [StringLength(100)] public string LastName { get; set; } = string.Empty;

    [StringLength(500)] public string? Biography { get; set; }

    public DateTime? BirthDate { get; set; }

    // Navigation property for books
    [JsonIgnore] // Prevent circular reference in JSON serialization
    public ICollection<Book> Books { get; set; } = new List<Book>();

    // Computed property for full name
    public string FullName => $"{FirstName} {LastName}";
}