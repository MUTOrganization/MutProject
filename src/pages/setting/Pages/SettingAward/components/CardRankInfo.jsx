import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { URLS } from "../../../../../config";
import { find } from "lodash";
import { DeleteIcon, EditIcon } from "@/component/Icons";
import { DeleteMedal, EditMedal } from "./ModalCRUDMedal";
import { useState } from "react";
import ModalSettingAwards from "./ModalSettingAwards";

function getRankTextColor(rank) {
    switch (rank.toLowerCase()) {
        case "bronze":
            return "text-orange-500"; // สีทองแดง
        case "silver":
            return "text-gray-400"; // สีเงิน
        case "gold":
            return "text-yellow-500"; // สีทอง
        case "platinum":
            return "text-teal-400"; // สีแพลทินัม
        case "emerald":
            return "text-green-500"; // สีเขียวมรกต
        case "diamond":
            return "text-blue-500"; // สีไดมอนด์
        default:
            return "text-black"; // สีเริ่มต้น
    }
}

function getRankBGColor(rank) {
    switch (rank.toLowerCase()) {
        case "bronze":
            return "bg-orange-500/20"; // สีทองแดง
        case "silver":
            return "bg-gray-400/20"; // สีเงิน
        case "gold":
            return "bg-yellow-500/20"; // สีทอง
        case "platinum":
            return "bg-teal-400/20"; // สีแพลทินัม
        case "emerald":
            return "bg-green-500/20"; // สีเขียวมรกต
        case "diamond":
            return "bg-blue-500/20"; // สีไดมอนด์
        default:
            return "bg-black/20"; // สีเริ่มต้น
    }
}

function getHorverRank(rank) {
    switch (rank.toLowerCase()) {
        case "bronze":
            return "hover:bg-orange-500/10"; // สีทองแดง
        case "silver":
            return "hover:bg-gray-400/10"; // สีเงิน
        case "gold":
            return "hover:bg-yellow-500/10"; // สีทอง
        case "platinum":
            return "hover:bg-teal-400/10"; // สีแพลทินัม
        case "emerald":
            return "hover:bg-green-500/10"; // สีเขียวมรกต
        case "diamond":
            return "hover:bg-blue-500/10"; // สีไดมอนด์
        default:
            return "hover:bg-black/10"; // สีเริ่มต้น
    }
}

function CardRankInfo({ medalData, awardData, hasRefresh , selectedDep , listDepData , listMedalData , selectedYear }) {
    const [openModalDeleteAward, setOpenModalDeleteAward] = useState(false);
    const [openModalEditMedal, setOpenModalEditMedal] = useState(false);
    const [openModalSettingAwards, setOpenModalSettingAwards] = useState(false);
    const findAward = awardData.find(award => award.medalId == medalData.id);
    const listAward = findAward?.awards || [];


    return (
        <>
            <Card shadow="sm" aria-label="Card-Rank-Info" className={`w-56 h-[300px] ${getHorverRank(medalData.name)}`}>
                <CardHeader className="border-b">
                    {!medalData.image || medalData.image === '' ?
                        <div
                            className={`h-[150px] text-center flex justify-center w-full text-3xl  items-center font-bold 
                    ${getRankBGColor(medalData.name)} ${getRankTextColor(medalData.name)} rounded-lg`}>
                            <h1>{medalData.name}</h1>
                        </div>
                        :
                        <Image src={URLS.googleCloud.medal + medalData.image} height={150} width={300} className="object-fill" />
                    }
                </CardHeader>
                <CardBody>
                    <div className="h-full">
                        {listAward.length > 0 ? (
                            <div className="flex flex-col justify-between h-full">
                                <div className="max-h-[90px]  text-sm overflow-auto scrollbar-hide">
                                    <h1 className="font-bold">{listAward[0].awardTitle}</h1>
                                    <p>{listAward[0].awardDesc}</p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="underline text-primary cursor-pointer text-xs" onClick={() => setOpenModalSettingAwards(true)}>ตั้งค่าของรางวัล</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Button 
                                            isIconOnly 
                                            startContent={<EditIcon />} 
                                            className="text-lg" 
                                            variant="flat" 
                                            color="warning" 
                                            size="sm"
                                            onPress={() => setOpenModalEditMedal(true)}
                                        />
                                        <Button 
                                            isIconOnly 
                                            startContent={<DeleteIcon />} 
                                            onPress={() => setOpenModalDeleteAward(true)} 
                                            className="text-lg" 
                                            variant="flat" 
                                            color="danger" 
                                            size="sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-between h-full">
                                <div className="text-center">
                                    <h1 className="font-bold">ไม่พบข้อมูลรางวัล</h1>
                                    <p className="underline text-primary cursor-pointer" onClick={() => setOpenModalSettingAwards(true)}>ตั้งค่าของรางวัล</p>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Button 
                                        isIconOnly 
                                        startContent={<EditIcon />} 
                                        className="text-lg" 
                                        variant="flat" 
                                        color="warning" 
                                        size="sm"
                                        onPress={() => setOpenModalEditMedal(true)}
                                    />
                                    <Button 
                                        isIconOnly 
                                        startContent={<DeleteIcon />} 
                                        onPress={() => setOpenModalDeleteAward(true)} 
                                        className="text-lg" 
                                        variant="flat" 
                                        color="danger" 
                                        size="sm" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            <EditMedal 
                open={openModalEditMedal} 
                closed={() => setOpenModalEditMedal(false)} 
                medal={medalData}
                isRefresh={e => e && hasRefresh()}
            />

            <DeleteMedal 
                open={openModalDeleteAward} 
                closed={() => setOpenModalDeleteAward(false)} 
                medal={medalData} 
                isRefresh={e => e && hasRefresh()} 
            />

            <ModalSettingAwards 
                open={openModalSettingAwards} 
                closed={() => setOpenModalSettingAwards(false)} 
                selectedDepData={selectedDep} 
                listMedalData={listMedalData}
                listDepData={listDepData} 
                medalData={medalData} 
                awardData={awardData}
                isRefresh={hasRefresh}
                selectedYear={selectedYear}
            />
        </>

    );
}

export default CardRankInfo;