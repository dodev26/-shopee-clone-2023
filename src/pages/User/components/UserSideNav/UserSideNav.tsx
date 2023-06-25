import classNames from 'classnames'
import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarFromName } from 'src/utils/utils'

const UserSideNav = () => {
  const { profile } = useContext(AppContext)

  return (
    <div>
      <div className='flex items-center border-b  border-b-gray-200 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black'>
          <img
            src={getAvatarFromName(profile?.avatar)}
            loading='lazy'
            alt='avatar'
            className='h-full w-full object-cover'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>
            {profile?.name ? profile?.name : profile?.email}
          </div>
          <Link
            to={path.profile}
            className='flex  items-center items-center gap-1 text-[10px] capitalize text-gray-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-3 w-3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
              />
            </svg>
            sữa hồ sơ
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('flex items-center font-semibold capitalize transition-all hover:text-orange', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          tài khoản của tui
        </NavLink>
        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center font-semibold capitalize transition-all hover:text-orange', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          đổi mật khẩu
        </NavLink>
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center font-semibold capitalize transition-all hover:text-orange', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          lịch sử mua hàng
        </NavLink>
      </div>
    </div>
  )
}

export default UserSideNav
