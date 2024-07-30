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
                className="border px-[16px] rounded-lg h-[56px] mb-[12px] "
                type={props.type}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}