import { range } from 'lodash'
import React, { useState } from 'react'

interface IDateSelect {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}
const DateSelect = ({ errorMessage, onChange, value }: IDateSelect) => {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 1,
    year: value?.getFullYear() || 1990
  })
  console.log(date)
  console.log(value?.getMonth())
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valueFromSelect = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [event.target.name]: Number(event.target.value)
    }
    setDate(valueFromSelect)
    onChange && onChange(new Date(valueFromSelect.year, valueFromSelect.month, valueFromSelect.date))
  }
  return (
    <div className='mt-2 flex flex-wrap'>
      <div className='w-[20%] truncate pt-3 text-right capitalize'>Ngày sinh</div>
      <div className='w-[80%] pl-5'>
        <div className='flex justify-between'>
          <select
            value={value?.getDate() || date.date}
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
          >
            {range(1, 32).map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <select
            value={value?.getMonth() || date.month}
            onChange={handleChange}
            name='month'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
          >
            {range(0, 12).map((month) => (
              <option key={month} value={month}>
                {month + 1}
              </option>
            ))}
          </select>
          <select
            value={value?.getFullYear() || date.year}
            onChange={handleChange}
            name='year'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
          >
            {range(1900, 2024).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default DateSelect
