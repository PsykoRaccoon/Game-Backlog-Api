using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameBacklogApi.Data;
using GameBacklogApi.Models;

namespace GameBacklogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _context;
    public GamesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Games.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var game = await _context.Games.FindAsync(id);
        return game is null ? NotFound() : Ok(game);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = game.Id }, game);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Game updated)
    {
        var game = await _context.Games.FindAsync(id);
        if (game is null) return NotFound();

        game.Title = updated.Title;
        game.Platform = updated.Platform;
        game.Status = updated.Status;
        game.Rating = updated.Rating;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game is null) return NotFound();

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}