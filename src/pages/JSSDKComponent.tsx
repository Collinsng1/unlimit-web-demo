import { useContext, useEffect, useRef } from "react";
import { CheckoutDetailsContext } from "../context/CheckoutDetailsContext";
import { SettingsContext } from "../context/SettingContext";
import { useNavigate } from "react-router-dom";
import { PayloadContext } from "../context/PayloadContext";
import { v4 as uuidv4 } from 'uuid';

export default function JSSDKComponent() {

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate()

  const checkoutContext = useContext(CheckoutDetailsContext)
  const settingContext = useContext(SettingsContext)
  const payloadContext = useContext(PayloadContext)

  useEffect(() => {

    const props = {
      urls: {
        generateMobileToken: 'https://us-central1-unlimt-demo.cloudfunctions.net/api/mobile-token',
        payment: 'https://sandbox.cardpay.com/api/mobile/payment',
      },
      enableRedirect: true,
      data: {
        merchantOrder: checkoutContext?.merchantOrder,
        paymentMethod: "BANKCARD",
        paymentData: {
          ...settingContext?.paymentData,
          generateToken: true
        },
        customer: checkoutContext?.customer, id: uuidv4(),
        returnUrls: {
          successUrl: "https://unlimt-demo.web.app/callback",
          declineUrl: "https://unlimt-demo.web.app/callback",
        },
      },
      customTexts: {
        submit: 'Confirm Payment',
        'card-number.label': 'Card Number',
        'cardholder.label': 'Cardholder Name',
        'expiry-date.label': 'Expiry Date',
        'cvv2-cvc2.label': 'CVV',
      },
      styles: {
        'body': {
          'margin': '0px !important'
        },
        '.unl-js-sdk_form': {
          'width': 'auto !important',
          'border-radius': '0px',
          'box-shadow': 'none !important'
        },
        '.unl-js-sdk_form__title': {
          'display': "none !important"
        },
        '.unl-js-sdk_form__total': {
          'display': "none !important"
        },
        '.unl-js-sdk_form__order': {
          'display': "none !important"
        },
        '.unl-js-sdk_form__footer': {
          'display': "none !important"
        },
        '.unl-js-sdk_form__body': {
          'padding': '0px !important',
          form: {
            display: 'flex !important',
            'flex-wrap': 'wrap !important',
            'column-gap': '8px !important',
          },
        },
        '.unl-js-sdk_form__input' : {
          'margin-bottom' : 'unset !important'
        },
        '.unl-js-sdk_form__input:nth-child(1)': {
          flex: '1 1 100% !important',
        },
        '.unl-js-sdk_form__input:nth-child(2)': {
          flex: '1 !important',
        },
        '.unl-js-sdk_form__input:nth-child(3)': {
          flex: '1 !important',
        },
        '.unl-js-sdk_input-text__error' : {
          'min-height' : '4px !important'
        },
        'unlimint-ui-form-button': {
          flex: '1 1 100%',
        },
        '.unl-js-sdk_form-button': {
          'height': '64px !important',
          'background-color': '#C9F73A !important',
          'color': '#000 !important',
          'width': '100% !important',
          'border-radius': '12px !important'
        },
        '.unl-js-sdk_input-text__control': {
          'border-radius': '12px !important',
          'border-width': '1px !important',
          'border-color': '#E2E8F0 !important'
        },
        '.unl-js-sdk_checkbox' : {
          'display' : 'none !important'
        },
        settings: {
          cardholder: {
            required: false,
          },
        },
      }
    }

    payloadContext?.setPayload({ paymentReq: props })

    iframeRef!.current!.addEventListener('load', function () {
      iframeRef!.current!.contentWindow!.postMessage({ props }, '*');
    });

    const eventHandler = (data: MessageEvent) => {
      if (data.data.name === "unlimit store" && data.data.redirect) {
        navigate(`/status?id=${checkoutContext?.merchantOrder.id}`)
      }
    }

    window.addEventListener('message', eventHandler);

    return () => {
      window.removeEventListener('message', eventHandler);
    }

  }, [])

  return (
    <iframe ref={iframeRef} style={{ height: '540px', width: '100%', border: 'none' }} src="https://sandbox.cardpay.com/js-sdk-frame/#/pay-form"></iframe>
  )
}
