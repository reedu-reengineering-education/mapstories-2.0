declare module 'klaro' {
  export interface KlaroService {
    name: string
    title?: string
    purposes?: string[]
    cookies?: (string | RegExp)[]
    required?: boolean
    description?: string
  }

  export interface KlaroConfig {
    storageMethod?: 'cookie' | 'localStorage'
    storageName?: string
    privacyPolicy?: string

    mustConsent?: boolean
    acceptAll?: boolean
    hideDeclineAll?: boolean

    services?: KlaroService[]

    translations?: Record<
      string,
      Record<
        string,
        {
          title?: string
          description?: string
        }
      >
    >
  }

export interface KlaroManager {
  consents: Record<string, boolean>
  getConsent(service: string): boolean
  setConsent(service: string, value: boolean): void
  acceptAll(): void
  saveAndApplyConsents(): void
}

  export function setup(config: KlaroConfig): void
  export function show(): void
  export function getManager(): KlaroManager
}

declare module 'klaro/dist/klaro.css' {
  const content: string
  export default content
}
