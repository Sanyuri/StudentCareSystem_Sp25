using PostSharp.Aspects;
using PostSharp.Serialization;

using Serilog;

namespace StudentCareSystem.Infrastructure.Aspects;

[PSerializable]
public class LoggingAspect : OnMethodBoundaryAspect
{
    public override void OnEntry(MethodExecutionArgs args)
    {
        Log.Debug("Entering {MethodName} with arguments {@Arguments}", args.Method.Name, args.Arguments);
    }

    public override void OnExit(MethodExecutionArgs args)
    {
        Log.Debug("Exiting {MethodName} with return value {@ReturnValue}", args.Method.Name, args.ReturnValue);
    }

    public override void OnException(MethodExecutionArgs args)
    {
        Log.Error(args.Exception, "Exception thrown in {MethodName} with arguments {@Arguments}", args.Method.Name, args.Arguments);
    }
}
