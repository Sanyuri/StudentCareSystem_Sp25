/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'stringee' {
  export class StringeeUtil {
    static isWebRTCSupported(): boolean
  }

  export class StringeeClient {
    constructor()
    connect(accessToken: string): void
    on(
      event:
        | 'connect'
        | 'authen'
        | 'disconnect'
        | 'incomingcall'
        | 'requestnewtoken'
        | 'otherdeviceauthen',
      callback: Function,
    ): void
  }

  export class StringeeCall {
    constructor(client: StringeeClient, from: string, to: string)
    makeCall(callback: (res: { r: number; message?: string; toType?: string }) => void): void
    answer(callback: (res: any) => void): void
    reject(callback: (res: any) => void): void
    hangup(callback: (res: any) => void): void
    on(
      event:
        | 'error'
        | 'addlocalstream'
        | 'addremotestream'
        | 'signalingstate'
        | 'mediastate'
        | 'info'
        | 'otherdevice',
      callback: Function,
    ): void
    fromNumber: string
    fromInternal: boolean
  }
}
