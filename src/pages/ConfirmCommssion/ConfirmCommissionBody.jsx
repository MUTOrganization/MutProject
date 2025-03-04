import React from 'react'
import DefaultLayout from '../../layouts/default'
import { ConfirmCommssionIcon } from '../../component/Icons'
import ConfirmCommssion from './ConfirmCommssion'
import CommissionContextProvider from '../Commission/CommissionContext'

function ConfirmCommissionBody() {
  return (
    <div>
      <section title='ยืนยันค่าคอม'>
        <CommissionContextProvider>
          <ConfirmCommssion />
        </CommissionContextProvider>
      </section>
    </div >
  )
}

export default ConfirmCommissionBody
