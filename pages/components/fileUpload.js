import { Button } from '@mui/material';
import { uploadFile } from '../api/modules/file'
import CircularIndeterminate from './circularIndeterminate';
import React from 'react';
// import Button from '@material-ui/core/Button';


export default function FileUpload({ getList, path, setIsLoading }) {
  let files = []
  let count = 0
  let duplicateList = []

  function onInputChange(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      const f = e.target.files[i]
      files.push(f)
    }
    e.target.value = '';
    onClickUploadBtn()
  }
  function onClickUploadBtn() {
    fetchUploadFile(files[count])
  }
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  function fetchUploadFile(file_data) {
    UploadContext
    setIsLoading()
    const formdata = new FormData()
    formdata.append('file', file_data)
    formdata.append('user_id', sessionStorage.getItem('userId'))
    formdata.append('access_token', sessionStorage.getItem('accessToken'))
    formdata.append('file_path', path)
    // form.append('file', files[0].buffer, files[0].originalname);
    uploadFile(formdata).then((data) => {
      setIsLoading()
      getList(path)
      if (data.data.duplicate) {
        duplicateList.push(data.data.duplicate)
      }

      if (files.length - 1 === count) {
        count = 0
        if (duplicateList.length !== files.length) {
          if (duplicateList.length === 0) {
            alert('업로드가 완료 되었습니다.')
          } else {
            alert(`이름이 중복된 ${duplicateList.length}개를 제외한 파일 업로드가 완료 되었습니다. `)
          }
        } else {
          alert('이름이 중복된 파일은 업로드가 되지 않습니다.')
        }
      } else {
        count++
        onClickUploadBtn();
      }

    }).catch((e) => {
      setIsLoading()
      files = []
      console.log(e.response)
    })
  }
  return (
    <div style={{
      display: path == '/' ? 'none' : 'block',
      width: 100,
      float: 'left'
    }}>
      <input
        type="file"
        multiple={true}
        style={{ display: 'none' }}
        id="contained-button-file"
        onChange={onInputChange}
      />
      <label htmlFor="contained-button-file" >
        <Button variant="contained" color="primary" component="span" style={{ fontSize: "1px", left: '20px', height: '30px' }}>
          Upload
        </Button>
      </label>
      {/* <CircularIndeterminate isOpen={isLoading} /> */}
    </div>
  )
}
