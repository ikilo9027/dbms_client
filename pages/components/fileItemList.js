import FileItem from './fileItem'
import RightClickMenu from './rightClickMenu'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';


export default function FileItemList({ list, getList, setPath, path, setIsLoading }) {
  const [mouseX, setMouseX] = React.useState();
  const [mouseY, setMouseY] = React.useState();
  const [isOpen, setOpen] = React.useState(false);
  const [checkList, setCheckList] = React.useState([]);
  const [copyFile, setCopyFile] = React.useState([]);
  let x, y


  function handleRight(e) {
    setMouseX(x)
    setMouseY(y)
    setOpen(true)
  }

  function handleMousemove(e) {
    if (e.y < 380) {
      x = e.pageX
      y = e.pageY - window.scrollY
    } else {
      x = e.pageX
      y = e.pageY - window.scrollY - 250
    }

  }

  function onCheckedAll(checked) {
    if (checked) {
      const checkedListArray = [];
      list.forEach(data => {
        checkedListArray.push(data);
      });
      setCheckList(checkedListArray)
    } else {
      setCheckList([])
    }
  }

  const ScrollDiv = styled('div')(({ theme }) => ({
    marginTop: '20px',
    height: '450px',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': { width: "3px" },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#c9c9c9', borderRadius: '20px' },
    '&::-webkit-scrollbar-track': { backgroundColor: '#fafafa' },
  }));
  React.useEffect(() => {
    window.addEventListener('contextmenu', handleRight);
    window.addEventListener('mousemove', handleMousemove);
    return () => {
      window.removeEventListener('contextmenu', handleRight)
      window.removeEventListener('mousemove', handleMousemove);
    }
  }, []);

  return (
    <div>
      {/* <ScrollDiv > */}
      {list && list.map((data, i) => (
        <div style={{ float: 'left' }} key={`fileList_${i}`}>
          <FileItem
            data={data}
            getList={getList}
            setPath={setPath}
            setCheckList={setCheckList}
            checkList={checkList}
          />
        </div>
      ))}
      <div style={{ position: 'fixed', top: mouseY, left: mouseX, display: isOpen ? 'block' : 'none' }} >
        <RightClickMenu
          setOpen={setOpen}
          getList={getList}
          checkList={checkList}
          setCheckList={setCheckList}
          copyFile={copyFile}
          setCopyFile={setCopyFile}
          path={path}
          list={list}
          setIsLoading={setIsLoading} />
      </div>
      {/* </ScrollDiv> */}
      <Checkbox
        type="checkbox"
        sx={{
          '& .MuiSvgIcon-root': { fontSize: 25 },
          position: 'absolute',
          top: 69,
          left: 10,
          display: path === '/' ? 'none' : 'block',
        }}
        onChange={(e) => { onCheckedAll(e.target.checked) }}
        checked={checkList.length === 0 ? false : checkList.length === list.length ? true : false}
      />
      {/* <CircularIndeterminate isOpen={isLoading} /> */}
    </div>
  );
}