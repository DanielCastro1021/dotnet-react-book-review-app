using dotnet_react_book_review_app.Server.Models;
using dotnet_react_book_review_app.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_react_book_review_app.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorController(AuthorService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetAuthors()
    {
        var authors = await service.GetAllAsync();
        return Ok(authors);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Book>> GetAuthorById(int id)
    {
        var author = await service.GetByIdAsync(id);
        return Ok(author);
    }

    [HttpPost]
    public async Task<ActionResult<Author>> CreateAuthor([FromBody] Author author)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await service.AddAsync(author);
        return CreatedAtAction(nameof(GetAuthorById), new { id = author.Id }, author);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Author>> UpdateAuthor(int id, [FromBody] Author author)
    {
        if (id != author.Id)
        {
            return BadRequest("Id missmatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingAuthor = await service.GetByIdAsync(id);
        if (existingAuthor == null)
        {
            return NotFound();
        }

        await service.UpdateAsync(author);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<Author>> DeleteAuthor(int id)
    {
        var author = await service.GetByIdAsync(id);
        if (author == null)
        {
            return NotFound();
        }

        await service.DeleteAsync(id);
        return NoContent();
    }
}