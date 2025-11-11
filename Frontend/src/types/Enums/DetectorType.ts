export enum DetectorType {
  Unknown = -1,
  RegToString = 0, // Check according to regular
  DefineId, // detect based on dom id
  Size, // Detect based on window size // After version 0.3.5, this probe is not enabled by default
  DateToString, // check against Date.toString
  FuncToString, // check according to Function.toString
  Debugger, // According to breakpoint detection, it is only valid in the case of ios chrome real machine
  Performance, // Performance detection based on log big data
  DebugLib, // Detect third-party debugging tools eruda and vconsole
}
