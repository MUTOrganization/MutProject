import React from 'react'
import Box1 from './Box1';
import Box5 from './Box5';
import Box6 from './Box6';
import Box2 from './Box2';
import Box3 from './Box3';
import Box4 from './Box4';
import CommissionBox from '../Components/commissionBox';
import { useAppContext } from '../../../contexts/AppContext';
import { ACCESS } from '../../../configs/access';
import SalesBox from './SalesBox';

function comissionContent({ isLoading, dateRange, selectedEmployee, selectedDepartment, onOpenModalClick }) {

    const currentData = useAppContext();
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {currentData.accessCheck.haveAny([ACCESS.commisson.commissionOwnVeiw]) && (
                    <div>
                        <CommissionBox isLoading={isLoading} onOpenModalClick={onOpenModalClick} selectedEmployee={selectedEmployee}/>
                    </div>
                )}
                <div>
                    <Box1 isLoading={isLoading} />
                </div>
                <div>
                    <Box2 isLoading={isLoading} />
                </div>
                <div>
                    <SalesBox isLoading={isLoading} />
                </div>
                {/* <div>
                    <Box4 dateRange={dateRange} selectedEmployee={selectedEmployee} selectedDepartment={selectedDepartment} />
                </div> */}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 py-4'>
                <div>
                    <Box5 isLoading={isLoading} />
                </div>
                <div>
                    <Box6 dateRange={dateRange} selectedEmployee={selectedEmployee} selectedDepartment={selectedDepartment} />
                </div>
            </div>
        </>
    )
}

export default comissionContent