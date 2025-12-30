export const CURRENT_ENV = import.meta.env.MODE

export const isDev = CURRENT_ENV === 'development'

export const isProd = CURRENT_ENV === 'production'
