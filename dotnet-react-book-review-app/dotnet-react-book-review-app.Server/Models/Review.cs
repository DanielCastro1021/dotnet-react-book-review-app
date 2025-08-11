using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace dotnet_react_book_review_app.Server.Models;

public class Review
{
    public int Id { get; init; }

    [Required] [StringLength(1000)] public string Content { get; init; } = string.Empty;

    [Range(1, 5)] public int Rating { get; init; }

    public DateTime CreatedDate { get; init; } = DateTime.UtcNow;

    // Foreign key to Book
    public int BookId { get; init; }
    public Book Book { get; init; } = null!;

    // Foreign key to User (Identity)
    public string UserId { get; init; } = string.Empty;
    public IdentityUser User { get; init; } = null!;
}