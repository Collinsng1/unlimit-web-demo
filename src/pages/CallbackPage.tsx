import { useEffect } from "react"

export function CallbackPage () {

    const queryParams = new URLSearchParams(location.search);
    
    useEffect(() => {

        const data = {name : "unlimit store", redirect : true, cres : queryParams.get('cres')}
        window.parent.postMessage(data, '*');
    })

    return <></>
}