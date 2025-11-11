import express, { Request, Response, Router } from 'express'
import { ApiResponseServer } from '../type/apiResponseServer.js'
import moment from 'moment/moment.js'

const router: Router = express.Router()

router.get('/get-refresh-token', (req: Request, res: Response): void => {
  const refreshToken = req.cookies['refreshToken']
  const tokenResponse: ApiResponseServer = {
    status: 200,
    message: 'Successfully',
    data: refreshToken,
    timestamp: moment().unix(),
  }
  res.json(tokenResponse)
})

router.post('/add-token', (req: Request, res: Response): void => {
  const { refreshToken, accessToken }: { refreshToken: string; accessToken: string } = req.body.data

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Only the server can read the cookie
    secure: true,
  })
  res.cookie('accessToken', accessToken, {})
  const responseData: ApiResponseServer = {
    status: 200,
    message: 'Save to cookie successfully',
    data: { message: 'Save to cookie successfully' },
    timestamp: moment().unix(),
  }
  res.end(JSON.stringify(responseData))
})

router.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('refreshToken')
  res.end()
})

router.delete('/remove-token', (req: Request, res: Response): void => {
  res.clearCookie('refreshToken')
  res.clearCookie('accessToken')
  const responseData: ApiResponseServer = {
    status: 200,
    message: 'Remove successfully',
    data: { message: 'Remove successfully' },
    timestamp: moment().unix(),
  }
  res.end(JSON.stringify(responseData))
})

export default router
