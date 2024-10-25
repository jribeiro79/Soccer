using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly EventsService _eventsService;

    public EventsController(EventsService eventsService)
    {
        _eventsService = eventsService;
    }

    // Listar eventos por jogador
    [HttpGet("player/{playerId:length(24)}")]
    public ActionResult<List<Event>> GetEventsByPlayer(string playerId)
    {
        var events = _eventsService.GetEventsByPlayer(playerId);
        if (events == null || events.Count == 0)
        {
            return NotFound("Nenhum evento encontrado para este jogador.");
        }
        return events;
    }

    // Listar eventos por jogo
    [HttpGet("game/{gameId:length(24)}")]
    public ActionResult<List<Event>> GetEventsByGame(string gameId)
    {
        var events = _eventsService.GetEventsByGame(gameId);
        if (events == null || events.Count == 0)
        {
            return NotFound("Nenhum evento encontrado para este jogo.");
        }
        return events;
    }

    // Listar estatísticas de eventos por jogo
    [HttpGet("game/{gameId}/stats")]
    public ActionResult<Dictionary<string, Dictionary<string, int>>> GetGameStats(string gameId)
    {
        var events = _eventsService.GetEventsByGame(gameId);

        if (events == null || events.Count == 0)
        {
            return NotFound("Nenhum evento encontrado para este jogo.");
        }

        var stats = events.GroupBy(e => e.PlayerId)
                          .ToDictionary(
                              g => g.Key,
                              g => g.GroupBy(e => e.Type)
                                    .ToDictionary(gg => gg.Key, gg => gg.Count())
                          );

        return stats;
    }

    // Criar novo evento
    [HttpPost]
    public ActionResult<Event> CreateEvent([FromBody] Event ev)
    {
        _eventsService.CreateEvent(ev);
        return CreatedAtAction(nameof(GetEventsByPlayer), new { playerId = ev.PlayerId }, ev);
    }

    // Apagar evento por ID
    [HttpDelete("{id:length(24)}")]
    public IActionResult DeleteEvent(string id)
    {
        var eventToDelete = _eventsService.GetEvent(id);
        if (eventToDelete == null)
        {
            return NotFound("Evento não encontrado.");
        }

        _eventsService.DeleteEvent(id);
        return NoContent();
    }

    // Listar estatísticas de eventos por jogador e jogo
    [HttpGet("game/{gameId:length(24)}/player/{playerId:length(24)}/stats")]
    public ActionResult<Dictionary<string, int>> GetPlayerStats(string gameId, string playerId)
    {
        var events = _eventsService.GetEventsByPlayerAndGame(playerId, gameId);

        if (events == null || events.Count == 0)
        {
            return NotFound("Nenhum evento encontrado para este jogador neste jogo.");
        }

        var stats = events.GroupBy(e => e.Type)
                          .ToDictionary(g => g.Key, g => g.Count());

        return stats;
    }
}