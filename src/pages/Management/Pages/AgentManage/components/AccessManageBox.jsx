import { useCallback, useEffect, useMemo, useState } from "react";
import lodash from 'lodash'
import { CopyIcon, HFDoubleArrowLeft, HFDoubleArrowRight, HFInfoFilled, HFRefresh, HFSync, InformationIcon } from "../../../../../component/Icons";
import SearchBox from "../../../../../component/SearchBox";
import { groupArray } from "../../../../../../utils/arrayFunc";
import { URLS } from "../../../../../config";
import { Button, Card, CardBody, CardHeader, Checkbox, CircularProgress, Modal, ModalBody, ModalContent, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { toastError } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { useAppContext } from "../../../../../contexts/AppContext";
import { ACCESS } from "../../../../../configs/accessids";
import CopyAccessModal from "./copyAccessModal";

export default function AccessManageBox({agent, mode, onSave, loadSubmit}){
    const [access, setAccess] = useState([]);
    const [rightAccess, setRightAccess] = useState([]);
    const [searchedRightAccess, setSearchedRightAccess] = useState([]);
    const [agentAccess, setAgentAccess] = useState([]);
    const [searchedAgentAccess, setSearchedAgentAccess] = useState([]);
    const [loadingAccess, setLoadingAccess] = useState(false);
    const [loadingAgentAccess, setLoadingAgentAccess] = useState(false);
    const [displayDes, setDisplayDes] = useState(null);
    const [selectedAccess, setSelectedAccess] = useState({side:'', list: []});
    const [newAddAccess,setNewAddAccess] = useState([]);
    const [newRemoveAccess,setNewRemoveAccess] = useState([]);

    const [search1Rerender, setSearch1Rerender] = useState(0); //for component Searchbox re render to reset text
    const [search2Rerender, setSearch2Rerender] = useState(0);

    const {accessCheck} = useAppContext()

    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    const displayAgentAccess = useMemo(() => {
        return searchedAgentAccess.filter(e => !(e.score <= 0));
    },[searchedAgentAccess])

    const displayRightAccess = useMemo(() => {
        return searchedRightAccess.filter(e => !(e.score <= 0));
    },[searchedRightAccess])

    const isDisable = useMemo(() => {
        return !accessCheck.haveAny(['FIX']);
    },[])

    useEffect(() => {
        setAgentAccess([]);
        clearSelection();
        if(mode == '0'){
            fetchAgentAccess();
        }
    },[mode])

    useEffect(() => {
        async function fetchAccess() {
            try{
                setLoadingAccess(true);
                const response = await fetchProtectedData.get(URLS.access.getAll);
                setAccess(response.data)   
            }catch(err){
                console.error('error fetching access');
                toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
            }finally{
                setLoadingAccess(false);
            }
        }
        fetchAccess()
    },[])

    useEffect(() => {
        setRightAccess(access.filter(e => !agentAccess.some(e1 => e1.id == e.id)));
    },[access])

    useEffect(() => {
        const copy = [...searchedAgentAccess];
        const copy2 = [...searchedRightAccess];
        const _agentAccess = lodash.cloneDeep(agentAccess);
        _agentAccess.forEach(aa => {
            const findAccess = copy.find(e => e.id == aa.id)
            if(findAccess){
                aa.score = findAccess.score
            }
        })
        setSearchedAgentAccess(_agentAccess);
        const _rightAccess = lodash.cloneDeep(access.filter(e => !agentAccess.some(e1 => e1.id == e.id)));
        setRightAccess(_rightAccess);
        _rightAccess.forEach(ra => {
            const findAccess = copy2.find(e => e.id == ra.id)
            if(findAccess){
                ra.score = findAccess.score;
            }
        })
        setSearchedRightAccess(_rightAccess);
    },[agentAccess])

    useEffect(() => {
        setSearch1Rerender(p => (p + 1) % 2)
        setSearch2Rerender(p => (p + 1) % 2)
        
        clearSelection();
        if(!agent) {
            setAgentAccess([]);
            return;
        }
        const controller = new AbortController();
        fetchAgentAccess(controller);

        return () => {
            controller.abort();
        }
    },[agent])


    const fetchAgentAccess = async (controller) => {
        if(!agent || access.length <= 0) return;
        try {
            setLoadingAgentAccess(true);
            const response = await fetchProtectedData.get(`${URLS.agent.getAgentAccess}/${agent.id}`,{signal: controller?.signal});
            if (response.status === 200) {
                const _agentAccess = access.filter(e => response.data.some(e1 => e1.accessCode === e.accessCode))
                setSearchedAgentAccess([]);
                setSearchedRightAccess([]);
                setAgentAccess(_agentAccess);
                setLoadingAgentAccess(false);
            } else {
                toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
            }
        } catch (err) {
            if(err.name === 'CanceledError'){
                return;
            }
            setLoadingAgentAccess(false);
            console.error('error fetching agent access');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        }
    };
    function clearSelectedAccess(){
        setSelectedAccess({side: '', list: []});
        setDisplayDes(null);
    }
    function handleSelectAccess(event,side,acc){
        
        if(side === selectedAccess.side){
            if(selectedAccess.list.find(e => e.id === acc.id)){
                const filered = selectedAccess.list.filter(e => e.id !== acc.id);
                setSelectedAccess({side, list: filered});
            }else{
                const tmp = [...selectedAccess.list,acc];
                setSelectedAccess({side, list: tmp});
            }
        }
        else{
            setSelectedAccess({side, list: [acc]});
        }
    }
    
    function handleAddAccess(){
        //หา access เฉพาะที่ไม่ได้กดลบ
        const notRemovedAccess = selectedAccess.list.filter(e1 => !newRemoveAccess.some(e2 => e1.id === e2.id));
        //หา access เฉพาะที่กดลบ
        const removedAccess = selectedAccess.list.filter(e1 => newRemoveAccess.some(e2 => e1.id === e2.id));

        //ลบ access ที่กดลบไป (ที่เป็นสีแดง)
        const a = newRemoveAccess.filter(e1 => !removedAccess.some(e2 => e1.id === e2.id));
        
        setAgentAccess(prev => [...selectedAccess.list, ...prev]);
        
        setNewRemoveAccess(a);
        //เพิ่ม access ที่เพิ่มใหม่
        setNewAddAccess(prev => [...prev, ...notRemovedAccess]);


        clearSelectedAccess();
    }
    function handleRemoveAccess(){
        //หา access เฉพาะที่ไม่ได้กดเพิ่ม
        const notAddedAccess = selectedAccess.list.filter(e1 => !newAddAccess.some(e2 => e1.id === e2.id))
        //หา access เฉพาะที่กดเพิ่ม
        const addedAccess = selectedAccess.list.filter(e1 => newAddAccess.some(e2 => e1.id === e2.id))

        //ลบ access ที่กดเพิ่มไป (ที่เป็นสีเขียว)
        const a = newAddAccess.filter(e1 => !addedAccess.some(e2 => e1.id === e2.id));
        setNewAddAccess(a)

        //เพิ่ม access ที่ลบใหม่
        setNewRemoveAccess(prev => [...prev, ...notAddedAccess]);
        
        
        const removedList = agentAccess.filter(e1 => !selectedAccess.list.some(e2 => e1.id === e2.id))
        setAgentAccess(removedList);
        clearSelectedAccess();
    }
    function clearSelection(){
        setNewAddAccess([]);
        setNewRemoveAccess([]);
        clearSelectedAccess();
    }
    function handleResetAccess(){
        clearSelection();
        fetchAgentAccess();
    }
    async function handleSubmit(){
        const isPass = await onSave(agentAccess);
        if(isPass){
            if(mode == '0'){
                fetchAgentAccess();
                clearSelection();
            }else{
                setAgentAccess([]);
                clearSelection();
            }
        }

    }

    function handleCopyAccess(_access){
        setAgentAccess(_access);
    }

    function handleSelectGroup(groupName, side){
        const _access = side === 'l' ? searchedAgentAccess : searchedRightAccess;
        const groupAccess = _access.filter(e => e.groupName === groupName);
        
        if(selectedAccess.side === side){
            if(checkAllAccessInGroupChecked(groupName, selectedAccess.list, _access)){
                setSelectedAccess({side, list: lodash.differenceBy(selectedAccess.list, groupAccess, 'id')});
            }else{
                setSelectedAccess({side, list: lodash.unionBy(groupAccess, selectedAccess.list, 'id')});
        }
        }else{
            setSelectedAccess({side, list: groupAccess});
        }
    }
    function hanldeSelectAll(side){
        const _access = side === 'l' ? searchedAgentAccess : searchedRightAccess;
        if(selectedAccess.side === side){
            if(checkAllAccessChecked(selectedAccess.list, _access)){
                setSelectedAccess({side, list: lodash.differenceBy(selectedAccess.list, _access, 'id')});
            }else{
                setSelectedAccess({side, list: lodash.unionBy(selectedAccess.list, _access, 'id')})
            }
        }else{
            setSelectedAccess({side, list: _access});
        }
    }
    const checkAllAccessInGroupChecked = useCallback((groupName, _selectedAccess, allAccess) => {
        const selectedIds = new Set(_selectedAccess.map(se => se.id));
        return allAccess.filter(e => e.groupName === groupName).every(e => selectedIds.has(e.id));
    },[])

    const checkAllAccessChecked = useCallback((_selectedAccess, allAccess) => {
        const selectedIds = new Set(_selectedAccess.map(se => se.id));
        return allAccess.every(e => selectedIds.has(e.id));
    },[])
    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    function handleClickInfo(acc){
        setDisplayDes({name: acc.accessName, des: acc.description, group: acc.groupName});
        onOpen();
    }

    return(
    <>
        <div className="mx-6 mb-3 text-start flex justify-between h-8">
            <div className="w-40">
                <SearchBox key={'1-' + search1Rerender} 
                    data={agentAccess} placeholder="ค้นหาสิทธิ์ที่มี" 
                    onChange={(data) => setSearchedAgentAccess(data)} 
                    searchRules={[['accessCode',3],['accessName',5]]} 
                    removeZeroScore={false}  />
            </div>
            <div className="w-40">
                <SearchBox key={'2-' + search2Rerender} 
                    data={rightAccess} placeholder="ค้นหาสิทธิ์อื่นๆ" 
                    onChange={(data) => setSearchedRightAccess(data)} 
                    searchRules={[['accessCode',3],['accessName',5]]} 
                    removeZeroScore={false}  />
            </div>            
        </div>
        <div className=" bg-white p-3 rounded-lg">

            <div className="size-full">
                <Card shadow="sm">
                    {/* <div className="bg-base-100 rounded-lg shadow-md w-full"> */}
                        <CardHeader className="sticky flex font-semibold shadow-md z-10 bg-white">
                            <div className="w-1/2 text-center text-sm text-green-600 flex justify-between">
                                <div>{!isDisable &&
                                    <Checkbox size="sm"
                                        isSelected={checkAllAccessChecked(selectedAccess.list, displayAgentAccess)} 
                                        onValueChange={() => hanldeSelectAll('l')}
                                    ></Checkbox>}
                                </div>
                                <div>สิทธิ์ที่มี</div> 
                                {
                                    selectedAccess.side === 'l' && selectedAccess.list.length > 0 ?
                                    <div>{`เลือกแล้ว ${selectedAccess.list.length} / ${displayAgentAccess.length}`}</div>
                                    :
                                    <div>{`ทั้งหมด ${displayAgentAccess.length}`}</div>
                                }
                            </div>
                            <div className="w-12"></div>
                            <div className="w-1/2 text-center text-sm text-red-600 flex justify-between ms-4">
                                <div>{!isDisable &&
                                    <Checkbox size="sm"
                                        isSelected={checkAllAccessChecked(selectedAccess.list, displayRightAccess)} 
                                        onValueChange={() => hanldeSelectAll('r')}
                                    ></Checkbox>}
                                </div>
                                <div>สิทธิ์อื่นๆ</div> 
                                {
                                    selectedAccess.side === 'r' && selectedAccess.list.length > 0 ?
                                    <div>{`เลือกแล้ว ${selectedAccess.list.length} / ${rightAccess.length}`}</div>
                                    :
                                    <div>{`ทั้งหมด ${displayRightAccess.length}`}</div>
                                }
                            </div>
                        </CardHeader>
                        <CardBody className="h-[430px] text-[0.84rem] !p-0">
                            <div id="access-container" className="flex h-full">
                                <div className="flex-1 h-full overflow-auto scrollbar-hide">
                                    {
                                        (loadingAgentAccess || loadingAccess) ?
                                        <div className="flex justify-center mt-4"><CircularProgress aria-label="loading" /></div>
                                        :
                                        !agent && mode == '0' ?
                                        <div className="font-semibold mt-4 text-center">กรุณาเลือกตัวแทนขาย</div> 
                                        :
                                        (agentAccess.length === 0 && mode == '0') ?
                                        <div className="font-semibold mt-4 text-center">ตัวแทนนี้ไม่มีสิทธิ์อยู่</div>
                                        :
                                        Object.keys(groupArray(searchedAgentAccess.filter(e => !(e.score <= 0)),'groupName')).map((groupKey,groupKey_index) => {
                                            const accGroups = groupArray(searchedAgentAccess.filter(e => !(e.score <= 0)),'groupName');
                                            return(
                                                <div key={groupKey_index} className="">
                                                    <div className="sticky top-0 z-10 py-1 font-semibold bg-primary-50 text-primary-700 text-center flex justify-between px-2">
                                                        <div>{!isDisable &&
                                                            <Checkbox size="sm"
                                                                isSelected={checkAllAccessInGroupChecked(groupKey, selectedAccess.list, displayAgentAccess)} 
                                                                onValueChange={() => handleSelectGroup(groupKey, 'l')}
                                                            ></Checkbox>}
                                                        </div>
                                                        <div>
                                                            {groupKey}
                                                        </div>
                                                        <div className="w-10"></div>
                                                    </div>
                                                    <div>
                                                        {
                                                            accGroups[groupKey].map((acc, i) => {
                                                                return(
                                                                    <div key={i} className={`flex items-center
                                                                        ${newAddAccess.some(e => e.id === acc.id) && 'bg-green-500 !text-white'}
                                                                    `}>
                                                                        <div className="size-full border-b mx-2 flex items-center">
                                                                            <div className={`flex cursor-pointer py-2 select-none text-start w-full ${isDisable && 'pointer-events-none'}`}
                                                                                onClick={(event) => handleSelectAccess(event,'l', acc)}
                                                                            >
                                                                                {
                                                                                !isDisable &&
                                                                                <Checkbox size="sm"
                                                                                    isSelected={selectedAccess.list.some(e => e.id == acc.id)} 
                                                                                    onValueChange={() => handleSelectAccess(null,'l', acc)}
                                                                                ></Checkbox>
                                                                                }
                                                                                <div className="w-full text-center text-nowrap overflow-hidden text-ellipsis">{acc.accessName}</div>
                                                                            </div>
                                                                            <Button isIconOnly size="sm" radius="full" variant="light" className="text-blue-700 px-2 cursor-pointer" onPress={() => handleClickInfo(acc)}>
                                                                                <HFInfoFilled size={18} />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="w-12 h-full bg-gray-300 shadow-lg text-white">
                                    <Tooltip content="เพิ่มสิทธิ์" closeDelay={0} color="success" className="text-white" placement="right">
                                        <Button className={`${selectedAccess.side !== 'r' || selectedAccess.list.length <= 0 ? 'text-gray-400' : 'hover:text-green-700 text-green-600'} w-full
                                         h-10 rounded-none font-bold flex justify-center items-center`} 
                                            isIconOnly
                                            onPress={() => handleAddAccess()}
                                            isDisabled={selectedAccess.side !== 'r' || selectedAccess.list.length <= 0}
                                        >
                                            <HFDoubleArrowLeft size={30}/>
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="นำสิทธิ์ออก" closeDelay={0} color='danger' placement="right">
                                        <Button className={`${selectedAccess.side !== 'l' || selectedAccess.list.length <= 0 ? 'text-gray-400' : 'hover:text-red-700 text-red-500'}  w-full
                                         h-10 rounded-none btn-sm text-lg flex justify-center items-center`} 
                                            isIconOnly
                                            onPress={() => handleRemoveAccess()}
                                            isDisabled={selectedAccess.side !== 'l' || selectedAccess.list.length <= 0}
                                        >
                                            <HFDoubleArrowRight size={30} />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="คืนค่าเดิม" closeDelay={0} color="primary" placement="right">
                                        <Button className={`${isDisable ? 'text-gray-400' : ' hover:text-blue-700'} w-full
                                         text-blue-600 h-10 rounded-none text-lg flex justify-center items-center`}
                                            isIconOnly
                                            isDisabled={!agent || isDisable}
                                            onPress={() => handleResetAccess()}
                                        >
                                            <HFSync className={'hover:animate-spin'}/>
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="คัดลอกสิทธิ์" closeDelay={0} color="primary" placement="right">
                                        <Button className={`${isDisable ? 'text-gray-400' : ' hover:text-blue-700'} w-full
                                         text-blue-600 h-10 rounded-none text-lg flex justify-center items-center`}
                                            isIconOnly
                                            isDisabled={!agent || isDisable}
                                            onPress={() => setIsCopyModalOpen(true)}
                                        >
                                            <CopyIcon size={20}/>
                                        </Button>
                                    </Tooltip>
                                </div>
                                <div className="flex-1 h-full overflow-auto scrollbar-hide">
                                    {
                                        (loadingAgentAccess || loadingAccess) ?
                                        <div className="flex justify-center mt-4"><CircularProgress aria-label="loading" /></div>
                                        :
                                        !agent && mode == '0' ?
                                        <div className="mt-4 font-semibold text-center">กรุณาเลือกตัวแทน</div> 
                                        :
                                        Object.keys(groupArray(searchedRightAccess.filter(e => !(e.score <= 0)),'groupName')).map((groupKey,groupKey_index) => {
                                            const accGroups = groupArray(searchedRightAccess.filter(e => !(e.score <= 0)),'groupName');
                                            return(
                                                <div key={groupKey_index}>
                                                    <div className="sticky top-0 z-10 py-1 font-semibold bg-primary-50 text-primary-700 text-center shadow-md flex justify-between px-2">
                                                        <div>{!isDisable &&
                                                            <Checkbox size="sm"
                                                                isSelected={checkAllAccessInGroupChecked(groupKey, selectedAccess.list, displayRightAccess)} 
                                                                onValueChange={() => handleSelectGroup(groupKey, 'r')}
                                                            ></Checkbox>}
                                                        </div>
                                                        <div>{groupKey}</div>
                                                        <div className="w-10"></div>
                                                    </div>
                                                    <div className="">
                                                        {
                                                            accGroups[groupKey].map((acc,i) => 
                                                                <div key={i} className={`flex items-center 
                                                                    ${newRemoveAccess.some(e => e.id === acc.id) && '!bg-red-500 !text-white'}
                                                                `}>
                                                                    <div className="size-full flex items-center border-b mx-2">
                                                                        <div  className={`flex cursor-pointer py-2 select-none box-border text-start w-full`}
                                                                            onClick={(event) => handleSelectAccess(event,'r', acc)}>
                                                                            <Checkbox size="sm"
                                                                                isSelected={selectedAccess.list.some(e => e.id == acc.id)} 
                                                                                onValueChange={() => handleSelectAccess(null,'r', acc)}
                                                                            ></Checkbox>
                                                                            <div className="w-full text-center text-nowrap overflow-hidden text-ellipsis">{acc.accessName}</div>
                                                                            
                                                                        </div>
                                                                        <Button isIconOnly variant="light" size="md" radius="full" className="text-blue-700 px-2 cursor-pointer" onPress={() => handleClickInfo(acc)}>
                                                                            <HFInfoFilled size={18} />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </CardBody>
                    {/* </div> */}
                </Card>
                <div className="h-5 pt-4 text-center">
                    {
                        (newAddAccess.length > 0 && newRemoveAccess.length > 0) ?
                        <Button color="warning" className="text-white" onPress={() => handleSubmit()} isLoading={loadSubmit}>
                            แก้ไข
                        </Button>
                        // <button className="btn bg-yellow-500 text-white" onPress={() => handleSubmit()}>แก้ไข</button>
                        : newAddAccess <= 0 && newRemoveAccess <= 0 ?
                        <></>
                        : newAddAccess <= 0 ?
                        <Button className="bg-red-600 text-white" onPress={() => handleSubmit()} isLoading={loadSubmit}>ลบสิทธิ์</Button>
                        // <button className="btn bg-red-500 text-white" onPress={() => handleSubmit()}>ลบสิทธิ์</button>
                        : 
                        <Button className="bg-green-600 text-white" onPress={() => handleSubmit()} isLoading={loadSubmit}>เพิ่มสิทธิ์</Button>
                        // <button className="btn bg-green-500 text-white" onPress={() => handleSubmit()}>เพิ่มสิทธิ์</button>

                    }
                </div>
            </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>รายละเอียดสิทธิ์</ModalHeader>
                        <ModalBody>
                            <div className="font-semibold text-start">{`${displayDes.group} - ${displayDes.name}`}</div>
                            <div className="border-4 rounded-lg p-4 mb-3 h-32 flex flex-col">
                            {
                                displayDes ? 
                                <>
                                    
                                    <textarea className=" w-full resize-none flex-1 bg-transparent" disabled={true} value={displayDes.des}>
                                        
                                    </textarea>
                                </>
                                :
                                <div>กรุณาเลือกสิทธิ์</div>
                            }
                            </div>

                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
        <CopyAccessModal isCopyModalOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} onCopy={handleCopyAccess} />
    </>
    )
}