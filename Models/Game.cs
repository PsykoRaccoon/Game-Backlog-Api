namespace GameBacklogApi.Models;

public class Game
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public string Status { get; set; } = "Backlog"; 
    public int Rating { get; set; }
}