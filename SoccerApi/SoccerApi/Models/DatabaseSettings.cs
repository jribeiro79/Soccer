public class DatabaseSettings : IDatabaseSettings
{
    public string SoccerDb { get; set; }

    //public string SoccerDbDev { get; set; }

    public string DatabaseName { get; set; }
    
    public string TeamsCollectionName { get; set; }
}

public interface IDatabaseSettings
{
    string SoccerDb { get; set; }

    //string SoccerDbDev { get; set; }
    
    string DatabaseName { get; set; }
    
    string TeamsCollectionName { get; set; }
}