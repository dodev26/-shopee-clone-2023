import React from 'react'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'
import Pagination from 'src/components/pagination'
import { ProductListConfig } from 'src/types/product.type'
import { isUndefined, omitBy } from 'lodash'
import categoryApi from 'src/apis/category.api'
import useQueryConfigs from 'src/hooks/useQueryConfigs'
import { Helmet } from 'react-helmet'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
const ProductList = () => {
  const queryConfig = useQueryConfigs()
  const { data: productData, isLoading: isLoadingData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    keepPreviousData: true
  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })


  return (
    <>
      <Helmet>
        <title>Product List | shoppe clone</title>
        <meta name="description" content="tất cả các sản phẩm" />
      </Helmet>
      <div className='bg-gray-200 py-6 '>
        <div className='container'>
          {!isLoadingData && productData ? (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-3'>
                <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
              </div>
              <div className='col-span-9'>
                <SortProductList queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size} />
                <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {productData.data.data.products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default ProductList
