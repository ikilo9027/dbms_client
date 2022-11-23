import request from '../request'

export function getAuthId(requestBody) {
  return request({
    url: '/auth/authId',
    method: 'POST',
    data: requestBody
  })
}