import { createContext, Dispatch, ReactNode, useState } from "react"
import { IPaymentData, IReturnURLs,   } from "../models/UnlimitAPIModel"

interface SettingsState {
    env : IENV
    updateENV: (updates: Partial<IENV>) => void
    paymentData : IPaymentData
    updatePaymentData: (updates: Partial<IPaymentData>) => void
    paymentMethod : string
    setPaymentMethod : Dispatch<React.SetStateAction<string>>
    returnURLs : IReturnURLs

}

interface IENV {
    terminal : string
    password : string
}


const envInitState : IENV = {
    terminal: "",
    password: "",
}

const paymentDataInitState : IPaymentData = {
    amount: 10.00,
    currency: "USD",
    preauth: false,
    three_ds_mode: "01"
}

const returnURLs : IReturnURLs = {
    success_url: `https://unlimt-demo.web.app/callback`,
    decline_url: `https://unlimt-demo.web.app/callback`,
}

const SettingsContext = createContext<SettingsState | undefined>(undefined);


function SettingsProvider ({children} : {children : ReactNode}) {
    const [env, setENV] = useState<IENV>(envInitState)

    const updateENV = (updates : Partial<IENV>) => {
        setENV(prev => ({...prev, ...updates}))
    }

    const [paymentData, setPaymentData] = useState<IPaymentData>(paymentDataInitState)

    const updatePaymentData = (updates : Partial<IPaymentData>) => {
        setPaymentData(prev => ({...prev, ...updates}))
    }

    const [paymentMethod, setPaymentMethod] = useState("BANKCARDJS")

    return (
        <SettingsContext.Provider value={{env,updateENV, paymentData, updatePaymentData, paymentMethod, setPaymentMethod, returnURLs}}>
            {children}
        </SettingsContext.Provider>
    )
}

export {SettingsContext, SettingsProvider }