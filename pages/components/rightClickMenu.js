import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import { deleteFile, downloadFile, copyPaste, renameFile } from '../api/modules/file'
import DialogRename from '../components/dialogRename'
import bufferToDataUrl from "buffer-to-data-url"

export default function IconMenu({ setOpen, getList, checkList, setCheckList, copyFile, setCopyFile, path, list, setIsLoading }) {
  const el = React.useRef();
  const [open2, setOpen2] = React.useState(false);
  let count = 0
  let duplicateList = []

  const handleCloseModal = e => {
    setOpen(false)
    // console.log('isOpenisOpen', isOpen);
    // if (isOpen && (!el.current || !el.current.contains(e.target))) { setOpen(false) }
  }
  React.useEffect(() => {
    window.addEventListener('click', handleCloseModal);
    return () => {
      window.removeEventListener('click', handleCloseModal)
    }
  }, []);
  function formatPath(filepath) {

    let indexOf = filepath.lastIndexOf("/");
    let path;
    if (indexOf == 0) {
      path = '/'
    } else {
      path = filepath.substr(0, indexOf)
    }
    return path
  }

  function onClickPaste() {
    if (copyFile.length !== 0) {
      fetchPaste(copyFile.files[count], path, copyFile.type)
    }
  }
  async function fetchPaste(file, path, type) {
    setIsLoading()
    let messageType = type == 'cut' ? '잘라넣기' : '복사'
    let request = {
      file: file,
      dest_folder_path: path,
      user_id: sessionStorage.getItem('userId'),
      type: type
    }
    await copyPaste(request).then((data) => {
      setIsLoading()
      if (data.data.duplicate) {
        duplicateList.push(data.data.duplicate)
      }
      if (copyFile.files.length - 1 === count) {
        count = 0
        setCheckList([]);
        if (duplicateList.length === 0) {
          alert(`${messageType}가 완료 되었습니다.`)
        } else if (duplicateList.length === copyFile.files.length) {
          alert('이미 동일한 파일명이 존재합니다.')
        } else {
          alert(`이름이 중복된 ${duplicateList.length}개를 제외한 파일 ${messageType}가 완료 되었습니다.`)
        }
        if (type == 'cut') { fetchDeleteFile(type) }
      } else {
        count++
        onClickPaste();
      }
      getList(path)
    }).catch((e) => {
      setIsLoading()
      getList(path)
      alert(e.response)
    })
  }

  function onClickCopy(type) {
    if (checkList.length !== 0) {
      let copyList = []
      checkList.forEach(file => {
        copyList.push(file)
      })
      let copyFile = {
        files: copyList,
        // dest_folder_path: path,
        type: type
      }
      setCopyFile(copyFile)
    }
  }
  function onClickDelete() {
    if (checkList.length !== 0) {
      if (confirm("정말 삭제하시겠습니까??") == true) {
        if (checkList.length !== 0) {
          fetchDeleteFile('delete')
        }
      }
    }
  }
  async function fetchDeleteFile(type) {
    setIsLoading()
    let pathList = []

    if (type === 'cut') {
      copyFile.files.forEach(file => {
        pathList.push(file.path)
      });
    } else {
      checkList.forEach(file => {
        pathList.push(file.path)
      });
    }
    let request = {
      file_path: pathList.join(","),
      data: type === 'cut' ? copyFile.files : checkList
    }

    await deleteFile(request).then((data) => {
      setIsLoading()
      setCheckList([]);
      getList(path)
      setOpen(false)
    })

  }
  function onClickRename() {
    if (checkList.length !== 0) {
      if (checkList.length === 1) {
        setOpen2(true)
      } else {
        alert('파일 변경은 1개씩만 가능합니다.')
      }
    }
  }

  function onClickDownload() {
    if (checkList.length !== 0) {
      fetchDownload(checkList[count])
    }
  }
  function fetchDownload(file) {
    setIsLoading()
    let request = {
      path: file.path
      // `["${filename}"]`
    }
    downloadFile(request).then((data) => {
      setIsLoading()
      if (checkList.length - 1 === count) {
        count = 0
        // getList(formatPath(checkList[0].path))
        setCheckList([]);
      } else {
        count++
        onClickDownload();
      }
      console.log(',data.data.buffer',)
      // bufferToDataUrl(data.data.type, data.data.buffer)
      let img_data = bufferToDataUrl(data.data.type, Buffer.from(data.data.buffer))
      // console.log('img_data------------', img_data)
      const downloadLink = document.createElement("a");
      downloadLink.href = img_data;
      downloadLink.download = file.name;
      downloadLink.click();
    })

  }
  return (
    <div ref={el}>
      <Paper
        sx={{
          width: 200,
          maxWidth: '100%',
          position: 'relation',
          boxShadow: '0px 0px 5px 4px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
        }}>
        <MenuList>
          <MenuItem onClick={() => onClickCopy('cut')}>
            <ListItemIcon sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>
              <ContentCut fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>Cut</ListItemText>
            {/* <Typography variant="body2" color="text.secondary">
              ⌘X
            </Typography> */}
          </MenuItem>
          <MenuItem onClick={onClickDelete}>
            <ListItemIcon sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>
              <DeleteOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>Delete</ListItemText>
            {/* <Typography variant="body2" color="text.secondary">
            ⌘X
          </Typography> */}
          </MenuItem>
          <MenuItem onClick={() => onClickCopy('copy')}>
            <ListItemIcon sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>Copy</ListItemText>
            {/* <Typography variant="body2" color="text.secondary">
            ⌘C
          </Typography> */}
          </MenuItem>
          <MenuItem onClick={onClickPaste}>
            <ListItemIcon sx={copyFile.length === 0 ? { color: '#ddd' } : { color: '' }}>
              <ContentPaste fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={copyFile.length === 0 ? { color: '#ddd' } : { color: '' }}>Paste</ListItemText>
            {/* <Typography variant="body2" color="text.secondary">
            ⌘V
          </Typography> */}
          </MenuItem>

          <Divider />
          <MenuItem onClick={onClickRename}>
            <ListItemIcon sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>
              <DriveFileRenameOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>Rename</ListItemText>
            {/* <Typography variant="body2" color="text.secondary">
            ⌘X
          </Typography> */}
          </MenuItem>
          <MenuItem onClick={onClickDownload}>
            <ListItemIcon sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>
              <FileDownloadOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={checkList.length === 0 ? { color: '#ddd' } : { color: '' }}>Download</ListItemText>
            {/* <Typography variant="body2" color="text.secondary">
            ⌘X
          </Typography> */}
          </MenuItem>
        </MenuList>
      </Paper>
      <DialogRename
        list={list}
        getList={getList}
        setOpen={setOpen2}
        open={open2}
        checkList={checkList}
        path={path}
        setCheckList={setCheckList}
      />
    </div>

  );
}