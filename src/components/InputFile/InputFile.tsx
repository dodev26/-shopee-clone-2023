import React from 'react'
import { toast } from 'react-toastify'
import { config } from 'src/utils/config'

interface IInputFile {
  onChange: (file?: File) => void
}
const InputFile = ({ onChange }: IInputFile) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if ((fileFromLocal && fileFromLocal.size >= config.maxSizeUpLoadImage) || !fileFromLocal?.type.includes('image')) {
      toast.error('file không đúng size or định dạng qui định')
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  const handleUploadAvatar = () => {
    fileInputRef.current?.click()
  }
  return (
    <>
      <input
        className='hidden'
        type='file'
        name='avatar'
        accept='.jpg, .jepg, .png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => ((event.target as any).value = null)}
      />
      <button
        onClick={handleUploadAvatar}
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
      >
        Chọn ảnh
      </button>
    </>
  )
}

export default InputFile
