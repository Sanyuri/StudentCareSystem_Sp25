import { OtpService } from '#src/services/OtpService.js'
import {
  CreateOtpRequest,
  VerifyChangeEmailOtpRequest,
} from '#src/types/RequestModel/OtpRequest.js'
import useLoadingStore from '#stores/loadingState.js'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export const useCreateChangeEmailRequestMutation = () => {
  const { setLoading } = useLoadingStore()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (email: CreateOtpRequest) => {
      await OtpService.sendChangeEmailRequest(email)
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000))
      await delay
      setLoading(false)
      toast.success(t('OTP.TOAST.SUCCESS'))
    },
    onError: (error: { data?: { message?: string } }) => {
      setLoading(false)
      const errorMessage = error.data?.message ?? t('OTP.TOAST.ERROR')
      toast.error(errorMessage)
    },
  })
}

export const useVerifyChangeEmailRequestMutation = () => {
  const { setLoading } = useLoadingStore()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: VerifyChangeEmailOtpRequest) => {
      await OtpService.verifyChangeEmailOtpRequest(data)
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000))
      await delay
      setLoading(false)
      toast.success(t('OTP.TOAST.SUCCESS'))
    },
    onError: (error: { data?: { message?: string } }) => {
      setLoading(false)
      const errorMessage = error.data?.message ?? t('OTP.TOAST.ERROR')
      toast.error(errorMessage)
    },
  })
}
