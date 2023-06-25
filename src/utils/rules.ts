import { AnyObject } from 'yup/lib/types'

import * as yup from 'yup'
// type Rules = {
//   [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
// }
// export const getRules = (getValues: UseFormGetValues<any>): Rules => ({
//   email: {
//     required: {
//       value: true,
//       message: 'Email Không được để trống'
//     },
//     pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không đúng định dạng' },
//     maxLength: {
//       value: 160,
//       message: 'do dai phai tu 5-160 ky tu'
//     },
//     minLength: {
//       value: 5,
//       message: 'do dai it nhat 5 ky tu tro len'
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: 'Password Không được để trống'
//     },

//     maxLength: {
//       value: 160,
//       message: 'do dai phai tu 6-160 ky tu'
//     },
//     minLength: {
//       value: 6,
//       message: 'do dai it nhat 6 ky tu tro len'
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: 'Confirm_password Không được để trống'
//     },

//     maxLength: {
//       value: 160,
//       message: 'do dai phai tu 6-160 ky tu'
//     },
//     minLength: {
//       value: 6,
//       message: 'do dai it nhat 6 ky tu tro len'
//     },
//     validate: (value) => value === getValues('password') || 'mat khong khong khop'
//   }
// })
function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}
export const schema = yup.object({
  email: yup
    .string()
    .required('Email không được để trống')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password không được để trống')
    .min(6, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Password không được để trống')
    .min(6, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Tên sản phẩm không được để trống')
})
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  avatar: yup.string().max(160, 'Độ dài tối đa là 10000 kí tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 kí tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: yup
    .string()
    .required('Password không được để trống')
    .min(6, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự')
    .oneOf([yup.ref('new_password')], 'Mật khẩu không khớp')
})
export type UserSchema = yup.InferType<typeof userSchema>
export const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
