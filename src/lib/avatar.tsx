import { avataaarsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

interface Props {
    seed: string;
    variant: "avataaarsNeutral" | "initials";
}

export const generateAvatarUri = ({ seed, variant }: Props) => {
    let avatar;
    if (variant === "avataaarsNeutral") {
        avatar = createAvatar(avataaarsNeutral, { seed });
    } else {
        avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
    }
    return avatar.toDataUri();
};
