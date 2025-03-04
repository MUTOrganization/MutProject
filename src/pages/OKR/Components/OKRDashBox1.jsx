import React from 'react'
import { Image, Progress, Select, SelectItem } from '@nextui-org/react'

function OKRDashBox1({ handleViewUserOKR }) {
    return (
        <div className='box-2 p-4 w-full grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-8'>
            <div className='lg:w-full md:w-full w-full h-auto bg-white rounded-md p-6 flex lg:flex-row md:flex-row flex-col justify-start items-start space-x-6 border-1 border-slate-100'>
                <div className='control-profile'>
                    <div className='image lg:w-32 lg:h-32 md:w-32 md:h-32 w-24 h-24 flex justify-center items-center rounded-full bg-slate-100 text-sm'>Image</div>
                </div>
                <div className='mt-4 lg:w-full md:w-full w-full'>
                    <div className='control-userInfo'>
                        <div className='space-x-3'>
                            <span className='text-slate-700'>HF000_ANNY</span>
                            <span className='px-4 py-0.5 rounded-md bg-blue-100 text-blue-500 lg:text-sm md:text-sm text-xs'>CRM</span>
                            <span className='px-4 py-0.5 rounded-md bg-yellow-100 text-yellow-500 lg:text-sm md:text-sm text-xs'>Staff</span> <br />
                        </div>
                        <div className='lg:text-sm md:text-sm text-xs text-slate-500 mt-2'>
                            <span>Username</span>
                        </div>
                    </div>

                    <div className='lg:w-full md:w-full w-11/12 mt-5 cursor-pointer' onClick={handleViewUserOKR}>
                        <div className='flex flex-row justify-between items-center lg:text-sm md:text-sm text-xs text-slate-500'>
                            <span>ความคืบหน้า</span>
                            <span>100%</span>
                        </div>
                        <div className='w-full'>
                            <Progress
                                className="w-full"
                                color="warning"
                                maxValue={100}
                                size="sm"
                                value={100}
                            />
                        </div>
                    </div>
                </div>
                <div className='lg:mt-0 md:mt-0 mt-8'>
                    <span className='px-5 py-3 rounded-full bg-green-100 text-green-500 text-xl'>A</span>
                </div>
            </div>

            <div className='lg:w-full md:w-full w-full h-auto bg-white rounded-md p-6 flex lg:flex-row md:flex-row flex-col justify-start items-start space-x-6 border-1 border-slate-100'>
                <div className='control-profile'>
                    <div className='image lg:w-32 lg:h-32 md:w-32 md:h-32 w-24 h-24 flex justify-center items-center rounded-full bg-slate-100 text-sm'>Image</div>
                </div>
                <div className='mt-4 lg:w-full md:w-full w-full'>
                    <div className='control-userInfo'>
                        <div className='space-x-3'>
                            <span className='text-slate-700'>HF000_ANONG</span>
                            <span className='px-4 py-0.5 rounded-md bg-blue-100 text-blue-500 lg:text-sm md:text-sm text-xs'>CRM</span>
                            <span className='px-4 py-0.5 rounded-md bg-yellow-100 text-yellow-500 lg:text-sm md:text-sm text-xs'>Staff</span> <br />
                        </div>
                        <div className='lg:text-sm md:text-sm text-xs text-slate-500 mt-2'>
                            <span>Username</span>
                        </div>
                    </div>

                    <div className='lg:w-full md:w-full w-11/12 mt-5 cursor-pointer' onClick={handleViewUserOKR}>
                        <div className='flex flex-row justify-between items-center lg:text-sm md:text-sm text-xs text-slate-500'>
                            <span>ความคืบหน้า</span>
                            <span>100%</span>
                        </div>
                        <div className='w-full'>
                            <Progress
                                className="w-full"
                                color="warning"
                                maxValue={100}
                                size="sm"
                                value={100}
                            />
                        </div>
                    </div>
                </div>
                <div className='lg:mt-0 md:mt-0 mt-8'>
                    <span className='px-5 py-3 rounded-full bg-green-100 text-green-500 text-xl'>A</span>
                </div>
            </div>

        </div>
    )
}

export default OKRDashBox1
