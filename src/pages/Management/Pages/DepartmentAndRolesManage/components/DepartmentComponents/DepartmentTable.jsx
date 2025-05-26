import Department from "@/models/department";
import { sortArray } from "@/utils/arrayFunc";
import { formatDateThai } from "@/utils/dateUtils";
import { Button, Card, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Check, DeleteIcon, Edit, Plus } from "lucide-react";
import { useMemo } from "react";


/**
 * 
 * @param {{
 *  departmentList: Department[],
 *  selectedDepartment: string,
 *  onSelectDepartment: (departmentId: string) => void,
 *  isLoading: boolean,
 *  onAddClick: () => void,
 *  onEditClick: (id: Number) => void,
 *  onDeleteClick: (id: Number) => void,
 * }} param0 
 * @returns 
 */
export default function DepartmentTable({ 
    isUserFromHq, 
    departmentList, 
    selectedDepartmentId, 
    isLoading, 
    onSelectDepartment = () => {}, 
    onAddClick = () => {}, 
    onEditClick = () => {}, 
    onDeleteClick = () => {} 
}){
    const formattedDepartmentList = useMemo(() => {
        return sortArray([...departmentList], 'isHq', 'descending');
    }, [departmentList]);

    function handleSelectDepartment(departmentId){
        onSelectDepartment(Array.from(departmentId)[0]);
    }

    return(
        <Card shadow="sm" className="p-4 h-full">
            <Table 
                aria-label="department-table" 
                selectionMode="single" 
                disallowEmptySelection
                removeWrapper
                isHeaderSticky
                className="overflow-y-auto scrollbar-hide"
                selectedKeys={selectedDepartmentId ? [selectedDepartmentId] : []}
                onSelectionChange={handleSelectDepartment}
            >
                <TableHeader>
                    <TableColumn>
                        <span>ชื่อแผนก</span>
                    </TableColumn>
                    <TableColumn className="text-center">
                        <span>สร้างโดยสำนักงานใหญ่</span>
                    </TableColumn>
                    <TableColumn className="text-center">
                        <span>สร้างเมื่อ</span>
                    </TableColumn>
                    <TableColumn className="text-center">
                        <span>อัพเดตล่าสุดเมื่อ</span>
                    </TableColumn>
                    <TableColumn>
                        <div className="flex gap-2 justify-center">
                            <Button isIconOnly variant="light" color="success" size="sm" onPress={onAddClick}>
                                <Plus size={20} />
                            </Button>
                        </div>
                    </TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    loadingContent={<Spinner />}
                    emptyContent="ไม่พบข้อมูล"
                > 
                    {formattedDepartmentList.map((dep) => (
                        <TableRow key={dep.departmentId} className="h-14">
                            <TableCell className="font-bold">{dep.departmentName}</TableCell>
                            <TableCell className="text-center">{dep.isHq && <Chip size="sm" color="success" variant="flat"><Check size={16}/></Chip>}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 items-center text-sm">
                                    <p>{formatDateThai(dep.createdDate, 'date')}</p>
                                    <p className="text-gray-500">{formatDateThai(dep.createdDate, 'time')}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 items-center text-sm">
                                    <p>{formatDateThai(dep.updatedDate, 'date')}</p>
                                    <p className="text-gray-500">{formatDateThai(dep.updatedDate, 'time')}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                            {
                                (isUserFromHq || !dep.isHq) &&
                                <div className="flex gap-2 justify-center">
                                    <Button isIconOnly variant="light" color="warning" size="sm" onPress={() => onEditClick(dep.departmentId)}>
                                        <Edit size={16} />
                                    </Button>
                                    <Button isIconOnly variant="light" color="danger" size="sm" onPress={() => onDeleteClick(dep.departmentId)}>
                                        <DeleteIcon size={16} />
                                    </Button>
                                </div>
                            }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}