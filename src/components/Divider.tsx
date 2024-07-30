
interface Props {
    height? : string
}

export default function Divider (props : Props) {
    return (
        <div className={`w-full ${props.height ?? "my-[16px]"}  border`}/>
    )
}