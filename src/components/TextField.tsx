import { ChangeEventHandler, HTMLInputTypeAttribute } from "react"

interface Props {
    title: string
    type: HTMLInputTypeAttribute | undefined
    value : string | number | readonly string[] | undefined
    onChange : ChangeEventHandler<HTMLInputElement>  | undefined
}

export default function TextField(props: Props) {
    return (
        <div className="flex flex-col">
            <div className="text-[12px] mb-[4px]">{props.title}</div>
            <input
                className="px-[16px] rounded-lg h-[48px] mb-[12px] outline-none border border-gray-200 bg-gray-50"
                type={props.type}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}