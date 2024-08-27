
interface Props {
    title : string
    onClick : () => void
}


export default function Button(props : Props) {
    return (
        <div className="w-full h-[64px] flex flex-row bg-yellow-400 rounded-[16px] justify-center items-center cursor-pointer" onClick={props.onClick}>
            <div className="font-bold text-[16px]">{props.title}</div>
        </div>
    )
}