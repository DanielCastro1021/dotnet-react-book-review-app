using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using dotnet_react_book_review_app.Server.Models;

namespace dotnet_react_book_review_app.Server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)  : IdentityDbContext(options)
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Category> Categories { get; set; }
}