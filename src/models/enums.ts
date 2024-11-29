
export interface IPaymentMethod {
    displayName : string
    imgSrc : string
    terminalCode : string
    password : string
    children : JSX.Element
  }

export type PaymentMethodType = 'BANKCARDJS' | 'BANKCARDPP' | 'BANKCARDGW' | 'BANKCARDS2S' | 'GOOGLEPAY' | 'APPLEPAY' | "ALIPAYPLUS" | "SPEI" | "OXXO" | "CODI" | "AIRTELTZS";