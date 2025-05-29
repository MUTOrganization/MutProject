import { Spinner } from "@heroui/react";
import { useChatContext } from "../../ChatContext"
import UserProfile from "@/component/UserProfile";
import { ChevronsRight } from "lucide-react";


export default function PrivateChatTab({selectedUser, onSelectUser = () => {}}){
    const { userList, isUserListLoading } = useChatContext();
    return (
        <div className=" w-full relative">
            {
                userList.length === 0 && !isUserListLoading ? (
                    <div>
                        ไม่มีข้อมูลผู้ใช้อื่น
                    </div>
                )
                : (
                    <div className="w-full flex flex-col gap-2 overflow-y-auto max-h-[520px]">
                        {
                            userList.map((user) => {
                                return(
                                    <div key={user.username} 
                                        className={`w-full flex flex-row justify-between rounded-lg p-1 px-2 items-center transition-all duration-200
                                            cursor-pointer ${selectedUser?.username === user.username ? 'bg-primary-100' : 'hover:bg-primary-50'}`}
                                        onClick={() => onSelectUser(user)}
                                    >
                                        <UserProfile user={user} />
                                        {
                                            selectedUser?.username === user.username && (
                                                <div className="flex items-center text-primary-500">
                                                    <ChevronsRight/>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )


            }
            {
                (isUserListLoading) && (
                    <div className="w-full flex justify-center items-center py-8 absolute top-0 left-0">
                        <Spinner />
                    </div>
                )
            }
        </div>
    )
}