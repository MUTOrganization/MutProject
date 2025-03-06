import { Avatar } from "@nextui-org/react";
import { getProfileColor, getUserName } from "../../utils/util";

export default function UserProfileAvatar({ name, imageURL, className, size = 'md' }) {
    return (
        <Avatar className={className} name={getUserName(name)} size={size} src={imageURL}
            style={{ backgroundColor: getProfileColor(name), color: 'white' }}
        />
    )
}