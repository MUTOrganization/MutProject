import User from "@/models/user";
import UserProfileAvatar from "./UserProfileAvatar";

/**
 * 
 * @param {{user: User}} param0 
 */
export default function UserProfile({user}){
    return(
        <div className="w-full h-16 flex items-center overflow-hidden text-ellipsis">
            <div className="w-12 rounded-full me-2">
                <UserProfileAvatar name={user.name} imageURL={user.displayImgUrl}/>
            </div>
            <div className="flex-1 flex flex-col">
                <span className="text-sm font-bold">{user.name}</span>
                <div className="flex flex-row items-center gap-1 w-full">
                    <span className="text-xs text-slate-500 text-nowrap">{user.nickname}</span>
                    <span className="text-xs text-slate-500 text-nowrap">({user.department.departmentName} - {user.role.roleName})</span>
                </div>
            </div>
        </div>
    )
}