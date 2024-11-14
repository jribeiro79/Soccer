using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class EventsService
{
    private readonly IMongoCollection<Event> _events;
    private readonly TeamsService _teamsService;

    public EventsService(IOptions<DatabaseSettings> settings, TeamsService teamsService)
    {
        bool isDebug = false;

#if DEBUG
                isDebug = true;
#endif

        var client = new MongoClient(isDebug ? settings.Value.SoccerDbDev : settings.Value.SoccerDb);
        //var client = new MongoClient(settings.Value.SoccerDb);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _events = database.GetCollection<Event>("Events");
        _teamsService = teamsService;
    }

    public List<Event> GetEventsByPlayer(string playerId) =>
        _events.Find(e => e.PlayerId == playerId).ToList();

    public List<Event> GetEventsByGame(string gameId) =>
        _events.Find(e => e.GameId == gameId).ToList();

    public List<Event> GetEventsByPlayerAndGame(string playerId, string gameId) =>
        _events.Find(e => e.PlayerId == playerId && e.GameId == gameId).ToList();

    public Event GetEvent(string id) =>
        _events.Find(e => e.Id == id).FirstOrDefault();

    public Event CreateEvent(Event ev)
    {
        _events.InsertOne(ev);
        return ev;
    }

    public void DeleteEvent(string id) =>
        _events.DeleteOne(ev => ev.Id == id);

    public Dictionary<string, List<PlayerEventCount>> GetGameEventDetails(string gameId)
    {
        var events = GetEventsByGame(gameId);

        var details = events
            .GroupBy(e => e.Type)
            .ToDictionary(
                g => g.Key,
                g => g.GroupBy(e => e.PlayerId)
                      .Select(p => new PlayerEventCount
                      {
                          PlayerId = p.Key,
                          PlayerName = p.First().PlayerId,
                          Count = p.Count()
                      }).ToList()
            );

        return details;
    }

    public List<string> GetDistinctEventTypesByGame(string gameId)
    {
        return _events
            .Find(e => e.GameId == gameId)
            .Project(e => e.Type)
            .ToEnumerable()
            .Distinct()
            .ToList();
    }

    public Dictionary<string, List<PlayerEventCount>> GetPlayerEventDetailsByGame(string gameId)
    {
        var events = GetEventsByGame(gameId);
        var teamId = events.FirstOrDefault()?.TeamId;

        var players = _teamsService.GetPlayerNamesByTeamId(teamId);

        var details = events
            .GroupBy(e => e.Type)
            .ToDictionary(
                g => g.Key,
                g => g.GroupBy(e => e.PlayerId)
                      .Select(p => new PlayerEventCount
                      {
                          PlayerId = p.Key,
                          PlayerName = players.ContainsKey(p.Key) ? players[p.Key] : "Unknown",
                          Count = p.Count()
                      }).ToList()
            );

        return details;
    }
}