import config from '@/payload.config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  return await getPayload({ config })
}
