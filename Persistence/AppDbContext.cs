using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Activity> Activities { get; set; }
    public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    public required DbSet<Photo> Photos { get; set; }
    public required DbSet<Comment> Comments { get; set; }
    public required DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));

        builder.Entity<ActivityAttendee>()
        .HasOne(x => x.User)
        .WithMany(x => x.Activities)
        .HasForeignKey(x => x.UserId);

        builder.Entity<ActivityAttendee>()
        .HasOne(x => x.Activity)
        .WithMany(x => x.Attendees)
        .HasForeignKey(x => x.ActivityId);

        // configure the UserFollowing self-referencing Many to Many relationship table
        builder.Entity<UserFollowing>(x =>
        {
            x.HasKey(k => new { k.ObserverId, k.TargetId }); // 2 Primary Keys on the new self-referencing table

            // FK Relationships
            x.HasOne(o => o.Observer) // 1 Observer (which is a User)
                .WithMany(f => f.Followings) // Has Many Targets
                .HasForeignKey(o => o.ObserverId) // and ObserverId is a foreign key 
                .OnDelete(DeleteBehavior.Cascade);

            x.HasOne(o => o.Target) // 1 Target (which is a User)
                .WithMany(f => f.Followers) // Has Many Observers
                .HasForeignKey(o => o.TargetId) // and TargetId is a foreign key
                .OnDelete(DeleteBehavior.Cascade);
        });


        // convert all DateTime properties of all entities into UTC Format
        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
        );

        // loop through all entities
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            // loop through the properties of that entity
            foreach (var property in entityType.GetProperties())
            {
                // if the property is type of DateTime, convert it to UTC Format
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}
