using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly GamesService _gamesService;

    public GamesController(GamesService gamesService)
    {
        _gamesService = gamesService;
    }

    [HttpGet("team/{teamId:length(24)}")]
    public ActionResult<List<Game>> GetGamesByTeam(string teamId)
    {
        var games = _gamesService.GetGamesByTeam(teamId);
        if (games == null || games.Count == 0)
        {
            return NotFound("Nenhum jogo encontrado para esta equipa.");
        }
        return games;
    }

    [HttpGet("{id:length(24)}")]
    public ActionResult<Game> GetGame(string id)
    {
        var game = _gamesService.GetGame(id);
        if (game == null)
        {
            return NotFound("Jogo não encontrado.");
        }
        return game;
    }

    [HttpPost]
    public ActionResult<Game> CreateGame([FromBody] Game game)
    {
        if (string.IsNullOrWhiteSpace(game.TeamId) || string.IsNullOrWhiteSpace(game.OpponentName) || game.GameDate == DateTime.MinValue)
        {
            return BadRequest("Todos os campos são obrigatórios.");
        }

        _gamesService.CreateGame(game);
        return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
    }

    [HttpPut("{id:length(24)}")]
    public IActionResult UpdateGame(string id, [FromBody] Game game)
    {
        var existingGame = _gamesService.GetGame(id);
        if (existingGame == null)
        {
            return NotFound("Jogo não encontrado.");
        }

        _gamesService.UpdateGame(id, game);
        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public IActionResult DeleteGame(string id)
    {
        var game = _gamesService.GetGame(id);
        if (game == null)
        {
            return NotFound("Jogo não encontrado.");
        }

        _gamesService.DeleteGame(id);
        return NoContent();
    }


    [HttpPost("{gameId:length(24)}/convocation")]
    public IActionResult SaveConvocation(string gameId, [FromBody] List<string> convocation)
    {
        var game = _gamesService.GetGame(gameId);
        if (game == null)
        {
            return NotFound("Jogo não encontrado.");
        }

        game.Convocation = convocation;
        _gamesService.UpdateGame(gameId, game);
        return NoContent();
    }
}