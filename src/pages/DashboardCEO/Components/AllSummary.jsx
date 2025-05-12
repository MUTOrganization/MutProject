import React from 'react'

function AllSummary() {
    return (
        <div className='w-full flex flex-row justify-start items-center space-x-5'>

            <div className='bg-white rounded-md shadow-md py-2 px-6 flex flex-row justify-between items-center space-x-8 relative'>
                <div className='subBox1'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-2'>กำไรสุทธิ</header>
                    <div className='mt-3'>
                        <div className='text-2xl text-green-500 font-semibold'>950,000.00 $</div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-200 rounded-md'></div>

                <div className='subBox2'>
                    <header className='text-start text-sm text-slate-500 mb-3'>ยอดขาย</header>
                    <div className='flex flex-col justify-center items-start'>
                        <div className='text-blue-500 text-2xl'>1,000,000.00 $</div>
                        <div className='w-full h-0.5 bg-slate-200 rounded-md my-1'></div>
                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-slate-500 text-sm'>ออเดอร์</div>
                            <div className='text-slate-500 text-sm'>1,500</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-md shadow-md py-2 px-6 w-64 flex flex-row justify-between items-center space-x-8 relative'>
                <div className='subBox1'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-2'>ค่าใช้จ่ายรวม</header>
                    <div className='mt-4 flex flex-col justify-center items-start py-4'>
                        <div className='text-2xl text-red-400'>500,000.00 $</div>
                        <span className='text-sm text-slate-500'>20.55%</span>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-md shadow-md py-3 px-6 flex flex-row justify-between items-center space-x-8 relative'>
                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3'>ค่าคอมมิชชั่น</header>
                    <div className='flex flex-col justify-center items-start'>
                        <div className='text-slate-500 text-2xl'>250,000.00 $</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>50.00%</div>
                        </div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-200 rounded-md'></div>

                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3'>ค่าใช้จ่ายอื่นๆ</header>
                    <div className='flex flex-col justify-center items-start'>
                        <div className='text-slate-500 text-2xl'>250,000.00 $</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>50.00%</div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='bg-white rounded-md shadow-md px-4 py-5 flex flex-col justify-center items-center space-y-2 w-3/12'>
                <div className='flex flex-row justify-between items-center space-x-4 w-full'>
                    <span className='text-lg text-slate-500'>ลูกค้าใหม่</span>
                    <span className='text-green-500 font-semibold'>500</span>
                </div>
                <div className='w-full h-0.5 bg-slate-100 rounded-md '></div>
                <div className='flex flex-row justify-between items-center space-x-4 w-full'>
                    <span className='text-lg text-slate-500'>ลูกค้าเก่า</span>
                    <span className='text-slate-600 font-semibold'>500</span>
                </div>
            </div>
        </div>
    )
}

export default AllSummary
