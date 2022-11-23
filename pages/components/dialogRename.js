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
import { renameFile } from '../api/modules/file'
import { ResetTv } from '@mui/icons-material';

export default function FormDialog(props) {
  let fileName = props.checkList.length === 0 ? '' : props.checkList[0].name
  let originFileName = props.checkList.length === 0 ? '' : props.checkList[0].name

  function newFolederName(e) {
    fileName = e.target.value
  }

  const handleClose = () => {
    props.setOpen(false);
  };

  function onEnterRename(e) {
    if (e.code === 'Enter') {
      handleRename()
    }
  }

  const handleRename = () => {
    let rule = new RegExp(`\\.(${originFileName.substr(originFileName.lastIndexOf(".") + 1)})$`)
    if (props.checkList.length === 1) {
      if (props.checkList[0].isdir) {
        fetchRename()
      } else {
        if (rule.test(fileName)) {
          fetchRename()
        } else {
          alert('올바른 확장자가 아닙니다.')
          reset()
        }
      }
    } else if (props.checkList.length === 0) {
      alert('변경할 파일을 선택 해주세요.')
    } else {
      alert('파일 변경은 1개씩만 가능합니다.')
    }
  };

  async function fetchRename() {
    let request = {
      file_name: fileName,
      file_path: props.checkList[0].path,
      data: props.checkList
    }
    let check = /^[0-9]+$/;

    if (fileName === undefined || fileName === '') {
      alert('파일명을 입력해주세요.')
    } else if (check.test(fileName.substr(0, fileName.lastIndexOf('.')))) {
      alert('숫자로만 입력할 수 없습니다.')
    } else {
      await renameFile(request).then((data) => {
        props.getList(props.path)
        reset()
        alert('이름이 변경되었습니다.')
      }).catch(e => {
        reset()
        let message;
        if (!e.response) {
        } else if (e.response.data.error.code === 1200) {
          message = '이미 존재하는 파일 명입니다.'
        } else {
          message = '확장자가 잘못 입력 되었습니다.'
        }
        alert(message)
      })
    }
  }
  function reset() {
    props.setCheckList([])
    props.setOpen(false);
  }

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Folder Name"
            type="email"
            fullWidth
            variant="standard"
            onChange={newFolederName}
            defaultValue={fileName}
            onKeyPress={onEnterRename}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRename}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}