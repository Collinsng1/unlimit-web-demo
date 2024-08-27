/* eslint-disable @typescript-eslint/no-explicit-any */
import ApplePayButton from "apple-pay-button";
import { useContext, useState } from "react";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { PayloadContext } from "../context/PayloadContext";
import { SettingsContext } from "../context/SettingContext";
import { useNavigate } from "react-router-dom";
import { getAccessToken, requestPayment } from "../services/UnlimitService";
import { IPaymentRequest } from "../models/UnlimitAPIModel";
import { v4 as uuidv4 } from 'uuid';

export declare let ApplePaySession: any

export default function ApplePayComponent() {

    //  Context
    const checkoutContext = useContext(CheckoutDetailsContext)
    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)

    //  State
    const [is3DSPageOpen, setIs3DSPageOpen] = useState<boolean>(false)
    const [redirectUrl, setRedirectUrl] = useState<string>("")

    //  Hooks
    const navigate = useNavigate()

    function onApplePayButtonClicked() {

        if (!ApplePaySession) {
            return;
        }

        // Define ApplePayPaymentRequest
        const request = {
            "countryCode": "HK",
            "currencyCode": settingContext?.paymentData.currency,
            "merchantCapabilities": [
                "supports3DS"
            ],
            "supportedNetworks": [
                "visa",
                "masterCard",
                "amex",
                "discover"
            ],
            "total": {
                "label": "Unlimit T-Shirt",
                "type": "final",
                "amount": settingContext?.paymentData.amount
            }
        };

        payloadContext?.setPayload((prev) => ({ ...prev, tokenReq: request }))

        // Create ApplePaySession
        const session = new ApplePaySession(3, request);

        session.onvalidatemerchant = async (event: any) => {
            // const api = window.location.hostname
            const merchantSession = await fetch(`https://us-central1-unlimt-demo.cloudfunctions.net/api/applepay-payment-session`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "url": event.validationURL })
            })
            const temp = await merchantSession.json()
            session.completeMerchantValidation(temp);
        };

        session.onpaymentauthorized = async (event: any) => {

            payloadContext?.setPayload((prev) => ({ ...prev, tokenRes: event.payment }))
            await process(btoa(JSON.stringify(event.payment)))

            const result = {
                "status": ApplePaySession.STATUS_SUCCESS
            };
            session.completePayment(result);
        };

        session.begin();
    }

    async function process(token: string) {

        const accessToken = await getAccessToken(settingContext!.env.terminal, settingContext!.env.password)

        const paymentRequest: IPaymentRequest = {
            request: {
                id: uuidv4(),
                time: new Date().toISOString()
            },
            merchant_order: checkoutContext!.merchantOrder,
            payment_method: "APPLEPAY",
            payment_data: { ...settingContext!.paymentData, encrypted_data: token },
            customer: checkoutContext!.customer,
            return_urls: settingContext!.returnURLs
        }

        const paymentRes = await requestPayment(accessToken, paymentRequest)

        setRedirectUrl(paymentRes.redirect_url)
        setIs3DSPageOpen(true)

        window.addEventListener('message', function (data) {
            if (data.data.name === "unlimit store" && data.data.redirect) {
                navigate(`/status?id=${checkoutContext!.merchantOrder.id}`)
            }
        });

        payloadContext?.setPayload(prev => ({ ...prev, paymentReq: paymentRequest, paymentRes: paymentRes }))
    }

    return (
        <>
            {is3DSPageOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <iframe className="h-[75vh] w-[75vw] rounded-[16px]" src={redirectUrl} />
                </div>
            }
            <ApplePayButton
                onClick={onApplePayButtonClicked}
                style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '8px',
                }}
                type="pay"
            />
        </>
    )
}