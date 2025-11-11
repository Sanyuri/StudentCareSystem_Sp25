// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag/50052194#50052194
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = path.dirname(__filename)

const root = `${__dirname}/..`

export { root }
