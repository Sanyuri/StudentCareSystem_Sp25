namespace StudentCareSystem.Infrastructure.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class SkipChecksumAttribute : Attribute
{
}
