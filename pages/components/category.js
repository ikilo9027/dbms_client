import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import ButtonGroup from '@mui/material/ButtonGroup';
import FileUpload from './fileUpload';
import DialogNewFolder from './dialogNewFolder'
import * as React from 'react';

export default function Category({ path, setPath, list, getList, setIsLoading }) {



  function onChangefilePath(e) {
    console.log('ssss', e)
    setPath(e.target.value)
  }

  const onKeyPress = (e) => {
    if (e.code == 'Enter') {

    }
  }

  function onClickArrowBack() {
    let indexOf = path.lastIndexOf("/");
    if (indexOf == 0) {
      setPath("/")
    } else {
      setPath(path.substr(0, indexOf))
    }
  }

  const arrowBackStyle = {
    color: path == '/' ? '#ddd' : 'black',
    border: '1px solid #ddd',
    padding: '5px',
    borderRadius: '3px 0px 0px 3px',
    height: '30px',
    width: '32px',
    cursor: 'pointer'
  }

  const arrowForwardStyle = {
    borderWidth: '1px 1px 1px 0px',
    border: '1px solid #ddd',
    padding: '5px',
    borderRadius: '0px 3px 3px 0px',
    height: '30px',
    width: '32px',
    cursor: 'pointer'
  }

  const inputBoxStyle = {
    border: '1px solid #ddd',
    width: '400px',
    height: '30px',
    borderRadius: '3px',
    float: 'left',
    padding: '0 10px'
  }
  return (
    <div style={{ padding: '5px 10px', width: '700px', marginLeft: '40px' }}>
      <div style={{ float: 'left', marginRight: '10px' }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <ArrowBackIosNewIcon style={arrowBackStyle} onClick={onClickArrowBack} />
          {/* <ArrowForwardIosIcon style={arrowForwardStyle} /> */}
        </ButtonGroup>
      </div>
      <div >
        <input type="text" onChange={onChangefilePath} onKeyPress={onKeyPress} value={path} style={inputBoxStyle}></input>
      </div>

      <DialogNewFolder path={path} list={list} getList={getList} />
      <FileUpload getList={getList} path={path} setIsLoading={setIsLoading} />
    </div>
  );
}