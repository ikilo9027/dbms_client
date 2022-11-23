import request from '../request'

export function downloadFile(requestBody) {
  return request({
    url: '/files/download',
    method: 'POST',
    data: requestBody
  })
}

export function getMainFolderList() {
  return request({
    url: '/files',
    method: 'POST',
    // data: requestBody
  })
}


export function selectAllFile(requestBody) {
  return request({
    url: '/files/search',
    method: 'POST',
    data: requestBody
  })
}

export function subFolderList(requestBody) {
  return request({
    url: '/files/sub_folder',
    method: 'POST',
    data: requestBody
  })
}

export function uploadFile(files) {
  return request({
    url: '/files/upload',
    method: 'POST',
    data: files,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })
}

export function createFolder(files) {
  return request({
    url: '/files/create_folder',
    method: 'POST',
    data: files,
  })
}

export function copyPaste(requestBody) {
  return request({
    url: '/files/copy_move',
    method: 'POST',
    data: requestBody
  })
}


export function deleteFile(requestBody) {
  return request({
    url: '/files/delete',
    method: 'DELETE',
    data: requestBody
  })
}

export function renameFile(requestBody) {
  return request({
    url: '/files/rename',
    method: 'PATCH',
    data: requestBody
  })
}

export function saveFile(requestBody) {
  return request({
    url: '/files/save',
    method: 'POST',
    data: requestBody
  })
}
