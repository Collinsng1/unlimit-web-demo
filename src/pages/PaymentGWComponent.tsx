import { useContext, useState } from "react";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from 'react-payment-inputs/images';
import {  getAccessToken, requestPayment } from "../services/UnlimitService";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { PayloadContext } from "../context/PayloadContext";
import { SettingsContext } from "../context/SettingContext";
import {  IPaymentRequest } from "../models/UnlimitAPIModel";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { convertDate } from "../utils";

export default function PaymentGWComponent() {

    const checkoutContext = useContext(CheckoutDetailsContext)
    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)

    const {
        meta,
        wrapperProps,
        getCardImageProps,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps
    } = usePaymentInputs();

    const [cardNumber, setCardNumber] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCVV] = useState("")
    const [is3DSPageOpen, setIs3DSPageOpen] = useState<boolean>(false)
    const [redirectUrl, setRedirectUrl] = useState<string>("")

    const navigate = useNavigate()

    async function process() {

        if (meta.error) {
            return
        }

        const accessToken = await getAccessToken(settingContext!.env.terminal, settingContext!.env.password)

        const paymentReq: IPaymentRequest = {
            request: {
                id: uuidv4(),
                time: new Date().toISOString()
            },
            merchant_order: checkoutContext!.merchantOrder,
            payment_method: "BANKCARD",
            payment_data: settingContext!.paymentData,
            customer: checkoutContext!.customer,
            card_account: {
                card: {
                    pan: cardNumber,
                    holder: checkoutContext!.customer.fullName!,
                    expiration: convertDate(expiryDate),
                    security_code: cvv
                }
            },
            return_urls: settingContext!.returnURLs
        }

        const paymentRes = await requestPayment(accessToken,paymentReq )


        setRedirectUrl(paymentRes.redirect_url)
        setIs3DSPageOpen(true)

        window.addEventListener('message', async function (data) {
            if (data.data.name === "unlimit store" && data.data.redirect) {
                navigate(`/status?id=${checkoutContext!.merchantOrder.id}`)
            }
        });

        payloadContext?.setPayload(prev => ({ ...prev, paymentReq: paymentReq, paymentRes: paymentRes }))
    }


    return (
        <div>
            {is3DSPageOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <iframe className="h-[75vh] w-[75vw] rounded-[16px]" src={redirectUrl} />
                </div>
            }
            <PaymentInputsWrapper {...wrapperProps}>
                <svg {...getCardImageProps({ ...images })} />
                <input {...getCardNumberProps({ onChange: (e) => { setCardNumber(e.target.value) } })} value={cardNumber} />
                <input {...getExpiryDateProps({ onChange: (e) => { setExpiryDate(e.target.value) } })} value={expiryDate} />
                <input {...getCVCProps({ onChange: (e) => { setCVV(e.target.value) } })} value={cvv} />
            </PaymentInputsWrapper>
            <div className="w-full h-[64px] flex flex-row bg-yellow-400 rounded-[16px] justify-center items-center" onClick={() => { process() }}>
                <div className="font-bold text-[16px]">Process Checkout</div>
            </div>
        </div>
    )
}

