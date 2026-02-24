using System;

namespace Domain;

// self referencing table of users that are following/followers of each other (E.g. A User following a User). So, a new join table is created using the Users table
public class UserFollowing
{
    // Primary Keys
    public required string ObserverId { get; set; } // Foreign Key referencing UserId
    public required string TargetId { get; set; } // Foreign Key referencing UserId

    // navigation properties
    public User Observer { get; set; } = null!; // the person doing the following
    public User Target { get; set; } = null!; // the person being followed




}
