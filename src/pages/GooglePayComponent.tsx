import GooglePayButton from "@google-pay/button-react";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../context/SettingContext";
import { useNavigate } from "react-router-dom";
import { getAccessToken, requestPayment } from "../services/UnlimitService";
import { v4 as uuidv4 } from 'uuid';
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { PayloadContext } from "../context/PayloadContext";
import { IPaymentRequest } from "../models/UnlimitAPIModel";


export default function GooglePayComponent() {

    //  Context
    const checkoutContext = useContext(CheckoutDetailsContext)
    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)

    //  State
    const [paymentRequest, setPaymentRequest] = useState<google.payments.api.PaymentDataRequest | null>()
    const [is3DSPageOpen, setIs3DSPageOpen] = useState<boolean>(false)
    const [redirectUrl, setRedirectUrl] = useState<string>("")

    //  Hooks
    const navigate = useNavigate()

    useEffect(() => {
        const _paymentRequest: google.payments.api.PaymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'unlimint',
                            gatewayMerchantId: 'googletest',
                        },
                    },
                },
            ],
            merchantInfo: {
                merchantId: 'BCR2DN4TWDNJJX3V',
                merchantName: 'Collins',
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: settingContext!.paymentData.amount.toString(),
                currencyCode: settingContext!.paymentData.currency,
                countryCode: 'US',
            },
        }

        setPaymentRequest(_paymentRequest)

        payloadContext?.setPayload({tokenReq: _paymentRequest})
        
    }, [settingContext])

    async function process(token : string) {

        const accessToken = await getAccessToken(settingContext!.env.terminal, settingContext!.env.password)

        const paymentRequest : IPaymentRequest= {
            request: {
                id: uuidv4(),
                time: new Date().toISOString()
            },
            merchant_order: checkoutContext!.merchantOrder,
            payment_method: "GOOGLEPAY",
            payment_data: {...settingContext!.paymentData, encrypted_data: token},
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

        payloadContext?.setPayload(prev => ({...prev, paymentReq: paymentRequest, paymentRes: paymentRes}))
    }


    if (!paymentRequest) {
        return <></>
    }

    return (
        <>
            {is3DSPageOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <iframe className="h-[75vh] w-[75vw] rounded-[16px]" src={redirectUrl} />
                </div>
            }
            <GooglePayButton
                style={{ width: "100%" }}
                className="w-full h-[48px]"
                buttonSizeMode="fill"
                environment="TEST"
                paymentRequest={paymentRequest}
                onLoadPaymentData={paymentRequest => {
                    payloadContext?.setPayload(prev =>({...prev ,tokenRes: paymentRequest}) )
                    process(btoa(paymentRequest.paymentMethodData.tokenizationData.token))
                }}
            />
        </>
    )
}