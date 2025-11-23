declare module 'speakeasy' {
  export interface GenerateSecretOptions {
    name: string
    issuer: string
    length?: number
  }

  export interface Secret {
    base32?: string
    hex?: string
    ascii?: string
    otpauth_url?: string
    qr_code_url?: string
    google_auth_qr?: string
  }

  export interface VerifyOptions {
    secret: string
    encoding: 'base32' | 'hex' | 'ascii'
    token: string
    window?: number
    time?: number
    step?: number
  }

  export interface TotpOptions {
    secret: string
    encoding?: 'base32' | 'hex' | 'ascii'
    time?: number
    step?: number
    initial_time?: number
    length?: number
    algorithm?: 'sha1' | 'sha256' | 'sha512'
  }

  export interface OtpauthURLOptions {
    secret: string
    label: string
    issuer: string
    encoding?: 'base32' | 'hex' | 'ascii'
    algorithm?: 'sha1' | 'sha256' | 'sha512'
    digits?: number
    period?: number
    type?: 'totp' | 'hotp'
    counter?: number
  }

  export namespace totp {
    function verify(options: VerifyOptions): boolean | null
    function generate(options: TotpOptions): string
  }

  export namespace hotp {
    function verify(options: VerifyOptions): boolean | null
    function generate(options: TotpOptions): string
  }

  function generateSecret(options: GenerateSecretOptions): Secret
  function verify(options: VerifyOptions): boolean | null
  function generate(options: TotpOptions): string
  function otpauthURL(options: OtpauthURLOptions): string

  const speakeasy: {
    generateSecret: typeof generateSecret
    verify: typeof verify
    generate: typeof generate
    otpauthURL: typeof otpauthURL
    totp: typeof totp
    hotp: typeof hotp
  }

  export default speakeasy
}

