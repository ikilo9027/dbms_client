import * as React from 'react';
import Button from '@mui/material/Button';
// import CoreButton from '@material-ui/core/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Tooltip from '@mui/material/Tooltip';
import { createFolder } from '../api/modules/file'

export default function FormDialog({ path, list, getList }) {
  const [open, setOpen] = React.useState(false);
  let fileName

  function newFolederName(e) {
    fileName = e.target.value
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    fetchCreateFolder()
  };

  async function fetchCreateFolder() {
    let request = {
      folder_path: path,
      folder_name: fileName,
      user_id: sessionStorage.getItem('userId')
    }
    let overlap = list.filter((file) => file.name === request.folder_name)
    if (fileName === undefined || fileName === '') {
      alert('폴더명을 입력해주세요.')
    } else {
      if (overlap.length > 0) {
        alert('동일한 폴더명이 존재합니다.')
      } else {
        await createFolder(request).then((res) => {
          setOpen(false);
          if (res.data.success) {
            getList(path)
          }
        }).catch((e) => {
          if (e.response.data.error.code === 400) {
            alert('파일명을 다시 입력 해주세요.')
          }
        })
      }
    }

  }

  function onEnterCreate(e) {
    if (e.code === 'Enter') {
      fetchCreateFolder()
    }
  }

  const CreateFolderStyle = {
    height: '30px',
    // color: '#3c3c3c',
    cursor: 'pointer',
    display: path == '/' ? 'none' : 'block',
    float: 'left',
    fontSize: "1px",
    left: '10px'
    // border: '1px solid red'
    // margin: '5px'
  }

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Button style={CreateFolderStyle} variant="contained" color="primary" component="span" onClick={handleClickOpen} >
        New Folder
      </Button>
      {/* <Tooltip title="Create Folder">
        <AddBoxOutlinedIcon fontSize="large"  />

      </Tooltip> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Folder Name"
            type="email"
            fullWidth
            variant="standard"
            onChange={newFolederName}
            onKeyPress={onEnterCreate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}