using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace dotnet_react_book_review_app.Server.Models;

public class Review
{
    public int Id { get; set; }

    [Required] [StringLength(1000)] public string Content { get; set; } = string.Empty;

    [Range(1, 5)] public int Rating { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    // Foreign key to Book
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    // Foreign key to User (Identity)
    public string UserId { get; set; } = string.Empty;
    public IdentityUser User { get; set; } = null!;
}