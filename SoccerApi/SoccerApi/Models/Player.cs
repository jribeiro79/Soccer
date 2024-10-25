using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Player
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("preferredPosition")]
    public List<string> PreferredPosition { get; set; } = new List<string>();
}