using Microsoft.EntityFrameworkCore;
using GameBacklogApi.Models;

namespace GameBacklogApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Game> Games => Set<Game>();
}