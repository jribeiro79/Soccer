using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class TeamsService
{
    private readonly IMongoCollection<Team> _teams;

    public TeamsService(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.SoccerDb);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _teams = database.GetCollection<Team>(settings.Value.TeamsCollectionName);
    }

    public List<Team> Get() => _teams.Find(team => true).ToList();

    public Team Get(string id) => _teams.Find<Team>(team => team.Id == id).FirstOrDefault();

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

    public List<Player> GetAllPlayers()
    {
        var teams = _teams.Find(team => true).ToList();
        var players = teams.SelectMany(t => t.Players).ToList();
        return players;
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
}