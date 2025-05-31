import User from "@/models/user";
import UserProfileAvatar from "./UserProfileAvatar";

/**
 * 
 * @param {{user: User}} param0 
 */
export default function UserProfile({user}){
    return(
        <div className="w-full h-16 flex items-center">
            <div className="w-12 rounded-full me-2">
                <UserProfileAvatar name={user.name}/>
            </div>
            <div className="w-full flex flex-col">
                <span className="text-sm font-bold">{user.name}</span>
                <div className="flex flex-row items-center gap-1">
                    <span className="text-xs text-slate-500">{user.nickname}</span>
                    <span className="text-xs text-slate-500">({user.department.departmentName} - {user.role.roleName})</span>
                </div>
            </div>
        </div>
    )
}