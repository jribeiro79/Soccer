using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class EventsService
{
    private readonly IMongoCollection<Event> _events;

    public EventsService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.SoccerDb);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _events = database.GetCollection<Event>("Events");
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

    public Dictionary<string, Dictionary<string, int>> GetGameStats(string gameId)
    {
        var events = GetEventsByGame(gameId);
        var stats = events.GroupBy(e => e.PlayerId)
                          .ToDictionary(
                              g => g.Key,
                              g => g.GroupBy(e => e.Type)
                                    .ToDictionary(gg => gg.Key, gg => gg.Count())
                          );

        return stats;
    }
}