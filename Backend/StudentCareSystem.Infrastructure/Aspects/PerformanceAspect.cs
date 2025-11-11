using System.Diagnostics;
using System.Runtime;

using PostSharp.Aspects;
using PostSharp.Serialization;

using Serilog;

namespace StudentCareSystem.Infrastructure.Aspects;

[PSerializable]
public class PerformanceAspect : OnMethodBoundaryAspect
{
    private Stopwatch _stopwatch = new();
    private long _startMemory;
    public int ThresholdMilliseconds { get; set; } = 100; // Default threshold in ms
    public bool LogMemoryUsage { get; set; } = true;

    public override void OnEntry(MethodExecutionArgs args)
    {
        _stopwatch = Stopwatch.StartNew();

        if (LogMemoryUsage)
        {
            // Collect memory usage at the start of method execution
            _startMemory = GC.GetTotalMemory(forceFullCollection: false);
        }

        Log.Debug("Starting performance measurement for {MethodName}.", args.Method.Name);
    }

    public override void OnExit(MethodExecutionArgs args)
    {
        _stopwatch.Stop();
        var elapsedMilliseconds = _stopwatch.ElapsedMilliseconds;

        if (LogMemoryUsage)
        {
            // Collect memory usage at the end of method execution
            long endMemory = GC.GetTotalMemory(forceFullCollection: false);
            long memoryUsed = endMemory - _startMemory;

            Log.Information(
                "Performance measurement: {MethodName} executed in {ElapsedMilliseconds} ms and used {MemoryUsed} bytes.",
                args.Method.Name, elapsedMilliseconds, memoryUsed
            );
        }
        else
        {
            Log.Information(
                "Performance measurement: {MethodName} executed in {ElapsedMilliseconds} ms.",
                args.Method.Name, elapsedMilliseconds
            );
        }

        if (elapsedMilliseconds > ThresholdMilliseconds)
        {
            Log.Warning(
                "Performance issue: {MethodName} took {ElapsedMilliseconds} ms (threshold: {Threshold} ms).",
                args.Method.Name, elapsedMilliseconds, ThresholdMilliseconds
            );
        }
    }
}
