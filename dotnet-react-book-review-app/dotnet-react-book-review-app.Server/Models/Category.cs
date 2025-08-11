using System.ComponentModel.DataAnnotations;

namespace dotnet_react_book_review_app.Server.Models;

public class Category
{
    public int Id { get; set; }

    [Required] [StringLength(50)] public string Name { get; set; } = string.Empty;

    [StringLength(200)] public string? Description { get; set; }

    // Navigation property for books
    public ICollection<Book> Books { get; set; } = new List<Book>();
}