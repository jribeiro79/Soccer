using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Team
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }  // Torna o Id opcional

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("players")]
    public List<Player> Players { get; set; } = new List<Player>(); // Inicializa com uma lista vazia
}