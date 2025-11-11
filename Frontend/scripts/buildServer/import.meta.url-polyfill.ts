// export const importMetaUrl =
//   typeof document === 'undefined'
//     ? (new (require('url').URL)('file:' + __filename) as URL).href
//     : (document.currentScript && (document.currentScript as any).src) ||
//       new URL('main.js', document.baseURI).href

import { URL } from 'url'
import { fileURLToPath } from 'url'

// Xử lý __filename và __dirname trong ESM
const __filename = fileURLToPath(import.meta.url)

export const importMetaUrl =
  typeof document === 'undefined'
    ? new URL('file:' + __filename).href
    : (document.currentScript as HTMLScriptElement)?.src ||
      new URL('main.js', document.baseURI).href
