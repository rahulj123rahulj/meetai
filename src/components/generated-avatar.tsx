import {createAvatar} from "@dicebear/core"
import {avataaarsNeutral, initials} from "@dicebear/collection"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { cn } from "@/lib/utils"
interface GeneratedAvatarProps {
    seed: string
    className?: string
    variant: "avataaarsNeutral" | "initials"
}

export const GeneratedAvatar = ({ seed, className, variant }: GeneratedAvatarProps) => {
    const avatar = variant === "avataaarsNeutral" ? createAvatar(avataaarsNeutral, { seed }) : createAvatar(initials, { seed, fontWeight:500, fontSize: 42 })
    return <Avatar className={cn(className)}>
        <AvatarImage src={avatar.toDataUri()} />
        <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
}