import { Button } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import Drawer from './components/drawer';
import Category from './components/category';
import { getMainFolderList, subFolderList, saveFile, uploadFile } from './api/modules/file'
import * as React from 'react';
import CircularIndeterminate from './components/circularIndeterminate';
import Drag from './components/testDrag'

export default function MainBoard() {
  const [list, setList] = React.useState([]);
  const [path, setPath] = React.useState("/");
  const [main, setMain] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  let mainFolder = []
  let mainCount = 0
  let subFiles = []
  let files = []
  let count = 0
  let duplicateList = []

  function fetchUploadFile(file_data) {
    handleClickLoading()
    const formdata = new FormData()
    formdata.append('file', file_data)
    formdata.append('user_id', sessionStorage.getItem('userId'))
    formdata.append('access_token', sessionStorage.getItem('accessToken'))
    formdata.append('file_path', path)
    // form.append('file', files[0].buffer, files[0].originalname);
    uploadFile(formdata).then((data) => {
      handleClickLoading()
      getSubFolerList(path)
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
      handleClickLoading()
      files = []
      console.log(e.response)
    })
  }

  function onClickUploadBtn() {
    fetchUploadFile(files[count])
  }

  function handleDragover(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
  }

  function handleDrop(e) {
    if (e.preventDefault) {
      e.preventDefault();
      files = [...e.dataTransfer?.files];
      if (path !== '/') {
        onClickUploadBtn()
      }
    }
  }

  const handleClickLoading = () => {
    setIsLoading((prevLoading) => !prevLoading);
  };

  async function onClickSave() {
    console.log('subFiles------', subFiles)
    await saveFile(subFiles).then((data) => {
      alert(data.data)
    })
  }

  function onClickSelect() {
    subFiles = []
    fetchSaveFile({ path: path })
  }
  async function fetchSaveFile(data) {
    let that = this;
    let request = {
      file_path: data.path
    }

    await subFolderList(request).then((file, i) => {


      // console.log("subFiles-------------", subFiles)
      file.data.files.forEach((file) => {
        mainCount++
        console.log(file.name, file.path, mainCount)
        subFiles.push(file)
        if (file.isdir) {
          fetchSaveFile({ path: file.path })
        }
      })

    }).catch((e) => {
      // setSaveList([])
      console.log(e.response)
    })
  }

  function changePath(e) {
    setPath(e)
    if (e == '/') {
      getMainFolerList()
    } else {
      getSubFolerList(e)
    }
  }

  async function getMainFolerList() {
    // let request = {
    //   sid: 'NNR0J9Nrywh7I2UVBNF9RW4xzNITvOFh_9FIcsCDVboeyb8sOwAW6CXuS7i-HC9urUyFdZ12rJosYiY66CZLUg'
    // }
    handleClickLoading()
    await getMainFolderList().then((res) => {
      handleClickLoading()
      res.data.data.shares.forEach((folder, i) => {
        folder.id = i + 1
      })
      mainFolder = res.data.data.shares
      setMain(mainFolder)
      setList(mainFolder)
    }).catch((e) => {
      handleClickLoading()
    })
  }

  async function getSubFolerList(path) {
    handleClickLoading()
    let request = {
      file_path: path
    }
    await subFolderList(request).then((res) => {
      handleClickLoading()
      res.data.files.forEach((folder, i) => {
        folder.id = i + 1
      })
      setList(res.data.files)
    }).catch((e) => {
      handleClickLoading()
    })
  }

  React.useEffect(() => {
    // getData('/vedio');
    getMainFolerList();
    setIsAdmin(sessionStorage.getItem('userId') === '설창환')
    window.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    const preventGoBack = () => {
      history.pushState(null, '', location.pathname);
      console.log('prevent go back!');
    };

    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);

    return () => window.removeEventListener('popstate', preventGoBack);
  }, []);
  React.useEffect(() => {
    window.addEventListener('dragover', handleDragover);
    window.addEventListener('drop', handleDrop);
  }, [path]);

  return (
    <div>

      <div style={{ marginTop: '70px' }}>
        {/* <Upload /> */}
        <Category path={path} setPath={changePath} list={list} getList={getSubFolerList} setIsLoading={handleClickLoading} />
      </div>
      <div style={{ marginTop: '40px', textAlign: 'center', display: isAdmin ? 'block' : 'none' }} >
        <Button variant="contained" sx={{ width: '100px' }} onClick={onClickSelect} >Select</Button>
        <Button variant="contained" sx={{ width: '100px' }} onClick={onClickSave} >Save</Button>
      </div>

      <div>
        <StyledEngineProvider>
          <Drawer fileList={list} getList={getSubFolerList} setPath={setPath} path={path} mainFolders={main} setIsLoading={handleClickLoading} />
        </StyledEngineProvider>
      </div>
      <CircularIndeterminate isOpen={isLoading} />
      {/* <Drag /> */}
    </div >
  )
}
