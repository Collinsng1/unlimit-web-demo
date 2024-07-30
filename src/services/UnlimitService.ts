import { IPaymentRequest, UpdatePaymentReq } from "../models/UnlimitAPIModel";
import { v4 as uuidv4 } from 'uuid';

export async function getAccessToken(terminalCode: string, password: string) {

    const body = new URLSearchParams();

    body.append("grant_type", "password")
    body.append("terminal_code", terminalCode)
    body.append("password", password)

    const accessTokenRes = await fetch("https://us-central1-unlimt-demo.cloudfunctions.net/api/token", {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    })

    const accessTokenData = await accessTokenRes.json()

    return accessTokenData["accessToken"]

}

export async function getPaymentDetails (accessToken: string, merchant_order_id : string) {
    const query = new URLSearchParams();
    query.append("merchant_order_id", merchant_order_id)
    query.append("request_id", uuidv4())

    const paymentsRes = await fetch(`https://us-central1-unlimt-demo.cloudfunctions.net/api/payments?${query.toString()}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + accessToken },
    })

    return await paymentsRes.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestPayment (accessToken : string, paymentReq : IPaymentRequest) {

    const paymentRequestRes = await fetch("https://us-central1-unlimt-demo.cloudfunctions.net/api/payment", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' , 'Authorization': "Bearer " + accessToken },
        body: JSON.stringify(paymentReq)
    })

    return await paymentRequestRes.json()
}

export async function updatePayment(accessToken:string , payment_id : string, paymentUpdateReq : UpdatePaymentReq) {

    const paymentRequestRes = await fetch(`https://us-central1-unlimt-demo.cloudfunctions.net/api/payment/${payment_id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' , 'Authorization': "Bearer " + accessToken },
        body: JSON.stringify(paymentUpdateReq)
    })

    return await paymentRequestRes.json()
    
}