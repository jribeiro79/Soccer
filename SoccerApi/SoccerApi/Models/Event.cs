using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Event
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("playerId")]
    public string PlayerId { get; set; }

    [BsonElement("gameId")]
    public string GameId { get; set; }

    [BsonElement("teamId")]
    public string TeamId { get; set; }  // Adicionar Propriedade TeamId

    [BsonElement("type")]
    public string Type { get; set; }

    [BsonElement("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}