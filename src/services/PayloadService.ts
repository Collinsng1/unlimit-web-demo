import { PayloadState } from "../context/PayloadContext"

export async function getPayload (merchantOrderId : string) {

    const paylaodRes = await fetch("https://us-central1-unlimt-demo.cloudfunctions.net/api/payloads/" + merchantOrderId, {
        method: "GET",
    })

    return await paylaodRes.json() as PayloadState
}

export async function uploadPayload (payload : PayloadState) {

    await fetch("https://us-central1-unlimt-demo.cloudfunctions.net/api/payloads", {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
}