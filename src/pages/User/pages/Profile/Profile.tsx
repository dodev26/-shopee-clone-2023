import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isNil, omitBy } from 'lodash'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import userAPI from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getAvatarFromName, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

const InfoField = () => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <>
      <div className='mt-6 flex flex-wrap'>
        <div className='w-[20%] truncate pt-3 text-right capitalize'>Tên</div>
        <div className='w-[80%] pl-5'>
          <div className='pt-3 text-gray-700'>
            <Input
              type='text'
              placeholder='tên'
              classNameInput='w-full rounded-sm border  border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              name='name'
              register={register}
              errorMessage={errors.name?.message}
            />
          </div>
        </div>
      </div>
      <div className='mt-6 flex flex-wrap'>
        <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
        <div className='w-[80%] pl-5'>
          <div className='pt-3 text-gray-700'>
            <Input
              type='text'
              placeholder='địa chỉ'
              classNameInput='w-full rounded-sm border  border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              register={register}
              name='address'
              errorMessage={errors.address?.message}
            />
          </div>
        </div>
      </div>
      <div className='mt-6 flex flex-wrap'>
        <div className='w-[20%] truncate pt-3 text-right capitalize'>Số điện thoại</div>
        <div className='w-[80%] pl-5'>
          <div className='pt-3 text-gray-700'>
            <Input
              type='number'
              placeholder='số điện thoai'
              classNameInput='w-full rounded-sm border  border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              register={register}
              name='phone'
              errorMessage={errors.phone?.message}
            />
          </div>
        </div>
      </div>
      <Controller
        control={control}
        name='date_of_birth'
        render={({ field }) => (
          <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
        )}
      />
    </>
  )
}
const Profile = () => {
  const [file, setFile] = React.useState<File>()
  const { setProfile, profile: profileFromcontext } = useContext(AppContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const methods = useForm<FormData>({
    defaultValues: {
      address: '',
      name: '',
      avatar: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const { handleSubmit, setError, setValue } = methods
  const previewAvatar = useMemo(() => {
    return file ? URL.createObjectURL(file) : file
  }, [file])

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userAPI.getProfile
  })
  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('avatar', profile.avatar)
      setValue('address', profile.address)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const updateProfileMutation = useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: userAPI.updateProfile
  })

  const updateAvatar = useMutation(userAPI.updateAvatar)
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatar = null
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await updateAvatar.mutateAsync(form)
        avatar = uploadRes.data.data
      }
      await updateProfileMutation.mutateAsync(
        omitBy({ ...data, date_of_birth: data.date_of_birth?.toISOString(), avatar: avatar }, isNil),
        {
          onSuccess: (res) => {
            setProfile(res.data.data)
            setProfileToLS(res.data.data)
            toast.success(res.data.message)
            refetch()
          }
        }
      )
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'server'
            })
          })
        }
      }
    }
  })

  const onFileChange = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tui</h1>
        <div className='mt-1 text-sm text-gray-700'> Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-row items-start' onSubmit={onSubmit}>
          <div className=' mt-0 flex-grow pr-12'>
            <div className='flex flex-wrap'>
              <div className='w-[20%] truncate pt-3 text-right capitalize'>Email</div>
              <div className='w-[80%] pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <InfoField />
            <div className='mt-5 flex flex-wrap justify-center'>
              <Button type='submit' className='block  bg-orange py-2 px-3 text-white'>
                Update
              </Button>
            </div>
          </div>
          <div className='flex w-72 justify-center border border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 flex h-24 w-24 flex-col items-center'>
                <img
                  src={previewAvatar || getAvatarFromName(profile?.avatar)}
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <InputFile onChange={onFileChange} />
              <div className='mt-3 text-sm text-gray-400'>
                <div>Dung Lượng tối đa 1MB</div>
                <div>Định dạng .JEPG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default Profile
