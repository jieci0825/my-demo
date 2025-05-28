import mitt from 'mitt'
import type { EventBus } from '@/types'

export const emitter = mitt<EventBus>()
