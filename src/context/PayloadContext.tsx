/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, Dispatch, useState } from "react"

interface State {
    payload : PayloadState
    setPayload: Dispatch<React.SetStateAction<PayloadState>>
}

interface PayloadState {
    tokenReq?: any
    tokenRes?: any
    paymentReq?: any
    paymentRes?: any
    paymentDetailsReq? : any
    paymentDetailsRes? : any
}

export const payloadInitState : PayloadState  = {}

export const PayloadContext = createContext<State | undefined>(undefined)

export function PayloadProvider ({children} : {children : JSX.Element}) {

    const [payload, setPayload] = useState<PayloadState>(payloadInitState)

    return (
        <PayloadContext.Provider value={{payload, setPayload}}>
            {children}
        </PayloadContext.Provider>
    )
}

