/* eslint-disable no-console */
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  MutableRefObject,
  useMemo,
} from 'react'
import { StringeeUtil, StringeeClient, StringeeCall } from 'stringee'
import { Drawer } from 'antd'
import { StudentResponse } from '#src/types/ResponseModel/StudentResponse.js'
import { StudentsService } from '#src/services/StudentsService.js'
import CallStatus from './CallStatus'
import StudentSearch from './StudentSearch'
import CallControls from './CallControls'
import { useStringeeData } from '#hooks/api/stringee/useStringeeData.js'
import { useTranslation } from 'react-i18next'
import NotePhone from './NotePhone'

// Define types for better type safety
interface CallResponse {
  r: number
  message?: string
  toType?: string
}

interface CallState {
  code: number
  reason: string
}

interface PhoneCallSiderProps {
  visible: boolean
  onClose: () => void
}

const PhoneCallSider: React.FC<PhoneCallSiderProps> = ({ visible, onClose }) => {
  const { t } = useTranslation()

  // State with proper typing

  const [client, setClient] = useState<StringeeClient | null>(null)
  const [call, setCall] = useState<StringeeCall | null>(null)
  const [userId, setUserId] = useState('')
  const [callStatus, setCallStatus] = useState('')
  const [callType, setCallType] = useState('')
  const [isCalling, setIsCalling] = useState(false)
  const [selectedFromNumber, setSelectedFromNumber] = useState<string | undefined>(undefined)
  const [student, setStudent] = useState<StudentResponse>()
  const [selectedCountryCode, setSelectedCountryCode] = useState('84')

  const [phoneNumberValue, setPhoneNumberValue] = useState('')
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const { data: tokenData, refetch: refetchToken } = useStringeeData()

  const fromNumberOptions = useMemo(
    () =>
      tokenData?.phoneNumber
        ? [{ value: tokenData.phoneNumber, label: tokenData.phoneNumber }]
        : [],
    [tokenData?.phoneNumber],
  )

  const countryCodeOptions = [
    { value: '84', label: '+84 (Vietnam)' },
    { value: '81', label: '+81 (Japan)' },
  ]

  // Memoized functions to prevent unnecessary re-renders
  const stopCall = useCallback(() => {
    setIsCalling(false)
    setTimeout(() => setCallStatus('Call ended'), 1000)
  }, [])

  const setupCallEvents = useCallback(
    (callInstance: StringeeCall) => {
      callInstance.on('error', (info: unknown) => console.error('Call error:', info))

      callInstance.on('addlocalstream', (stream: MediaStream) => {
        console.log('Local stream added', stream)
      })

      callInstance.on('addremotestream', (stream: MediaStream) => {
        console.log('Remote stream added', stream)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
      })

      callInstance.on('signalingstate', (state: CallState) => {
        console.log('Signaling state:', state)
        setCallStatus(state.reason)

        if (state.code === 5 || state.code === 6) {
          stopCall()
        }
      })

      callInstance.on('mediastate', (state: CallState) => {
        console.log('Media state:', state)
      })

      callInstance.on('info', (info: unknown) => {
        console.log('Info:', info)
      })
    },
    [stopCall],
  )

  const setupClientEvents = useCallback(
    (clientInstance: StringeeClient) => {
      clientInstance.on('connect', () => console.log('Connected to StringeeServer'))

      clientInstance.on('authen', (res: { r: number; userId: string; message: string }) => {
        if (res.r === 0) {
          setUserId(res.userId)
        } else {
          setCallStatus(res.message)
        }
      })

      clientInstance.on('disconnect', () => {
        setCallStatus('Disconnected')
        setIsCalling(false)
      })

      clientInstance.on('incomingcall', (incomingCall: StringeeCall) => {
        setCall(incomingCall)

        setupCallEvents(incomingCall)

        const type = incomingCall.fromInternal ? 'App-to-App call' : 'Phone-to-App call'
        setCallType(type)
      })

      clientInstance.on('requestnewtoken', () => {
        console.warn('Request new token from server and call client.connect(newToken)')
      })

      clientInstance.on('otherdeviceauthen', (data: { userId: string; time: number }) => {
        console.log('Authenticated on another device:', data)
      })
    },
    [setupCallEvents],
  )

  useEffect(() => {
    console.log('WebRTC Supported:', StringeeUtil.isWebRTCSupported())

    if (!tokenData?.accessToken) {
      return
    }

    const accessToken = tokenData.accessToken

    const stringeeClient = new StringeeClient()
    setClient(stringeeClient)

    stringeeClient.connect(accessToken)
    setupClientEvents(stringeeClient)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData])

  const handleCall = useCallback(() => {
    if (!client) return

    const phoneNumber = phoneNumberValue.trim()
    let from = selectedFromNumber || ''

    if (!phoneNumber) return
    if (!from) from = userId

    // Format the phone number with country code
    const to = phoneNumber.startsWith(selectedCountryCode)
      ? phoneNumber
      : `${selectedCountryCode}${phoneNumber.replace(/^0+/, '')}`

    const newCall = new StringeeCall(client, from, to)
    setCall(newCall)
    setupCallEvents(newCall)

    newCall.makeCall((res: CallResponse) => {
      if (res.r !== 0) {
        setCallStatus(res.message ?? 'Call failed')
      } else {
        setCallType(res.toType === 'internal' ? 'App-to-App call' : 'App-to-Phone call')
        setIsCalling(true)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, userId, setupCallEvents, selectedFromNumber, selectedCountryCode])

  const handleHangup = useCallback(() => {
    console.log('hangup')
    if (call) {
      call.hangup((res) => {
        console.log('hangup res', res)
        stopCall()
      })
    }
  }, [call, stopCall])

  const timeoutRef: MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null)

  const handleStudentCodeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.target.value

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async (): Promise<void> => {
      const student: StudentResponse = await StudentsService.getStudentById(value)

      if (student == null) {
        setStudent(undefined)
        return
      }

      setStudent(student)
    }, 500)
  }

  const selectPhoneNumber = useCallback((phoneNumber: string) => {
    if (phoneNumber && phoneNumber !== 'N/A') {
      setPhoneNumberValue(phoneNumber)
    }
  }, [])

  return (
    <Drawer
      title={t('COMMON.CALL_SERVICE')}
      placement='right'
      onClose={onClose}
      open={visible}
      width='60%'
      styles={{
        body: {
          padding: 0,
          overflow: 'auto',
        },
      }}
    >
      <div className='p-4'>
        <h2 className='text-xl font-bold text-center mb-4'>{t('COMMON.CALL_SERVICE')}</h2>

        {/* Status display */}
        <CallStatus callStatus={callStatus} callType={callType} />

        {/* Student Search Section */}
        <StudentSearch
          student={student}
          handleStudentCodeChange={handleStudentCodeChange}
          selectPhoneNumber={selectPhoneNumber}
        />

        {/* Call Controls */}
        <CallControls
          userId={userId}
          isCalling={isCalling}
          fromNumberOptions={fromNumberOptions}
          countryCodeOptions={countryCodeOptions}
          selectedFromNumber={selectedFromNumber}
          selectedCountryCode={selectedCountryCode}
          setSelectedFromNumber={setSelectedFromNumber}
          setSelectedCountryCode={setSelectedCountryCode}
          phoneNumberValue={phoneNumberValue}
          setPhoneNumberValue={setPhoneNumberValue}
          handleCall={handleCall}
          handleHangup={handleHangup}
          hasToken={!!tokenData?.accessToken}
          onGetToken={refetchToken}
        />

        <NotePhone phoneCallId='dfd' />
      </div>
    </Drawer>
  )
}

export default PhoneCallSider
