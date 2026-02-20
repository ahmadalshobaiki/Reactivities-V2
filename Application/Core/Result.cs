using System;

namespace Application.Core;

public class Result<T> // represents the results of a request
{
    public bool isSuccess { get; set; }
    public T? Value { get; set; } // the properties of the object we are passing to Result at runtime
    public string? Error { get; set; }
    public int Code { get; set; }

    public static Result<T> Success(T value) => new () {isSuccess = true, Value = value}; //static method which instantiates a new (success) Result Object to be passed back to the controller and processed further
    public static Result<T> Failure(string error, int code) => new() //static method which instantiates a new (failure) Result Object to be passed back to the controller and processed further
    {
        isSuccess = false,
        Error = error,
        Code = code
    };
}
