import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { SettingsContext } from "../context/SettingContext";
import { getAccessToken, requestPayment } from "../services/UnlimitService";
import { v4 as uuidv4 } from 'uuid';
import { PayloadContext } from "../context/PayloadContext";
import { IPaymentRequest } from "../models/UnlimitAPIModel";

export default function PaymentPageComponent() {

    const checkoutContext = useContext(CheckoutDetailsContext)
    const settingContext = useContext(SettingsContext)
    const payloadContext = useContext(PayloadContext)
  
    const [isPaymentPageOpen, setIsPaymentPageOpen] = useState<boolean>(false)
    const [redirectUrl, setRedirectUrl] = useState<string>("")
  
    const navigate = useNavigate()
  
    const iframeRef = useRef<HTMLIFrameElement>(null)
  
    async function process() {
  
      const accessToken = await getAccessToken(settingContext!.env.terminal, settingContext!.env.password)
  
      const paymentRequest : IPaymentRequest = {
        request: {
          id: uuidv4(),
          time: new Date().toISOString()
        },
        merchant_order: checkoutContext!.merchantOrder,
        payment_method: "BANKCARD",
        payment_data: settingContext!.paymentData,
        customer: checkoutContext!.customer,
        return_urls: settingContext?.returnURLs,
      }
  
      const paymentRes = await requestPayment(accessToken, paymentRequest)

      payloadContext?.setPayload({paymentReq: paymentRequest, paymentRes: paymentRes })
  
      setRedirectUrl(paymentRes.redirect_url)
      setIsPaymentPageOpen(true)
  
      window.addEventListener('message', function (data) {
        if (data.data.name === "unlimit store" && data.data.redirect) {
          navigate(`/status?id=${checkoutContext!.merchantOrder.id}`)
        }
      });
  
      iframeRef.current!.contentWindow!.document.forms[0].onsubmit = function (event) {
        event.preventDefault();
      };  
    }
  
    return (
      <div>
        {isPaymentPageOpen &&
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-[16px] lg:p-0">
            <iframe className="w-full h-full lg:h-[75vh] lg:w-[75vw] rounded-[16px] bg-white" ref={iframeRef} src={redirectUrl} />
          </div>
        }
        <div className="w-full h-[64px] flex flex-row bg-yellow-400 rounded-[16px] justify-center items-center" onClick={() => { process() }}>
          <div className="font-bold text-[16px]">Process Checkout</div>
        </div>
      </div>
  
    )
  
  }