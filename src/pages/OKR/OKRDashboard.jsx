import { Select, SelectItem, Switch } from '@nextui-org/react'
import React, { useState } from 'react'
import OKRDashBox1 from './Components/OKRDashBox1'
import ViewPersonalOKR from './Components/ViewPersonalOKR'


function OKRDashboard() {

    const [viewUserOKR, setViewUserOKR] = useState(false)
    const thisYear = new Date().getFullYear()
    const firstYear = 2019
    const [selectYear, setSelectYear] = useState(thisYear)
    const [isSwitch, setIsSwitch] = useState(false)

    const handleViewUserOKR = () => {
        setViewUserOKR(!viewUserOKR)
    }

    return (
        <>
            {viewUserOKR ? (
                <ViewPersonalOKR handleViewUserOKR={handleViewUserOKR} />
            ) : (
                <>

                    {/* <Select aria-label='year selector' placeholder='เลือกปี'
                            selectedKeys={[selectYear + '']}
                            onChange={(e) => setSelectYear(Number(e.target.value))}
                            size='sm'
                            color=''
                            disallowEmptySelection
                            className='w-32'
                        >
                            {[...Array(thisYear - firstYear + 1).keys()].map(e => {
                                return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                            })}
                        </Select> */}
                    <div className='w-full h-full bg-slate-50 rounded-md p-4 flex lg:flex-row md:flex-col flex-col justify-start items-start lg:space-x-6 lg:space-y-0 md:space-y-4 space-y-0'>
                        <div className='box-1 h-full lg:w-2/12 md:w-full w-full p-4 rounded-md bg-white'>
                            <div className='w-full h-full text-center mt-2'>
                                {/* <span className='text-lg text-slate-500 text-center'>แผนก</span> */}
                                <div className='mt-8 space-y-6 text-sm text-slate-800'>
                                    <div className='cursor-pointer bg-slate-100 rounded-md p-2'>
                                        <span>CRM</span>
                                    </div>
                                    <div>
                                        <span>Admin</span>
                                    </div>
                                    <div>
                                        <span>Sales</span>
                                    </div>
                                </div>

                                <div className='mt-8'>
                                    <Select defaultSelectedKeys={['1']}>
                                        <SelectItem value={1} key={1} >ทุกคนในแผนก</SelectItem>
                                        <SelectItem value={2} key={2}>hf000_anny</SelectItem>
                                        <SelectItem value={3} key={3}>hf000_aong</SelectItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className='md:w-full sm:full mx-auto'>
                            <div className='ms-4'>
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
                            <OKRDashBox1 handleViewUserOKR={handleViewUserOKR} />
                        </div>
                    </div>


                </>
            )}
        </>
    )
}

export default OKRDashboard
