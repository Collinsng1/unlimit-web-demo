
export interface IPaymentMethod {
    displayName : string
    imgSrc : string
    terminalCode : string
    password : string
    children : React.ComponentType
  }

export type PaymentMethodType = 'BANKCARDJS' | 'BANKCARDPP' | 'BANKCARDGW' | 'BANKCARDS2S' | 'GOOGLEPAY' | 'APPLEPAY';