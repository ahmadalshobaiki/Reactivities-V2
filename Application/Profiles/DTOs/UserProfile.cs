using System;

namespace Application.Profiles.DTOs;

public class UserProfile
{
    public string Id { get; set; }
    public string DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public bool Following { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
}
