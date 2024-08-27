import { IPaymentRequest, UpdatePaymentReq } from "../models/UnlimitAPIModel";
import { v4 as uuidv4 } from 'uuid';

export async function getAccessToken(terminalCode: string, password: string) {

    const body = new URLSearchParams();

    body.append("grant_type", "password")
    body.append("terminal_code", terminalCode)
    body.append("password", password)

    const accessTokenRes = await fetch("https://us-central1-unlimt-demo.cloudfunctions.net/api/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url : "https://sandbox.cardpay.com/api/auth/token",
            method: "POST",
            contentType: 'application/x-www-form-urlencoded',
            data: body.toString()
        })
    })

    const accessTokenData = await accessTokenRes.json()

    return accessTokenData["access_token"]

}

export async function getPaymentDetails (accessToken: string, merchant_order_id : string) {
    const query = new URLSearchParams();
    query.append("merchant_order_id", merchant_order_id)
    query.append("request_id", uuidv4())

    const paymentsRes = await fetch(`https://us-central1-unlimt-demo.cloudfunctions.net/api?${query.toString()}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + accessToken },
        body: JSON.stringify({
            url: "https://sandbox.cardpay.com/api/payments",
            method: "GET", 
        })
    })

    return await paymentsRes.json()
}

export async function requestPayment (accessToken : string, paymentReq : IPaymentRequest) {

    const paymentRequestRes = await fetch("https://us-central1-unlimt-demo.cloudfunctions.net/api/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' , 'Authorization': "Bearer " + accessToken },
        body: JSON.stringify({
            url : "https://sandbox.cardpay.com/api/payments",
            method: "POST",
            data: paymentReq
        })
    })

    return await paymentRequestRes.json()
}

export async function updatePayment(accessToken:string , payment_id : string, paymentUpdateReq : UpdatePaymentReq) {

    const paymentRequestRes = await fetch(`https://us-central1-unlimt-demo.cloudfunctions.net/api/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' , 'Authorization': "Bearer " + accessToken },
        body: JSON.stringify({
            url : `https://sandbox.cardpay.com/api/payments/${payment_id}`,
            method: "PATCH",
            data : paymentUpdateReq
        })
    })

    return await paymentRequestRes.json()
    
}