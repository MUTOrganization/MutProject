import React, { useEffect, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Tooltip } from "@nextui-org/react";
import {
  AddStreamlineUltimateIcon,
  AddStreamlineUltimateWhiteIcon,
  CheckCircle,
  DeleteIcon,
  EditIcon,
  InfomationIcon,
  InformationIcon,
  SearchIcon,
} from "../../../component/Icons";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import fetchProtectedData from "../../../../utils/fetchData";
import lodash, { set } from "lodash";
import axios from "axios";

import { ConfirmCancelButtons } from "../../../component/Buttons";
import { toastError, toastSuccess } from "../../../component/Alert";
import { data } from "autoprefixer";
import SearchBox from "../../../component/SearchBox";
import AgentSelector from "../../../component/AgentSelector";


function AddGroup({ open, close, listGroupAccess = [], isSave }) {
  const [input, setInput] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [errValidate, setErrValidate] = useState(false);

  const fetchAddGroup = async () => {
    try {
      const response = await fetchProtectedData.post(`${URLS.access.addGroup}`, { groupName: input, description: inputDescription });
      if (response.status === 201) {
        toastSuccess('เพิ่มข้อมูลสำเร็จ', 'การเพิ่มข้อมูลของคุณเสร็จสมบูรณ์ สามารถดำเนินการต่อได้เลย');
        isSave(true);
      } else {
        toastError('บันทึกข้อมูลไม่สำเร็จ', 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาตรวจสอบและลองอีกครั้ง')
        throw new Error('Failed to add group');
      }
    } catch (error) {
      console.error('error add group');
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || input.trim().length <= 0) {
      setErrMessage('กรุณากรอกชื่อกลุ่ม')
      setErrValidate(true);
      return;
    }
    const findGroup = listGroupAccess.find(item => item.groupName === input);
    if (findGroup) {
      setErrMessage('มีกลุ่มนี้อยู่ในรายการแล้ว');
      setErrValidate(true);
      return;
    }
    await fetchAddGroup();
    setErrValidate(false);
    setInput('');
    setInputDescription('');
    close(false);
  }

  const handleCancel = () => {
    setErrValidate(false);
    setInput('');
    setInputDescription('');
    close(false);
  }

  return (
    <Modal backdrop="opaque" isDismissable={false} isOpen={open} onClose={() => close(false)}>
      <ModalContent>
        <ModalHeader className="flex flex-col text-2xl text-center bg-blue-100 text-primary">
          <p>เพิ่มกลุ่มใหม่</p>
        </ModalHeader>
        <ModalBody>
          <div className="w-full space-y-2 my-2">
            <Input type="text"
              variant="bordered"
              label="เพิ่มกลุ่ม"
              labelPlacement="outside"
              placeholder="กรอกชื่อกลุ่ม"
              onFocus={() => setErrValidate(false)}
              isInvalid={errValidate}
              errorMessage={errMessage}
              onChange={(e) => setInput(e.target.value)} />

            <Textarea
              variant="bordered"
              label="รายละเอียดกลุ่ม"
              labelPlacement="outside"
              placeholder="กรอกรายละเอียดกลุ่ม (ไม่จำเป็น)"
              onChange={(e) => setInputDescription(e.target.value)} />
          </div>
        </ModalBody>
        <ModalFooter>
          <ConfirmCancelButtons confirmText="เพิ่มกลุ่ม" onCancel={handleCancel} onConfirm={handleSubmit} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


function DeleteAccessModal({ open, close, isDelete = false, id, accessName }) {
  const fetchDeleteAccess = async () => {
    await fetchProtectedData.delete(`${URLS.access.delete}/${id}`)
      .then(res => {
        toastSuccess('ลบข้อมูลสำเร็จ', 'การลบข้อมูลเสร็จสมบูรณ์');
        isDelete(true);
        close(false);
      }).catch(err => {
        toastError('ลบข้อมูลไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง');
        isDelete(false);
        close(false);
      })
  }

  const handleDelete = async () => {
    await fetchDeleteAccess();
    close(false);
  }

  return (
    <Modal isOpen={open} onClose={() => close(false)} size="sm">
      <ModalContent>
        <ModalHeader className="w-full flex flex-col gap-1 text-center bg-custom-redlogin text-white">
          <p>ลบข้อมูลสิทธิ์</p>
        </ModalHeader>
        <ModalBody>
          <div className="w-full p-2 text-center">
            <p>ท่านต้องการลบ สิทธิ์</p>
            <p className="text-lg text-wrap text-red-500">{accessName} นี้หรือไม่</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <ConfirmCancelButtons size="sm" onCancel={() => close(false)} onConfirm={handleDelete} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function Permission() {
  //Field contextData
  const contextData = useAppContext();
  const currentUser = contextData.currentUser;
  const selectedAgent = contextData.agent.selectedAgent;

  //Field textSearch
  const [filteredData, setFilteredData] = useState([]);

  //Input state
  const [inputNameAccess, setInputNameAccess] = useState('');
  const [inputAccessCode, setInputAccessCode] = useState('');
  const [inputDescriptionAccess, setInputDescriptionAccess] = useState('');


  //Error state
  const [errSelecteGroup, setErrSelectGroup] = useState({ state: false, message: '' });
  const [errInputNameAccess, setErrInputNameAccess] = useState({ state: false, message: '' });
  const [errInputAccessCode, setErrInputAccessCode] = useState({ state: false, message: '' });

  //List data from API
  const [accessData, setAccessData] = useState([]);
  const [roleByAccessCode, setRoleByAccessCode] = useState([]);
  const [listGroupAccess, setListGroupAccess] = useState([]);

  //Field selected
  const [selectedGroupAccessCode, setSelectedGroupAccessCode] = useState([]);
  const [selectedListGroupAccessCode, setSelectedListGroupAccessCode] = useState();
  const [selectedRowAccessId, setSelectedRowAccessId] = useState();
  const [selectedRowAccessName, setSelectedAccessName] = useState('');
  const [selectedRowItem, setSelectedRowItem] = useState(null);

  //Field modal
  const [openModal, setOpenModal] = useState(false);
  const [openModalAddGroup, setOpenModalAddGroup] = useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [isSaveAccess, setIsSaveAccess] = useState(false);
  const [isDelete, setIsDelete] = useState(false);



  //#region function 
  const handleSearch = (text) => {
    const lowercasedFilter = text.toLowerCase();
    const filtered = accessData.filter((group) => {
      const groupMatch = group.groupName.toLowerCase().includes(lowercasedFilter);

      const accessMatch = group.items.some(
        (item) =>
          item.accessName.toLowerCase().includes(lowercasedFilter) ||
          item.accessCode.toLowerCase().includes(lowercasedFilter)
      );

      return groupMatch || accessMatch;
    });

    if (filtered.length === 0) {
      setFilteredData(accessData);
    } else {
      setFilteredData(filtered);
    }
  };

  const handleSelectGroupAccess = (accCode = []) => {
    setSelectedGroupAccessCode([]);
    accCode.forEach(item => {
      setSelectedGroupAccessCode((prev) => [...prev, item.accessCode]);
    });
  }

  const validateFunc = () => {
    if (!selectedListGroupAccessCode || selectedListGroupAccessCode.length <= 0) {
      setErrSelectGroup({ state: true, message: 'กรุณาเลือกกลุ่ม' });
      return false;
    }

    if (!inputNameAccess || inputNameAccess.trim().length <= 0) {
      setErrInputNameAccess({ state: true, message: 'กรุณากรอกชื่อสิทธิ์' })
      return false;
    }

    if (!inputAccessCode || inputAccessCode.trim().length <= 0) {
      setErrInputAccessCode({ state: true, message: 'กรุณากรอกรหัสสิทธิ์' })
      return false;
    }

    const groupName = listGroupAccess.find(x => x.id == selectedListGroupAccessCode).groupName
    const group = accessData.find(x => x.groupName === groupName);
    const items = group ? group.items : [];

    const findAccessName = items.filter(x => x.accessName === inputNameAccess);
    const findAccessCode = items.filter(x => x.accessCode === inputAccessCode);
    if (findAccessName.length > 0 && !isEdit) {
      setErrInputNameAccess({ state: true, message: 'ชื่อสิทธิ์นี้ถูกใช้งานในกลุ่มนี้แล้ว' })
      return false;
    }

    if (findAccessCode.length > 0 && !isEdit) {
      setErrInputAccessCode({ state: true, message: 'รหัสสิทธิ์นี้ถูกใช้งานในกลุ่มนี้แล้ว' })
      return false;
    }

    return true;
  }

  const handleModalClose = () => {
    setOpenModal(false);
  }

  const handleOpenEdit = (item) => {
    const findGroupId = listGroupAccess.filter(group => group.id === item.id)[0];
    setSelectedRowItem(item);
    setSelectedListGroupAccessCode(findGroupId);
    setInputNameAccess(item.accessName);
    setInputAccessCode(item.accessCode);
    setInputDescriptionAccess(item.description);
    setIsEdit(true);
    setOpenModal(true);
  }

  const handleModalSave = () => {
    if (validateFunc()) {
      switch (isEdit) {
        case false:
          fetchAddAccess();
          setSelectedListGroupAccessCode('');
          setInputNameAccess('');
          setInputAccessCode('');
          setInputDescriptionAccess('');
          setIsSaveAccess(true);
          setIsEdit(false);
          setOpenModal(false);
          break;

        case true:
          fetchEditAccess();
          setSelectedListGroupAccessCode('');
          setInputNameAccess('');
          setInputAccessCode('');
          setInputDescriptionAccess('');
          setIsSaveAccess(true);
          setIsEdit(false);
          setOpenModal(false);
          break;

        default:
          break;
      }
    }
  }
  //#endregion

  //#region FetchAccess
  const fetchAccessData = async () => {
    await fetchProtectedData
      .get(URLS.access.getAll, { params: { businessId: 1, safe: 'false' } })
      .then((res) => {
        if (res.data.length <= 0) {
          setAccessData([])
          setFilteredData([])
        }
        const setData = lodash.groupBy(res.data, "groupName");
        setAccessData(
          Object.entries(setData).map(([groupName, items]) => ({
            groupName,
            items,
          }))
        );
      })
      .catch((err) => {
        console.error('error fetching access');
      });
  };
  //#endregion

  //#region Fetch Roles
  const fetchRoleByAccessCode = async () => {
    try {
      const res = await fetchProtectedData.post(URLS.roles.getByAccess, { access: selectedGroupAccessCode, businessId: selectedAgent?.id })
      if (res.status === 200) {
        setRoleByAccessCode(res.data);
      }
    }
    catch (err) {
      console.error('error fetching role usage');
    }
  }
  //#endregion

  //#region Fetch Groups
  const fetchAllGroups = async () => {
    try {
      const res = await fetchProtectedData.get(URLS.access.getAllGroup + "/?group=1");
      if (res.status === 200) {
        setListGroupAccess(res.data);
      }
      else {
        toastError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง')
        throw new Error('Failed to get all groups');
      }
    }
    catch (err) {
      console.error('error fetching access group');
    }
  }
  //#endregion

  //#region Add Access
  const fetchAddAccess = async () => {
    try {
      await fetchProtectedData.post(URLS.access.add, {
        accessName: inputNameAccess,
        accessCode: inputAccessCode,
        description: inputDescriptionAccess,
        groupId: selectedListGroupAccessCode,
      }).then(response => {
        toastSuccess('บันทึกข้อมูลสำเร็จ', 'ข้อมูลถูกเพิ่มลงในระบบเรียบร้อยแล้ว')
      });
    }
    catch (err) {
      console.error('error add access')
    }
  }
  //#endregion

  //#region Edit Access
  const fetchEditAccess = async () => {
    try {
      await fetchProtectedData.post(URLS.access.edit + "/" + selectedRowItem.id, {
        accessName: inputNameAccess,
        accessCode: inputAccessCode,
        description: inputDescriptionAccess,
        groupId: listGroupAccess.find(x => x.id == selectedListGroupAccessCode).id,
      }).then(res => {
        if (res.status === 201) {
          toastSuccess('แก้ไขข้อมูลสิทธิ์สำเร็จ', 'ข้อมูลถูกแก้ไขในระบบเรียบร้อยแล้ว')
        }
      })
    }
    catch (err) {
      toastError("เกิดข้อผิดพลาดในแก้ไขข้อมูล", "ไม่สามารถแก้ไขข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง")
      console.error('error edit access')
    }
  }
  //#endregion

  //#region useEfftect
  useEffect(() => {
    fetchAccessData();
    fetchAllGroups();
  }, []);


  useEffect(() => {
    fetchRoleByAccessCode();
  }, [selectedGroupAccessCode, selectedAgent]);

  useEffect(() => {
    if (isSave) {
      fetchAllGroups();
      setIsSave(false);
    }
  }, [isSave])

  useEffect(() => {
    if (isDelete) {
      fetchAccessData();
      setIsDelete(false);
    }
  }, [isDelete])

  useEffect(() => {
    if (isSaveAccess) {
      fetchAccessData();
      setIsSaveAccess(false);
    }
  }, [isSaveAccess])

  useEffect(() => {
    if (accessData.length > 0) {
      setFilteredData(accessData);
    }
  }, [accessData]);

  useEffect(() => {
    fetchAccessData();
  }, [selectedAgent])

  console.log(roleByAccessCode);
  //#endregion

  return (
    <div className="bg-white w-full h-full max-h-full rounded-lg p-4">

      <AddGroup open={openModalAddGroup} close={e => setOpenModalAddGroup(e)} listGroupAccess={listGroupAccess} isSave={e => setIsSave(e)} />
      <DeleteAccessModal open={openModalConfirmDelete} close={() => setOpenModalConfirmDelete(false)} isDelete={e => setIsDelete(e)} id={selectedRowAccessId} accessName={selectedRowAccessName} />

      <Modal backdrop="opaque" isDismissable={false} isOpen={openModal} onClose={() => setOpenModal(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-2xl p-0">
            <div className="w-full text-center text-primary bg-blue-100 p-3">
              <p> {isEdit ? 'แก้ไขสิทธิ์' : 'เพิ่มสิทธิ์ '}</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="form-control my-5 mx-2 flex-1 space-y-3">

              <div className="w-full">
                <label className="label label-text text-black">กลุ่ม</label>
                <div className="flex items-center space-x-4">
                  <Select
                    aria-label="select-group"
                    label="เลือกกลุ่ม"
                    variant="bordered"
                    size="sm"
                    onFocus={() => { setErrSelectGroup({ state: false, message: '' }) }}
                    onChange={(e) => setSelectedListGroupAccessCode(e.target.value)}
                    selectionMode="single"
                    className="max-w-xs"
                    isInvalid={errSelecteGroup.state}
                    errorMessage={errSelecteGroup.message}
                    placeholder={isEdit && selectedRowItem.groupName}>
                    {listGroupAccess.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.groupName}
                      </SelectItem>
                    ))}
                  </Select>

                  <Button size="sm" color="success" onPress={() => setOpenModalAddGroup(true)} className="text-white">เพิ่มกลุ่ม</Button>
                </div>
              </div>

              <div className="w-full">
                <label className="label label-text text-black">ชื่อสิทธิ์</label>
                <div className="flex items-center">
                  <Input placeholder={isEdit ? selectedRowItem.accessName : 'กรอกชื่อสิทธิ์'} onChange={(e) => setInputNameAccess(e.target.value)} onFocus={() => { setErrInputNameAccess({ state: false, message: '' }) }} aria-label="input access_name" type="text" size="sm" variant="bordered" isInvalid={errInputNameAccess.state} errorMessage={errInputNameAccess.message} />
                </div>
              </div>

              <div className="w-full">
                <label className="label label-text text-black">รหัสสิทธิ์</label>
                <div className="flex items-center">
                  <Input placeholder={isEdit ? selectedRowItem.accessCode : 'กรอกรหัสสิทธิ์'} onChange={(e) => setInputAccessCode(e.target.value)} onFocus={() => { setErrInputAccessCode({ state: false, message: '' }) }} aria-label="input access_name" type="text" size="sm" variant="bordered" isInvalid={errInputAccessCode.state} errorMessage={errInputAccessCode.message} />
                </div>
              </div>

              <div className="w-full">
                <Textarea label={'รายละเอียดสิทธิ์'} onChange={(e) => setInputDescriptionAccess(e.target.value)} placeholder={isEdit ? selectedRowItem.description : 'กรอกรายละเอียดเพิ่มเติม'} labelPlacement="outside" variant="bordered" />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <ConfirmCancelButtons size="md" confirmText="บึนทึก" onConfirm={handleModalSave} onCancel={handleModalClose} />
          </ModalFooter>

        </ModalContent>
      </Modal>


      <p className="text-lg">จัดการสิทธิ์การเข้าถึง</p>
      <div className="w-full  my-4">
        <Input
          onChange={(v) => handleSearch(v.target.value)}
          size="sm"
          placeholder="ค้นหา"
          className="bg-white max-w-xs"
          isClearable={false}
          variant="faded"
          startContent={<SearchIcon className="text-black/50" />}
        />
      </div>
      <div className="flex gap-5 h-full  w-full max-lg:flex-col  py-4  min-h-[800px]">
        <div className="flex-1 overflow-auto shadow-lg max-h-[700px] min-h-[700px] rounded-lg scrollbar-hide">
          <table className="table table-md  w-full">
            <thead className="sticky top-0 z-20 bg-primary-400 text-lg">
              <tr className="border-b-0 text-white  text-center font-semibold">
                <th className="py-3">ชื่อสิทธิ์</th>
                <th className="py-3">รหัสสิทธิ์</th>
                <th className="w-20">
                  {currentUser.businessId === 1 && (
                    <Button 
                    isIconOnly 
                    variant="bordered"
                    className="border-none text-white hover:bg-primary-300"
                    onPress={() => {
                      setOpenModal(true);
                      setIsEdit(false);
                    }}
                      startContent={<AddStreamlineUltimateWhiteIcon />}
                    />
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((group) => (
                  <React.Fragment key={group.groupName}>
                    <tr
                      className="border-b-0 sticky top-10 z-10 bg-primary-50 text-primary-600">
                      <td colSpan={3} className="font-bold text-center py-2">
                        {group.groupName}
                      </td>
                    </tr>
                    {group.items.length > 0 && group.items.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedGroupAccessCode([item.accessCode])}
                        className={`border-b-0 py-2 text-center hover:bg-gray-100 cursor-pointer ${selectedGroupAccessCode.includes(item.accessCode) ? 'bg-primary-100 text-primary-600' : ''}`}>
                        <td className="py-2">{item.accessName}</td>
                        <td className="py-2">{item.accessCode}</td>
                        <td className="py-2">
                          <span className="flex justify-center space-x-3">
                            <EditIcon
                              className={'cursor-pointer text-lg hover:text-blue-700 '}
                              onClick={() => { handleOpenEdit(item) }} />
                            <Tooltip
                              showArrow
                              color="default"
                              placement="right"
                              content={item.description}
                              size="lg">
                              <span>
                                <InfomationIcon size={18} />
                              </span>
                            </Tooltip>

                            {/* {currentUser.businessId === 1 && (
                              <DeleteIcon
                                onPress={() => { setSelectedRowAccessId(item.id); setOpenModalConfirmDelete(true); setSelectedAccessName(item.accessName) }}
                                className={'cursor-pointer text-lg hover:text-custom-redlogin'}
                              />
                            )} */}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr className="border-b-0">
                  <td colSpan={3} className="text-center text-primary-600 text-lg font-bold border-b-none">
                    ไม่พบสิทธิ์ตัวแทน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex-1 h-[700px] flex flex-col">
          <div className="flex justify-end items-center">
            <div className="mb-4 w-48">
              <AgentSelector />
            </div>
          </div>
          <div className="overflow-auto shadow-lg rounded-lg scrollbar-hide  flex-1">
            <table className="table table-sm w-full rounded-lg">
              <thead className="sticky top-0 z-10 bg-primary-400 text-lg">
                <tr className="text-white text-center border-none rounded-t-lg">
                  <th colSpan={2} className="font-mono text-lg p-3">
                    ตำแหน่งที่ใช้สิทธิ์อยู่
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(lodash.groupBy(roleByAccessCode, 'depName')).map(([depName, roles]) => {
                  return (
                    <React.Fragment key={depName}>
                      <tr className="border-0 bg-primary-50">
                        <td colSpan={2} className="font-bold text-center text-primary-600 py-2">แผนก {depName}</td>
                      </tr>

                      {roles.map((role) => (
                        <tr key={role.roleName} className="border-none text-center">
                          <td colSpan={2} className="py-2">{role.roleName}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Permission;
