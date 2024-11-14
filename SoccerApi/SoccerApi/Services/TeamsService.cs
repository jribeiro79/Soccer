using MongoDB.Driver;
using Microsoft.Extensions.Options;

public class TeamsService
{
    private readonly IMongoCollection<Team> _teams;
    private readonly IMongoCollection<Event> _events;

    public TeamsService(IOptions<DatabaseSettings> settings)
    {
        //bool isDebug = false;

        //#if DEBUG
        //        isDebug = true;
        //#endif

        //var client = new MongoClient(isDebug ? settings.Value.SoccerDbDev : settings.Value.SoccerDb);
        var client = new MongoClient(settings.Value.SoccerDb);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _teams = database.GetCollection<Team>("Teams");
        _events = database.GetCollection<Event>("Events");
    }

    public List<Team> Get() => _teams.Find(team => true).ToList();

    public Team Get(string id)
    {
        var team = _teams.Find<Team>(team => team.Id == id).FirstOrDefault();
        if (team != null)
        {
            team.Players = team.Players.OrderBy(p => p.Name).ToList();
        }
        return team;
    }

    public List<Player> GetAllPlayers()
    {
        var teams = _teams.Find(team => true).ToList();
        var players = teams.SelectMany(t => t.Players).OrderBy(p => p.Name).ToList();
        return players;
    }

    public Player GetPlayer(string id)
    {
        var teams = _teams.Find(team => true).ToList();
        foreach (var team in teams)
        {
            var player = team.Players.FirstOrDefault(p => p.Id == id);
            if (player != null)
            {
                return player;
            }
        }
        return null;
    }

    public Team Create(Team team)
    {
        _teams.InsertOne(team);
        return team;
    }

    public void Update(string id, Team team) =>
        _teams.ReplaceOne(t => t.Id == id, team);

    public void Delete(string id) =>
        _teams.DeleteOne(t => t.Id == id);

    public void UpdatePlayer(string playerId, Player updatedPlayer)
    {
        var teams = _teams.Find(team => true).ToList();
        foreach (var team in teams)
        {
            var player = team.Players.FirstOrDefault(p => p.Id == playerId);
            if (player != null)
            {
                player.Name = updatedPlayer.Name;
                player.PreferredPosition = updatedPlayer.PreferredPosition;

                _teams.ReplaceOne(t => t.Id == team.Id, team);
                return;
            }
        }
    }

    public List<Event> GetEventsByTeam(string teamId)
    {
        var filter = Builders<Event>.Filter.Eq(e => e.TeamId, teamId);
        return _events.Find(filter).ToList();
    }

    public Dictionary<string, List<PlayerEventCount>> GetEventDetails(string teamId)
    {
        var teamEvents = GetEventsByTeam(teamId);
        var team = Get(teamId);
        if (team == null) return null;

        var details = new Dictionary<string, List<PlayerEventCount>>();

        var groupedEvents = teamEvents
            .GroupBy(e => e.Type)
            .ToDictionary(
                g => TranslateEventNameToPortuguese(g.Key), // Translate event names here
                g => g.GroupBy(e => e.PlayerId)
                      .Select(p => new PlayerEventCount
                      {
                          PlayerId = p.Key,
                          PlayerName = team.Players.FirstOrDefault(pl => pl.Id == p.Key)?.Name ?? "Unknown",
                          Count = p.Count()
                      }).ToList()
            );

        return groupedEvents;
    }

    private static string TranslateEventNameToPortuguese(string eventName)
    {
        switch (eventName)
        {
            case "Goal":
                return "Golos";
            case "Assist":
                return "Assistências";
            // Adicione outros casos conforme necessário
            default:
                return eventName;
        }
    }

    public Team GetByTeamId(string teamId)
    {
        return _teams.Find(team => team.Id == teamId).FirstOrDefault();
    }

    public Dictionary<string, string> GetPlayerNamesByTeamId(string teamId)
    {
        var team = GetByTeamId(teamId);
        return team?.Players.ToDictionary(p => p.Id, p => p.Name) ?? new Dictionary<string, string>();
    }
}