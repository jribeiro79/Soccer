using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly TeamsService _teamsService;

    public PlayersController(TeamsService teamsService)
    {
        _teamsService = teamsService;
    }

    [HttpGet]
    public ActionResult<List<Player>> GetAllPlayers()
    {
        var players = _teamsService.GetAllPlayers();
        return players;
    }

    [HttpGet("{id:length(24)}", Name = "GetPlayer")]
    public ActionResult<Player> GetPlayer(string id)
    {
        var player = _teamsService.GetPlayer(id);
        if (player == null)
        {
            return NotFound("Jogador não encontrado.");
        }
        return player;
    }

    [HttpPut("{id:length(24)}")]
    public IActionResult UpdatePlayer(string id, [FromBody] Player updatedPlayer)
    {
        var player = _teamsService.GetPlayer(id);
        if (player == null)
        {
            return NotFound("Jogador não encontrado.");
        }

        player.PreferredPosition = updatedPlayer.PreferredPosition;
        _teamsService.UpdatePlayer(id, player);
        return NoContent();
    }
}