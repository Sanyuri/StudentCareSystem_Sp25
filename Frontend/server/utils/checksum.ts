import moment from 'moment/moment.js'
import CryptoJS from 'crypto-js'
import { NextFunction, Request, Response } from 'express'
import { ENV } from '../config/envConfig.js'

const generateChecksum = (input: string, privateKey: string): string => {
  const currentTime: number = moment().unix() // Get current timestamp in seconds
  const dataWithTime: string = input + currentTime
  const checksum: string = CryptoJS.HmacSHA256(dataWithTime, privateKey).toString(CryptoJS.enc.Hex) // Use HMAC with the secret key
  return `${checksum}:${currentTime}`
}

export function addChecksum(req: Request, res: Response, next: NextFunction) {
  const campusCode: string | string[] | undefined = req.headers['campuscode']
  req.headers['Check-Sum'] = generateChecksum(
    `PublicKey1${campusCode} PublicKey2`,
    ENV.CHECKSUM_KEY,
  )
  next()
}
