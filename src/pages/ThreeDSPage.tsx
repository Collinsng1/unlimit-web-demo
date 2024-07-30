/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";


export default function ThreeDSPage() {

    const [message, setMessage] = useState<any>();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            setMessage(event.data)
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [message]);

    useEffect(() => {
        if (message && formRef.current) {
            formRef.current.submit();
        }
    }, [message]);


    if (!message) {
        return 
    }

    return (
        <div>
            <form ref={formRef} action={message.redirect_url} method="POST">
                <input type="hidden" id="creq" name="creq" value={message.CReq} />
            </form>
        </div>
    )
}