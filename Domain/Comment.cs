using System;

namespace Domain;

public class Comment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Body { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Nav properties = Navigation properties represents the links in the entity relationship diagram. However, This is just used for navigation purposes and does not reflect the real cardinality. The cardinal relationship is set by the database as the single source of truth. This is just to access the objects via the code.
    public required string UserId { get; set; } // Cardinality: 1 User Many Comments
    public User User { get; set; } = null!;

    public required string ActivityId { get; set; } // Cardinality: 1 Activity Many Comments
    public Activity Activity { get; set; } = null!;
}
