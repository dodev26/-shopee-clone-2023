import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
interface bodyUpdateProfile extends Omit<User, '_id' | 'email' | 'roles' | 'createdAt' | 'updatedAt'> {
  password?: string
  newPassword?: string
}
const userAPI = {
  getProfile: () => http.get<SuccessResponse<User>>('me'),
  updateProfile: (body: bodyUpdateProfile) => http.put<SuccessResponse<User>>('user', body),
  updateAvatar: (body: FormData) =>
    http.post<SuccessResponse<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}
export default userAPI
