import React from 'react'
import DefaultLayout from '../../layouts/default'
import { Card } from '@nextui-org/react'
import DevBackend from './Components/DevBackend'
import DevFontEnd from './Components/DevFontEnd'

function Developer() {
  return (
    <section title={'Reference DEV Hopeful'}>
        <Card className=' shadow-none'>
            <DevBackend/>
            <DevFontEnd/>
        </Card>

    </section>

  )
}

export default Developer