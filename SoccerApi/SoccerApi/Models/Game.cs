using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class Game
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("teamId")]
    public string TeamId { get; set; }

    [BsonElement("opponentName")]
    public string OpponentName { get; set; }

    [BsonElement("gameDate")]
    public DateTime GameDate { get; set; }

    [BsonElement("hasStarted")]
    public bool? HasStarted { get; set; } = false;

    [BsonElement("convocation")]
    public List<string> Convocation { get; set; } = new List<string>();
}