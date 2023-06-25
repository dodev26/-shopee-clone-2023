import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userAPI from 'src/apis/user.api'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>

const ChangePasswordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    }
  })
  const updateProfileMutation = useMutation(userAPI.updateProfile)
  const onUpdatePassword = handleSubmit(async (data) => {
    try {
      await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']), {
        onSuccess: () => {
          toast.success('Cập nhật mật khẩu thành công')
          reset()
        }
      })
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tui</h1>
        <div className='mt-1 text-sm text-gray-700'> Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form onSubmit={onUpdatePassword} className='mt-8 flex flex-col items-start'>
        <div className='mt-6 flex w-full flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right capitalize'>Mật khẩu cũ</div>
          <div className='w-[80%] pl-5'>
            <div className='pt-3 text-gray-700'>
              <Input
                type='password'
                placeholder='mật khẩu cũ'
                classNameInput='w-full rounded-sm border  border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex w-full flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right capitalize'>Mật khẩu mới</div>
          <div className='w-[80%] pl-5'>
            <div className='pt-3 text-gray-700'>
              <Input
                type='password'
                placeholder='mật khẩu mới'
                classNameInput='w-full rounded-sm border  border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='new_password'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex w-full flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right capitalize'>Nhập lại mật khẩu</div>
          <div className='w-[80%] pl-5'>
            <div className='pt-3 text-gray-700'>
              <Input
                type='password'
                placeholder='nhập lại mật khẩu'
                classNameInput='w-full rounded-sm border  border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='confirm_password'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex w-full flex-wrap justify-center'>
          <button type='submit' className='bg-orange px-3 py-2 text-center font-semibold text-white'>
            update
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
