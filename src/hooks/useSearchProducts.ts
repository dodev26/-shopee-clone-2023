import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { schema, Schema } from 'src/utils/rules'
import useQueryConfigs from './useQueryConfigs'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
export default function useSearchProducts() {
  const queryConfig = useQueryConfigs()
  const navigate = useNavigate()
  const { handleSubmit, register, setValue } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit(
    (data) => {
      const { name: nameProduct } = data
      const configs = queryConfig.order
        ? omit(
            {
              ...queryConfig,
              name: nameProduct
            },
            ['order', 'sort_by']
          )
        : {
            ...queryConfig,
            name: nameProduct
          }
      navigate({
        pathname: path.home,
        search: createSearchParams(configs).toString()
      })
    },
    (err: any) => {
      if (err) {
        navigate('/')
      }
    }
  )
  return {
    onSubmitSearch,
    register,
    setValue
  }
}
