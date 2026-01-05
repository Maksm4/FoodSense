namespace Common.Exceptions;
using FluentValidation.Results;

public class ValidationException() : Exception("One or more validation failures have occurred.")
{
    public IDictionary<string, string[]> Errors { get; init; } = new Dictionary<string, string[]>();
    
    public ValidationException(IEnumerable<ValidationFailure> failures) : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }
}