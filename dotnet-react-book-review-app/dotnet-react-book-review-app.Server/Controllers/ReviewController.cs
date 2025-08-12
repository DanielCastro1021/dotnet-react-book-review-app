using dotnet_react_book_review_app.Server.Models;
using dotnet_react_book_review_app.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_react_book_review_app.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController(ReviewService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
    {
        var reviews = await service.GetAllAsync();
        return Ok(reviews);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Review>> GetReview(int id)
    {
        var review = await service.GetByIdAsync(id);
        if (review == null)
        {
            return NotFound();
        }

        return Ok(review);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Review>> CreateReview([FromBody] Review review)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await service.AddAsync(review);
        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> UpdateReview(int id, [FromBody] Review review)
    {
        if (id != review.Id)
        {
            return BadRequest("ID mismatch");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingReview = await service.GetByIdAsync(id);
        if (existingReview == null)
        {
            return NotFound();
        }

        await service.UpdateAsync(review);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await service.GetByIdAsync(id);
        if (review == null)
        {
            return NotFound();
        }

        await service.DeleteAsync(id);
        return NoContent();
    }
}