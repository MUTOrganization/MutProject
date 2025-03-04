import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { toastError } from "../../../../../component/Alert";
import { Button, Card, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { formatDateThaiAndTime } from "../../../../../component/DateUtiils";
import SearchBox from "../../../../../component/SearchBox";
import { EditIcon } from "../../../../../component/Icons";
import SettingPenaltyModal from "../components/settingPenaltyModal";


function SettingManagePenalty() {
    //state list data
    const [listDataAgentPenalty, setListDataAgentPenalty] = useState([]);
    const [searchAgentData, setSearchAgentData] = useState([])

    //state loading
    const [loading, setLoading] = useState(false);

    //state modal
    const [modalSettingPenalty, setModalSettingPenalty] = useState({ state: false, data: null, isSettingAll: false });

    const fetchGetAgentPenalty = async () => {
        setLoading(true);
        await fetchProtectedData.get(URLS.settingPenalty.getAllAgentPenalty)
            .then(response => {
                const data = response.data;
                setSearchAgentData(data)
                setListDataAgentPenalty(data);
                setLoading(false);
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'โปรดลองใหม่อีกครั้ง')
            }).finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchGetAgentPenalty();
    }, [])

    function handleBeforeSearch(copyData) {
        return copyData;
    }

    function handleSearchResult(result) {
        console.log(result)
        setSearchAgentData(result);
    }


    return (
        <div className="w-full">

            {modalSettingPenalty.data &&
                <SettingPenaltyModal
                    open={modalSettingPenalty.state}
                    data={modalSettingPenalty.data}
                    isSettingAll={modalSettingPenalty.isSettingAll}
                    close={e => setModalSettingPenalty({ state: e, data: null })}
                    isFetchData={e => e && fetchGetAgentPenalty()}
                />
            }

            <h1 className="font-bold">ตั้งค่า ค่าปรับแต่ละตัวแทน</h1>
            <div className="w-full flex justify-between space-x-4">
                <div className="max-w-xs my-4">
                    <SearchBox
                        className={'max-w-xs'}
                        data={listDataAgentPenalty}
                        variant="bordered"
                        placeholder="ค้นหาตัวแทน"
                        searchRules={[['name', 10], ['code', 10], ['id', 10]]}
                        onChange={handleSearchResult}
                        onBeforeSearch={handleBeforeSearch}
                    />
                </div>
                <Button
                    onPress={() => setModalSettingPenalty({ state: true, data: listDataAgentPenalty, isSettingAll: true })}
                    size="md"
                    color="success"
                    className="text-white"
                    variant="solid">ตั้งค่าให้กับตัวแทนทุกตัวแทน</Button>
            </div>
            <Card className="mt-5" shadow="sm">
                <Table className="max-h-[500px] overflow-auto scrollbar-hide" selectionMode="single" selectionBehavior="toggle" color="primary" aria-label="table data" removeWrapper isHeaderSticky>
                    <TableHeader>
                        <TableColumn key={'id'}>ID</TableColumn>
                        <TableColumn key={'code'}>CODE</TableColumn>
                        <TableColumn key={'name'}>ชื่อตัวแทน</TableColumn>
                        <TableColumn key={'fineSetting'}>ค่าปรับ</TableColumn>
                        <TableColumn key={'updateBy'}>อัพเดตล่าโดย</TableColumn>
                        <TableColumn key={'updateDate'}>อัพเดตล่าสุดเมื่อ</TableColumn>
                        <TableColumn key={'action'}>Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={loading}
                        emptyContent='ไม่พบข้อมูล'
                        loadingContent={<Spinner
                            size="lg"
                            color="primary" />}>
                        {searchAgentData.map(item => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.fineSetting || 'ไม่มีการตั้งค่า'}</TableCell>
                                    <TableCell>{item.updateBy || 'ไม่มีการตั้งค่า'} </TableCell>
                                    <TableCell>{item.updateDate ? formatDateThaiAndTime(item.updateDate) : 'ไม่มี่การตั้งค่า'} </TableCell>
                                    <TableCell>
                                        <Button onPress={() => setModalSettingPenalty({ state: true, data: item, isSettingAll: false })} endContent={<EditIcon />} size='sm' variant="light" color="primary">แก้ไขค่าปรับ</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default SettingManagePenalty