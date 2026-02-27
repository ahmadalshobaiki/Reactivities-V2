using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Date))]
public class Activity
{
    public Activity(){}
    [Required]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public DateTime Date { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool IsCancelled { get; set; }

    //location properties
    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // navigation properties.
    public ICollection<ActivityAttendee> Attendees { get; set; } = []; // Cardinality: Many Activity Many Attendees

    public ICollection<Comment> Comments { get; set; } = []; // Cardinality: 1 Activity Many Comments
}
