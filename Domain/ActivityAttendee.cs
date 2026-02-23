using System;

namespace Domain;

public class ActivityAttendee
{
    public string? UserId { get; set; } // Foreign Key
    public string? ActivityId { get; set; } // Foreign Key
    public bool IsHost { get; set; }
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;

    // nav properties of the ActivityAttendee Domain. Since this domain is a the result of the Many to Many relationship between Users and Activities
    public User User { get; set; } = null!;
    public Activity Activity { get; set; } = null!;
}
