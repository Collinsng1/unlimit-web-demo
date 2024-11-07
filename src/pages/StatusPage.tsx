import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SettingsContext } from "../context/SettingContext";
import { ItemCard, paymentMethods } from "./HomePage.tsx";
import Divider from "../components/Divider";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { PayloadContext } from "../context/PayloadContext";
import { getAccessToken, getPaymentDetails } from "../services/UnlimitService";
import { getPayload } from "../services/PayloadService.ts";

export default function StatusPage() {

    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)
    const [searchParams] = useSearchParams();

    //  Hook
    const nav = useNavigate()

    useEffect(() => {

        const merchantOrderId = searchParams.get("id")

        if (!merchantOrderId) {
            nav("/")
            return
        }
        
        const init = async () => {

            let terminalId = settingContext?.env.terminal
            let password = settingContext?.env.password

            if(terminalId  === "" || password === "" || !terminalId || !password) {
                const paylaod = await getPayload(merchantOrderId)
                payloadContext?.setPayload(paylaod)

                const paymentMethod = paylaod.paymentReq.payment_method

                const data = Object.entries(paymentMethods).find(([pm]) => pm === paymentMethod)

                if (!data) {
                    nav("/")
                    return
                }
                
                terminalId = data[1].terminalCode
                password = data[1].password
            }
    

            const accessToken = await getAccessToken(terminalId, password)
            const payments = await getPaymentDetails(accessToken, merchantOrderId)

            payloadContext?.setPayload(prev => ({...prev, paymentDetailsRes: payments["data"][0]}))
        }

        init()
    }, [])

    return (
        <div className="container flex flex-col lg:flex-row px-[16px] lg:px-0 py-[16px] mx-auto">
            <div className="flex-1">
                <div>{searchParams.get("id")}</div>
                <div className="font-bold mb-[24px]">Purchase Summary</div>
                <ItemCard />
                <Divider />
                <div className="font-bold mb-[24px]">Customer Details</div>
                <CustomerSection />
                <Divider />
                <div className="font-bold mb-[24px]">Shipping Address</div>
                <AddressSection />
                <Divider />
            </div>
            <div className="w-[24px]" />
            <div className="flex-1">
                 {
                    payloadContext?.payload.tokenReq && <>
                        <div className="font-bold mb-[16px]">Token Request</div>
                        <pre className="bg-black p-[24px] rounded-[16px] mb-[24px] whitespace-pre-wrap  w-full">
                            <code className="text-[14px] break-all text-[#C9F73A]">
                                {JSON.stringify(payloadContext?.payload.tokenReq, null, 2)}
                            </code>
                        </pre>
                    </>
                } 
                {
                    payloadContext?.payload.tokenRes && <>
                        <div className="font-bold mb-[16px]">Token Response</div>
                        <pre className="bg-black p-[24px] rounded-[16px] mb-[24px] whitespace-pre-wrap  w-full">
                            <code className="text-[#C9F73A] text-[14px] break-all" >
                                {JSON.stringify(payloadContext?.payload.tokenRes, null, 2)}
                            </code>
                        </pre>
                    </>
                }
                {
                    payloadContext?.payload.paymentReq && <>
                        <div className="font-bold mb-[16px]">Payment Request</div>
                        <pre className="bg-black p-[24px] rounded-[16px] mb-[24px] whitespace-pre-wrap w-full">
                            <code className="text-[#C9F73A] text-[14px] break-all">
                                {JSON.stringify(payloadContext?.payload.paymentReq, null, 2)}
                            </code>
                        </pre>
                    </>
                } 
                 {
                    payloadContext?.payload.paymentRes && <>
                        <div className="font-bold mb-[16px]">Payment Response</div>
                        <pre className="bg-black p-[24px] rounded-[16px] mb-[24px] whitespace-pre-wrap w-full">
                            <code className="text-[#C9F73A] text-[14px] break-all">
                                {JSON.stringify(payloadContext?.payload.paymentRes, null, 2)}
                            </code>
                        </pre>
                    </>
                } 
                {
                    payloadContext?.payload.paymentDetailsReq && <>
                        <div className="font-bold mb-[16px]">Get Payment Details Request (/payment)</div>
                        <pre className="bg-black p-[24px] rounded-[16px] mb-[24px] whitespace-pre-wrap w-full">
                            <code className="text-[#C9F73A] text-[14px] break-all">
                                {JSON.stringify(payloadContext?.payload.paymentDetailsReq, null, 2)}
                            </code>
                        </pre>
                    </>
                }
                {
                    payloadContext?.payload.paymentDetailsRes && <>
                        <div className="font-bold mb-[16px]">Get Payment Details Request (/payment)</div>
                        <pre className="bg-black p-[24px] rounded-[16px] mb-[24px] whitespace-pre-wrap w-full">
                            <code className="text-[#C9F73A] text-[14px] break-all">
                                {JSON.stringify(payloadContext?.payload.paymentDetailsRes, null, 2)}
                            </code>
                        </pre>
                    </>
                } 

            </div>
        </div>

    )
}


function CustomerSection() {

    const checkoutDetailsContext = useContext(CheckoutDetailsContext)

    return (
        <div>
            <div>Customer Name: {checkoutDetailsContext?.customer.fullName}</div>
            <div>Customer Email: {checkoutDetailsContext?.customer.email}</div>
            <div>Customer Phone: {checkoutDetailsContext?.customer.phone}</div>
        </div>
    )
}


function AddressSection() {

    const checkoutDetailsContext = useContext(CheckoutDetailsContext)

    return (
        <div>
            <div>Address Line 1: {checkoutDetailsContext?.customer.shipping_address?.addr_line_1}</div>
            <div>Address Line 2: {checkoutDetailsContext?.customer.shipping_address?.addr_line_2}</div>
            <div>City: {checkoutDetailsContext?.customer.shipping_address?.city}</div>
            <div>State: {checkoutDetailsContext?.customer.shipping_address?.state}</div>
            <div>Country: {checkoutDetailsContext?.customer.shipping_address?.country}</div>
            <div>Zipcode: {checkoutDetailsContext?.customer.shipping_address?.zip}</div>
        </div>
    )
}