import { Image, Select, SelectItem } from '@nextui-org/react'
import React, { useContext } from 'react'
import { useAppContext } from '../../../contexts/AppContext'

function Box1({ currentUser, thisYear, firstYear, selectYear, setSelectYear }) {
    return (
        <div className='flex flex-row justify-between items-start bg-white rounded-md shadow-sm p-4 px-6'>
            <div className='flex flex-row space-x-3'>
                <Image
                    alt="NextUI hero Image"
                    src={currentUser.displayImgUrl || "https://nextui.org/images/hero-card-complete.jpeg"}
                    width={200}
                    height={200}
                    className="object-cover rounded-md"
                />
                <div className='flex flex-col space-y-2 mt-2'>
                    <div className='flex flex-col space-y-0 mb-2'>
                        <span className='text-lg'>{currentUser.name}</span>
                        <span className='text-slate-600 text-sm'>{currentUser.userName}</span>
                    </div>
                    <span className='text-slate-600'>แผนก : {currentUser.department}</span>
                    <span className='text-slate-600'>ตำแหน่ง :    {currentUser.role}</span>
                </div>
            </div>
            <Select aria-label='year selector' placeholder='เลือกปี'
                selectedKeys={[selectYear + '']}
                onChange={(e) => setSelectYear(Number(e.target.value))}
                size='sm'
                color='success'
                disallowEmptySelection
                className='w-32'
            >
                {[...Array(thisYear - firstYear + 1).keys()].map(e => {
                    return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                })}
            </Select>
        </div>
    )
}

export default Box1
