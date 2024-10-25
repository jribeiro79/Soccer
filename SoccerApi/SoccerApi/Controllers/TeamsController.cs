using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly TeamsService _teamsService;
    private readonly EventsService _eventsService;

    public TeamsController(TeamsService teamsService, EventsService eventsService)
    {
        _teamsService = teamsService;
        _eventsService = eventsService;
    }

    [HttpGet]
    public ActionResult<List<Team>> Get() =>
        _teamsService.Get();

    [HttpGet("{id:length(24)}", Name = "GetTeam")]
    public ActionResult<Team> Get(string id)
    {
        var team = _teamsService.Get(id);
        if (team == null)
        {
            return NotFound();
        }
        return team;
    }

    [HttpGet("{id:length(24)}/players", Name = "GetTeamPlayers")]
    public ActionResult<List<Player>> GetPlayers(string id)
    {
        var team = _teamsService.Get(id);
        if (team == null)
        {
            return NotFound();
        }
        return team.Players;
    }

    [HttpPost]
    public ActionResult<Team> Create([FromBody] Team team)
    {
        if (team == null || string.IsNullOrWhiteSpace(team.Name))
        {
            return BadRequest("O nome da equipa é obrigatório.");
        }
        team.Players = team.Players ?? new List<Player>();
        _teamsService.Create(team);
        return CreatedAtRoute("GetTeam", new { id = team.Id.ToString() }, team);
    }

    [HttpPost("{id:length(24)}/players")]
    public ActionResult<Player> AddPlayer(string id, [FromBody] Player player)
    {
        if (player == null || string.IsNullOrWhiteSpace(player.Name))
        {
            return BadRequest("O nome do jogador é obrigatório.");
        }
        var team = _teamsService.Get(id);
        if (team == null)
        {
            return NotFound("Equipa não encontrada.");
        }
        if (string.IsNullOrWhiteSpace(player.Id))
        {
            player.Id = ObjectId.GenerateNewId().ToString();
        }
        team.Players.Add(player);
        _teamsService.Update(id, team);
        return CreatedAtRoute("GetTeamPlayers", new { id = id }, player);
    }

    // Endpoint para obter estatísticas acumuladas de Golos e Assistências para a equipa
    [HttpGet("{id:length(24)}/cumulative-stats")]
    public ActionResult<Dictionary<string, int>> GetCumulativeTeamStats(string id)
    {
        var team = _teamsService.Get(id);
        if (team == null)
        {
            return NotFound();
        }

        var stats = new Dictionary<string, int>
        {
            { "Golos", 0 },
            { "Assistências", 0 }
        };

        foreach (var player in team.Players)
        {
            var events = _eventsService.GetEventsByPlayer(player.Id);
            stats["Golos"] += events.Count(e => e.Type == "Goal");
            stats["Assistências"] += events.Count(e => e.Type == "Assist");
        }

        return stats;
    }
}