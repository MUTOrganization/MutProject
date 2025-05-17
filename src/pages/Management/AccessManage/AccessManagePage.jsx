import { useAppContext } from "@/contexts/AppContext";

export default function AccessManagePage(){
    const {currentUser} = useAppContext()
    return(
        <div className="flex gap-5  w-full max-lg:flex-col">
        <Card shadow="sm" className="p-4 flex-1  h-[630px] ">
          <div className="size-full ">
            {/* table */}
            <div className="size-full flex flex-col"> 
              {/* table header */}
              <div className="z-20 bg-gray-200 rounded-lg shadow-md">
                {/* table row */}
                <div className="text-gray-700 font-semibold text-center flex items-center px-2">
                  {/* table cells */}
                  <div className="py-3 flex-1">ชื่อสิทธิ์</div>
                  <div className="py-3 flex-1">รหัสสิทธิ์</div>
                  <div className="w-20 text-center">
                    
                    {currentUser.agent.id === 1 && (
                      <Button 
                      isIconOnly 
                      size="sm"
                      color="success"
                      variant="light"
                      className=""
                      onPress={() => {
                        setOpenModal(true);
                        setIsEdit(false);
                      }}
                      ><AddCircleIcon /></Button>
                    )}
                  </div>
                  {/* end table cells */}
                </div>
                {/* end table row */}
              </div>
              {/* end table header */}

              {/* table body */}
              <div className="overflow-auto scrollbar-hide px-2">
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((group) => (
                    <React.Fragment key={group.groupName}>
                      {/* table row */}
                      <div
                        className="border-b-0 sticky top-0 z-10 bg-gray-100 text-gray-700 rounded-lg">
                        <div colSpan={3} className="font-semibold text-center text-sm py-2">
                          {group.groupName}
                        </div>
                      </div>
                      {group.items.length > 0 && group.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedGroupAccessCode([item.accessCode])}
                          className={`flex transition-all duration-200 rounded-lg  py-1 px-2 text-center cursor-pointer text-sm ${selectedGroupAccessCode.includes(item.accessCode) ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-200'}`}>
                          <div className="py-2 flex-1">{item.accessName}</div>
                          <div className="py-2 flex-1">{item.accessCode}</div>  
                          <div className="py-2 w-20">
                            <span className="flex justify-center space-x-3">
                              <EditIcon
                                className={'cursor-pointer text-lg hover:text-warning-700 text-warning-500'}
                                onClick={() => { handleOpenEdit(item) }} />
                              <Tooltip
                                showArrow
                                color="default"
                                placement="right"
                                content={item.description}
                                size="lg">
                                <span>
                                  <InfomationIcon size={18} className="text-primary-500 hover:text-primary-800" />
                                </span>
                              </Tooltip>

                              {/* {currentUser.businessId === 1 && (
                                <DeleteIcon
                                  onPress={() => { setSelectedRowAccessId(item.id); setOpenModalConfirmDelete(true); setSelectedAccessName(item.accessName) }}
                                  className={'cursor-pointer text-lg hover:text-custom-redlogin'}
                                />
                              )} */}
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* end table row */}
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="border-b-0">
                    <td colSpan={3} className="text-center text-primary-600 text-lg font-bold border-b-none">
                      ไม่พบสิทธิ์ตัวแทน
                    </td>
                  </tr>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card shadow="sm" className="flex-1 p-4 h-[630px]">
          <div className="rounded-lg size-full">
            {/* table */}
            <div className="size-full rounded-lg flex flex-col">
              {/* table header */}
              <div className="z-10 bg-gray-200 rounded-lg text-center shadow-md font-semibold">
                <div className="p-3">
                  ตำแหน่งที่ใช้สิทธิ์อยู่
                </div>
              </div>
              {/* end table header */}

              {/* table body */}
              <div className="flex-1 overflow-auto scrollbar-hide px-2">
                {Object.entries(lodash.groupBy(roleByAccessCode, 'depName')).map(([depName, roles]) => {
                  return (
                    <React.Fragment key={depName}>
                      <div className="border-0 bg-gray-100 text-sm rounded-lg">
                        <div className="font-bold text-center text-gray-700 py-2">แผนก {depName}</div>
                      </div>

                      {roles.map((role) => (
                        <div key={role.roleName} className="border-none text-center">
                          <div className="py-2">{role.roleName}</div>
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    )
}