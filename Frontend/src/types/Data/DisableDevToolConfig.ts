import { DetectorType } from '../Enums/DetectorType'

export interface IDisableDevtoolConfig {
  md5?: string // bypass disabled md5 value, see 3.2 for details, bypass disabled by default
  url?: string // Jump page when closing the page fails, the default value is localhost
  tkName?: string // bypass url parameter name when disabled, default is ddtk
  ondevtoolopen?(type: DetectorType, next: () => void): void // The callback for opening the developer panel, the url parameter is invalid when enabled, the type is monitoring mode, see 3.5 for details, the next function is to close the current window
  ondevtoolclose?(): void // callback for developer panel close
  interval?: number // timer interval default 200ms
  disableMenu?: boolean // Whether to disable the right-click menu Default is true
  stopIntervalTime?: number // Waiting time to cancel monitoring on mobile
  clearIntervalWhenDevOpenTrigger?: boolean // Whether to stop monitoring after triggering the default is false, this parameter is invalid when using ondevtoolclose
  detectors?: Array<DetectorType> // Enabled detectors See 3.5 for details of detectors. The default is all, it is recommended to use all
  clearLog?: boolean // Whether to clear the log every time
  disableSelect?: boolean // Whether to disable selection text Default is false
  disableCopy?: boolean // Whether to disable copying, default is false
  disableCut?: boolean // Whether to disable cutting, default is false
  disablePaste: boolean // Whether to disable paste, default is false
  ignore?: (string | RegExp)[] | null | (() => boolean) // Some cases ignore the disablement
  disableIframeParents?: boolean // Whether all parent windows are disabled in the iframe
  timeOutUrl?: string // Turn off URLs that page timeouts forward towards
  rewriteHTML?: string // Detecting the rewriting page after opening
}
