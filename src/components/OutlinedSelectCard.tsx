interface Props {
    name: string
    imgUrl: string | undefined
    value: string
    groupValue: string
    onChnage: (value: string) => void
}


export function OutlinedSelectCard(props: Props) {
    return (
        <div
            className={`h-[96px] w-full flex flex-row p-[16px] items-center rounded-[16px] cursor-pointer border ${props.value === props.groupValue ? "border-yellow-500 bg-yellow-50 border-[2px]" : ""} `}
            onClick={() => { props.onChnage(props.value) }}
        >
            <img className="aspect-square h-[40px] mr-[16px]" src={props.imgUrl} alt={`${props.name}-logo`} />
            <div className="font-bold text-[14px]">{props.name}</div>
        </div>
    )
}