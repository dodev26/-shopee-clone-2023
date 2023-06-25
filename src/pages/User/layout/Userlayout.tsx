import React, { Children } from 'react'
import { Outlet } from 'react-router-dom'
import UserSideNav from '../components/UserSideNav'

interface Props {
  children?: React.ReactNode
}
const Userlayout = ({ children }: Props) => {
  return (
    <div className='bg-neutral-100 py-16 text-sm text-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-2'>
            <UserSideNav />
          </div>
          <div className='col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Userlayout
