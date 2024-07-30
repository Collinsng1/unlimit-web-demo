import  { createContext, useState, ReactNode } from 'react';
import { ICustomer, IAddress, IMerchantOrder } from '../models/UnlimitAPIModel';
import { v4 as uuidv4 } from 'uuid';

// Define the type for the context state
interface CheckoutDetailsState {
    merchantOrder : IMerchantOrder
    customer: ICustomer
    updateCustomer: (updates: Partial<ICustomer>) => void
    updateAddress: (updates: Partial<IAddress>) => void
}


const CheckoutDetailsContext = createContext<CheckoutDetailsState | undefined>(undefined);

const customerInitState: ICustomer = {
    fullName: 'Collins Ng',
    email: 'c.ng@unlimit.com',
    phone: '85265906471',
    shipping_address: {
        addr_line_1: 'Room A, 10/F, Building ABC',
        addr_line_2: 'Causeway Bay, Hong Kong Island, Hong Kong',
        city: 'Hong Kong',
        country: 'HK',
        state: 'Hong Kong',
        zip: "000000"
    }
}

function CheckoutDetailsProvider({ children }: { children: ReactNode }) {

    const merchantOrder : IMerchantOrder = {
        id: uuidv4(),
        description: 'Umlimit Demo by Collins'
    } 

    const [customer, setCustomer] = useState<ICustomer>(customerInitState)

    const updateCustomer = (updates: Partial<ICustomer>) => {
        setCustomer(prev => ({ ...prev, ...updates }))
    }

    const updateAddress = (updates: Partial<IAddress>) => {
        setCustomer(prev => ({ ...prev, shipping_address: {...prev.shipping_address, ...updates} }))
    }

    return (
        <CheckoutDetailsContext.Provider value={{ merchantOrder, customer, updateCustomer, updateAddress }}>
            {children}
        </CheckoutDetailsContext.Provider>
    );
}

export { CheckoutDetailsContext, CheckoutDetailsProvider };