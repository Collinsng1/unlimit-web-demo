import { useContext, useRef, useState } from "react";
import Button from "../components/Button";
import { IPaymentRequest } from "../models/UnlimitAPIModel";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { useNavigate } from "react-router-dom";
import { getAccessToken, requestPayment } from "../services/UnlimitService";
import { PayloadContext } from "../context/PayloadContext";
import { SettingsContext } from "../context/SettingContext";
import { v4 as uuidv4 } from 'uuid';


export default function AlipayComponent () {

    const checkoutContext = useContext(CheckoutDetailsContext)
    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)

    const [isPaymentPageOpen, setIsPaymentPageOpen] = useState<boolean>(false)
    const [redirectUrl, setRedirectUrl] = useState<string>("")
  
    const navigate = useNavigate()
  
    const iframeRef = useRef<HTMLIFrameElement>(null)

    async function process () {

        const accessToken = await getAccessToken(settingContext!.env.terminal, settingContext!.env.password)

        const paymentRequest: IPaymentRequest = {
            request: {
              id: uuidv4(),
              time: new Date().toISOString()
            },
            merchant_order: checkoutContext!.merchantOrder,
            payment_method: "ALIPAYPLUS",
            payment_data: settingContext!.paymentData,
            customer: checkoutContext!.customer,
            return_urls: settingContext?.returnURLs,
          }


    const paymentRes = await requestPayment(accessToken, paymentRequest)

    payloadContext?.setPayload({ paymentReq: paymentRequest, paymentRes: paymentRes })

    setRedirectUrl(paymentRes.redirect_url)
    setIsPaymentPageOpen(true)

    window.addEventListener('message', function (data) {
      if (data.data.name === "unlimit store" && data.data.redirect) {
        navigate(`/status?id=${checkoutContext!.merchantOrder.id}`)
      }
    });

    iframeRef.current!.contentWindow!.document.forms[0].onsubmit = function (event) {
        console.log("???")
      event.preventDefault();
    };
    }    
    
    
    return (
       <>
        {isPaymentPageOpen &&
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-[16px] lg:p-0" onClick={() => {console.log(iframeRef.current!.contentWindow!.document.forms)}}>
              <iframe className="w-full h-full lg:h-[75vh] lg:w-[75vw] rounded-[16px] bg-white" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" ref={iframeRef} src={redirectUrl} />
            </div>
          }
        <Button title="Process Checkout" onClick={() => {process ()}}/>
       </>
    )
}