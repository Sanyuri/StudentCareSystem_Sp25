namespace StudentCareSystem.Application.Commons.Exceptions;

public class EntityAlreadyExistsException(string message) : Exception(message)
{
}
