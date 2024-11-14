using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class GamesService
{
    private readonly IMongoCollection<Game> _games;

    public GamesService(IOptions<DatabaseSettings> settings)
    {
        bool isDebug = false;

#if DEBUG
                isDebug = true;
#endif

        var client = new MongoClient(isDebug ? settings.Value.SoccerDbDev : settings.Value.SoccerDb);
        //var client = new MongoClient(settings.Value.SoccerDb);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _games = database.GetCollection<Game>("Games");
    }

    public List<Game> GetGamesByTeam(string teamId) =>
        _games.Find(g => g.TeamId == teamId)
              .SortBy(g => g.GameDate)  // Ordenar por GameDate ascendente
              .ToList();

    public Game GetGame(string id) =>
        _games.Find(g => g.Id == id).FirstOrDefault();

    public Game CreateGame(Game game)
    {
        try
        {
            _games.InsertOne(game);
            return game;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao criar jogo: {ex.Message}");
            throw;
        }
    }

    public void UpdateGame(string id, Game game) =>
        _games.ReplaceOne(g => g.Id == id, game);

    public void DeleteGame(string id) =>
        _games.DeleteOne(g => g.Id == id);
}