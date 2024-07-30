import { useContext, useRef, useState } from "react";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from 'react-payment-inputs/images';
import { getAccessToken, requestPayment, updatePayment } from "../services/UnlimitService";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { PayloadContext } from "../context/PayloadContext";
import { SettingsContext } from "../context/SettingContext";
import { IBrowserInfo, IPaymentRequest, UpdatePaymentReq } from "../models/UnlimitAPIModel";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { convertDate } from "../utils";

export default function PaymentS2SComponent() {

    //  Context
    const checkoutContext = useContext(CheckoutDetailsContext)
    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)

    // State
    const [cardNumber, setCardNumber] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCVV] = useState("")
    const [is3DSPageOpen, setIs3DSPageOpen] = useState<boolean>(false)

    //  Hooks
    const {
        meta,
        wrapperProps,
        getCardImageProps,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps
    } = usePaymentInputs();
    const navigate = useNavigate()
    const iframeRef = useRef<HTMLIFrameElement>(null);

    //  Func
    async function process() {

        if (meta.error) return

        //  Step 1: Request Access Token (Server Side)
        const accessToken = await getAccessToken(settingContext!.env.terminal, settingContext!.env.password)

        //  Step 2: Collect Client Browser Details (Clinet Side)
        const browserInfo: IBrowserInfo = {
            color_depth: window.screen.colorDepth,
            screen_height: window.screen.height,
            screen_width: window.screen.width,
            java_enabled: navigator.javaEnabled(),
            java_script_enabled: typeof window === 'object',
            language: navigator.language,
            time_zone: new Date().getTimezoneOffset(),
            accept_header: '*/*'
        }

        //  Step 3: Request Payment (Server Side)
        const paymentReq: IPaymentRequest = {
            request: {
                id: uuidv4(),
                time: new Date().toISOString()
            },
            merchant_order: checkoutContext!.merchantOrder,
            payment_method: "BANKCARD",
            payment_data: settingContext!.paymentData,
            customer: {
                ...checkoutContext!.customer,
                ip: "127.0.0.1",
                user_agent: navigator.userAgent,
                browser_info: browserInfo
            },
            card_account: {
                card: {
                    pan: cardNumber,
                    holder: checkoutContext!.customer.fullName!,
                    expiration: convertDate(expiryDate),
                    security_code: cvv
                }
            },
            return_urls: {
                ...settingContext!.returnURLs,
                //  Step 5: Redirect User to Callback Page with CRes (Client Side)
                return_url: "https://us-central1-unlimt-demo.cloudfunctions.net/api/3ds_redirect"
            }
        }

        const paymentRes = await requestPayment(accessToken, paymentReq)

        // Step 4: Post CReq to ACS within a iFrames (Client Side)
        setIs3DSPageOpen(true)

        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(paymentRes, '*');
        }

        //  Step 6: Setup Callback (Client Side)
        window.addEventListener('message', async (data: MessageEvent) => {
            if (data.data.name !== "unlimit store" || !data.data.redirect) return

            //  Step 7: Update the payment with CRes (Server Side)
            if (data.data.cres) {
                const updatePaymentReq: UpdatePaymentReq = {
                    request: {
                        id: uuidv4(),
                        time: new Date().toISOString()
                    },
                    operation: "CONFIRM_3DS",
                    CRes: data.data.cres
                }

                await updatePayment(accessToken, paymentRes.id, updatePaymentReq)
            }
            // Step 8: Complete Entire Payment Process (Both Side)
            navigate(`/status?id=${checkoutContext!.merchantOrder.id}`)
        });

        payloadContext?.setPayload(prev => ({ ...prev, paymentReq: paymentReq, paymentRes: paymentRes }))
    }

    return (
        <div>
            <div className={`${is3DSPageOpen ? "fixed" : "hidden"} inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
                <iframe className="h-[75vh] w-[75vw] rounded-[16px]" ref={iframeRef} src={"https://unlimt-demo.web.app/3ds"} />
            </div>
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

