import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import purchaseApi from '../../../../apis/purchase.api'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const HistoryPurchaseTabs = [
  {
    status: purchaseStatus.all,
    name: 'Tất cả'
  },
  {
    status: purchaseStatus.waitForconfirmation,
    name: 'Chờ lấy hàng'
  },
  {
    status: purchaseStatus.inProgress,
    name: 'Đang giao'
  },
  {
    status: purchaseStatus.delivered,
    name: 'Đã giao'
  },
  {
    status: purchaseStatus.cancelled,
    name: 'Đã hủy'
  }
]
const HistoryPurchase = () => {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all

  const { data } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () =>
      purchaseApi.getPurchases({
        status: status as PurchaseListStatus
      })
  })
  const dataPurchases = data?.data.data
  return (
    <div>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
        {HistoryPurchaseTabs.map((tab) => (
          <Link
            key={tab.name}
            to={{
              pathname: path.historyPurchase,
              search: createSearchParams({
                status: String(tab.status)
              }).toString()
            }}
            className={classNames(
              'flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center transition-all',
              {
                'border-b-orange text-orange': status === tab.status,
                'border-b-gray-300 text-black': status !== tab.status
              }
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
        {dataPurchases?.map((purchase) => (
          <div key={new Date().getTime()}>
            <Link
              className='flex'
              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
            >
              <div className='flex flex-shrink-0'>
                <img src={purchase.product.image} className='h-20 w-20 object-cover' alt={purchase.product.name} />
              </div>
              <div className='ml-3 flex-grow overflow-hidden'>
                <div className='truncate'>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>
              <div className='ml-3 flex-shrink-0 '>
                <span className='truncate text-gray-500 line-through'>
                  {formatCurrency(purchase.product.price_before_discount)}
                </span>
                -<span className='truncate text-gray-500 line-through'>{formatCurrency(purchase.product.price)}</span>
              </div>
            </Link>
            <div className='flex justify-end'>
              <div>
                <span>Tông giá tiền</span>
                <span className='ml-4 text-xl text-orange'>{formatCurrency(purchase.product.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPurchase
