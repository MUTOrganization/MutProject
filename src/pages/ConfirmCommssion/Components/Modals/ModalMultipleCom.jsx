import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import React from 'react'
import { URLS } from '../../../../config'
import fetchProtectedData from '../../../../../utils/fetchData'
import { toast } from 'sonner'

function ModalMultipleCom({ isOpen, onClose, data, formatNumber, commissionData, isAll, selectAgent, dateRange, currentUser, setIsActionEdit, validateUser, confirmCommssionData, isCutoffDateReached }) {
  const tableColumn = [
    { key: 'username', text: 'พนักงาน' },
    { key: 'commission', text: 'คอมมิชชั่น' },
    { key: 'Ict', text: 'Incentive' }
  ]
  
  const InsertData = async () => {
    const url = `${URLS.commission.confirmCommission}/insertMonthlyCommssion`
    try {
      const res = await fetchProtectedData.post(url, {
        data: data,
        create_By: currentUser.userName,
        businessId: selectAgent,
        monthIndex: `${dateRange.start.year}-${String(dateRange.start.month).padStart(2, '0')}`,
        yearIndex: `${dateRange.start.year}`,
        status: 1
      })
      console.log('Respone Data : ', res.data)
      setIsActionEdit(true)
      toast.success('ยืนยันสำเร็จ', { position: 'top-right' });
    } catch (error) {
      console.log('Insert Fail : ', error)
    }
  }

  const isCurrentMonth = () => {
    const selectedDate = new Date(dateRange.start);
    const selectedMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
    return selectedMonth
  };

  const DeleteData = async () => {
    const url = `${URLS.commission.confirmCommission}/editMonthlyCommssion`;
    try {

      const ids = confirmCommssionData
        .filter(e =>
          data.some(d => d.username === e.username && d.businessID === e.businessID && e.monthIndex === isCurrentMonth())
        )
        .map(e => e.id);
      if (ids.length === 0) {
        console.log('No matching IDs found.');
        return;
      }

      const res = await fetchProtectedData.post(url, { id: ids });
      console.log('Response Data:', res.data);

      setIsActionEdit(true);
      toast.success('ลบข้อมูลสำเร็จ', { position: 'top-right' });

    } catch (error) {
      console.log('Delete Fail:', error);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onClose} size='xl'>
        <ModalContent>
          <ModalHeader>
            <div className='flex flex-col'>
              <span>ยืนยันค่าคอมมิชชั่น</span>
              <span className='text-xs text-slate-500'>จำนวน : {data.length} คน</span>
            </div>
          </ModalHeader>
          <ModalBody>

            <Table
              isStriped
              className='h-96 max-h-[720px] rounded-md overflow-y-auto overflow-x-auto scrollbar-hide'
              isHeaderSticky
              removeWrapper>
              <TableHeader columns={tableColumn}>
                {(columns) => (
                  <TableColumn
                    key={columns.name}
                    className={`text-sm text-center`}
                    allowsSorting={true}
                  >
                    {columns.text}
                  </TableColumn>
                )}
              </TableHeader>

              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={`${item.username}-${index}`} className='text-center'>
                    <TableCell className='text-center'>{item.username}</TableCell>
                    <TableCell className='text-center'>{formatNumber(item.data.commission)}</TableCell>
                    <TableCell className='text-center'>{formatNumber(item.data.incentive)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <hr />

            <div className='flex flex-row justify-between'>
              <span className='text-slate-500'>รวมค่าคอมมิชชั่น</span>
              <span className='font-bold'>{formatNumber(data.reduce((sum, item) => sum + (parseFloat(item.data.commission) || 0), 0).toFixed(2))} บาท</span>
            </div>
            <div className='flex flex-row justify-between'>
              <span className='text-slate-500'>Incentive</span>
              <span className='font-bold'>{formatNumber(data.reduce((sum, item) => sum + (parseFloat(item.data.incentive) || 0), 0).toFixed(2))} บาท</span>
            </div>
            <hr />
          </ModalBody>
          <ModalFooter>
            {!isCutoffDateReached() && (
              <span className='text-red-500 bg-red-100 text-sm px-4 rounded-full flex items-center'>ยังไม่สามารถยืนยันค่าคอมได้ จนกว่าจะถึงวันที่ตัดรอบ</span>
            )}
            {validateUser(data) ? (<>
              <button className='px-8 py-1 bg-red-100 text-red-500 text-sm rounded-md hover:bg-red-500 hover:text-white' onClick={() => { DeleteData(); onClose(); }}>ยกเลิกการยืนยัน</button>
            </>) : (<>
              {/* <button className='px-8 py-1 bg-red-100 text-red-500 text-sm rounded-md hover:bg-red-500 hover:text-white' onClick={onClose}>ยกเลิก</button> */}
              <button disabled={!isCutoffDateReached()} className={`px-8 py-1 text-white text-sm rounded-md  ${!isCutoffDateReached() ? 'bg-slate-200' : 'hover:bg-blue-400 hover:text-white bg-blue-500'}`} onClick={() => { InsertData(); onClose(); }}>ยืนยัน</button>
            </>)}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ModalMultipleCom
