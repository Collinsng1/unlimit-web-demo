import { useEffect } from "react";
import { usePaymentInputs } from "react-payment-inputs";
import images from 'react-payment-inputs/images';


interface Props {
    cardNumber : string
    onCardNumberChange : (number : string) => void
    expiryDate : string
    onExpiryDateChange : (expiryDate : string) => void
    cvv : string
    onCVVChange : (cvv : string) => void
    onError? : (err : string | undefined) => void

}

export default function CardInput(props : Props) {

    const {
        meta,
        getCardImageProps,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps
    } = usePaymentInputs();

    useEffect(() => {
        if (props.onError) {
            props.onError(meta.error)
        }
    } , [meta.error])

    return (
        <div className="flex flex-col mb-[16px]">
            <div className="flex flex-row border rounded-[16px] h-[56px] overflow-hidden px-[16px]  items-center">
                <svg className="mr-[8px]" {...getCardImageProps({ images })} />
                <div className="flex flex-[3]">
                    <input className="w-full border-none outline-none  bg-transparent placeholder:text-[12px] text-[14px]"  {...getCardNumberProps({ onChange: (e) => { props.onCardNumberChange(e.target.value) } })} value={props.cardNumber} />
                </div>
                <div className="flex flex-1">
                    <input className="w-full border-none outline-none flex-1 bg-transparent placeholder:text-[12px] text-[14px]" {...getExpiryDateProps({ onChange: (e) => { props.onExpiryDateChange(e.target.value) } })} value={props.expiryDate} />
                </div>
                <div className="flex flex-1">
                    <input className="w-full border-none outline-none flex-1 bg-transparent placeholder:text-[12px] text-[14px]"  {...getCVCProps({ onChange: (e) => { props.onCVVChange(e.target.value) } })} value={props.cvv} />
                </div>
            </div>
            {meta.error && <div className="text-red-700 text-[12px]">{meta.error}</div>}
        </div>
    )
}