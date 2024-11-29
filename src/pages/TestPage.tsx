/* eslint-disable @typescript-eslint/no-explicit-any */

import ApplePayButton from "apple-pay-button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare let ApplePaySession: any

export default function TestPage () {

    function onApplePayButtonClicked() {

        if (!ApplePaySession) {
            return;
        }

        // Define ApplePayPaymentRequest
        const request = {
            "countryCode": "HK",
            "currencyCode": "HKD",
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
                "amount": 1
            }
        };


        // Create ApplePaySession
        const session = new ApplePaySession(3, request);

        session.onvalidatemerchant = async (event: any) => {
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

            console.log(btoa(JSON.stringify(event.payment)))

            const result = {
                "status": ApplePaySession.STATUS_SUCCESS
            };
            session.completePayment(result);
        };

        session.begin();
    }

    return <>
        <div>
        <ApplePayButton
                onClick={onApplePayButtonClicked}
                style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '8px',
                }}
                type="pay"
            />
        </div>
    </>
}