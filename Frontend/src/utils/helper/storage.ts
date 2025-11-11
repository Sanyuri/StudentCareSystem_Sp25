import { EncryptStorage } from 'encrypt-storage'
import { ENCRYPT_LOCALE_STORAGE_KEY } from '#src/configs/WebConfig.js'

export const encryptStorage = new EncryptStorage(ENCRYPT_LOCALE_STORAGE_KEY)
