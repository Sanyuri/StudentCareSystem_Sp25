import { IDisableDevtoolConfig } from '#src/types/Data/DisableDevToolConfig.js'
import { DetectorType } from '#src/types/Enums/DetectorType.js'

export const disableDevtoolConfig: IDisableDevtoolConfig = {
  md5: '', // Leave blank if bypass based on MD5 is not used
  url: 'https://theajack.github.io/disable-devtool/404.html?h=fu-scs.fpt.edu.vn', // Redirect URL if the user cannot close the page
  tkName: 'ddtk', // URL parameter name for bypass, default is 'ddtk'
  interval: 200, // Timer interval, default is 200ms
  stopIntervalTime: 5000, // Waiting time to stop monitoring on mobile devices

  // Behavioral settings
  disableMenu: true, // Disable the right-click menu
  clearLog: true, // Clear the console log after each check
  disableSelect: false, // Disable text selection
  disableCopy: false, // Disable copying text
  disableCut: false, // Disable cutting text
  disablePaste: false, // Disable pasting text
  disableIframeParents: true, // Disable all parent pages if running in an iframe

  // Enabled detectors
  detectors: [DetectorType.RegToString, DetectorType.DebugLib, DetectorType.Performance],

  // Callback functions when DevTools is opened or closed
  ondevtoolopen: (type: DetectorType, next: () => void): void => {
    next() // Execute the function to close the window or redirect
  },
  ondevtoolclose: () => {
    alert('DevTools has been closed')
  },

  clearIntervalWhenDevOpenTrigger: false, // Do not stop monitoring when DevTools is opened
  ignore: null, // No cases to ignore

  timeOutUrl: 'https://theajack.github.io/disable-devtool/404.html?h=fu-scs.fpt.edu.vn', // URL to redirect when the page times out
  rewriteHTML: '<h1>DevTools is not allowed</h1>', // HTML content to display when DevTools is detected
}
