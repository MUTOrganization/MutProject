import React from 'react'
import DefaultLayout from '../../layouts/default'
import Layout from './Components/Layout'
import Home from './Pages/Home/Home'

function WeOne() {
    return (
        // <DefaultLayout>
            <Layout>
                <Home />
            </Layout>
        // </DefaultLayout>
    )
}

export default WeOne
