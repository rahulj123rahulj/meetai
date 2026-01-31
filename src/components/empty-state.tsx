import Image from "next/image";

interface Props {
    title: string,
    description: string
}

export const EmptyState = ({title, description}: Props) =>{

    return <>
    <div className="flex flex-col items-center justify-center">
            <Image src={"/empty.svg"} width={240} height={240} alt="empty" />
            <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center text-muted-foreground">
            <h6 className="text-lg font-medium">{title}</h6>
            <p className="text-sm ">{description}</p>
            </div>
    </div>
    </>

}