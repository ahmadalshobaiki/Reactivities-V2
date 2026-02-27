using System;

namespace Application.Core;

public class PaginationParams<TCursor>
{
    private const int MaxPageSize = 50; // implicitly static. Belongs to the container class itself so its accessible by inner classes. Non-static properties are not accessible and requires object instances
    public TCursor? Cursor { get; set; } // Optional date sent in on the request
    private int _pageSize = 3; // A field (just a variable inside a class) that specifies the page size
    public int PageSize // A property (a special member that controls access to a field) to manipulate the page size (Properties are actually getters and setters + the field which the compiler creates behind the scenes. Thats why its standard in C#)
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}
