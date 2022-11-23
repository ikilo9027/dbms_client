import * as React from 'react';
import Box from '@mui/material/Box';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { styled } from '@mui/material/styles';
import styled2 from "styled-components";
// import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';

export default function FileItem({ data, getList, setPath, setCheckList, checkList }) {

  const [isChecked, setChecked] = React.useState(false);

  async function goToSubFolder(path) {
    setCheckList([])
    getList(path)
    setPath(path)
  }

  function handleChange(checked) {
    console.log(data)
    setChecked(checked)
    if (checked) {
      setCheckList([...checkList, data])
    } else {
      setCheckList(checkList.filter((el) => el !== data));
    }
  }

  function formatFileSize(x) {
    if (x === 0 || x.additional === undefined) {
      return 0
    } else {
      let size = x.additional.size
      let s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let e = Math.floor(Math.log(size) / Math.log(1024));
      return (size / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    }
  }

  const fileInfo = (
    <div className="text_box" style={{ textAlign: 'center', width: 'auto', margin: 'auto 0', }}>
      <div className="tb-thead-box" style={{ float: 'left', width: 'auto', textAlign: 'left' }}>
        <ul style={{ paddingLeft: 0 }}>
          <li style={liStyle}>이름 :</li>
          <li style={liStyle2}>크기 :</li>
        </ul>
      </div>
      <div className="tb-tbody-box" style={{ float: 'left', marginLeft: '3px', width: 'auto', textAlign: 'left' }}>
        <ul style={{ paddingLeft: 0 }}>
          <li style={liStyle}>{data.name}</li>
          <li style={liStyle2}>{formatFileSize(data)}</li>
        </ul>
      </div>
    </div>
  );

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} sx={{ width: "600px" }} />
  ))({
    [`& .MuiTooltip-tooltip`]: {
      background: '#000000a1',
      width: 'auto',
      height: '40px',
      textAlign: 'center',
      position: 'relative',
      bottom: '10px',
      margin: 'auto 0',
      fontSize: '1px',
      maxWidth: '1000px !important',
    },
  })

  const liStyle = {
    margin: '5px',
    listStyle: 'none',
    fontSize: '5px',
    marginLeft: '5px'
  }
  const liStyle2 = {
    display: 'none',
    margin: '5px',
    listStyle: 'none',
    fontSize: '5px',
    marginLeft: '5px'
  }

  const checkboxStyle = {
    display: data.path.lastIndexOf("/") === 0 ? 'none' : '',
    // width: '10px',
    position: 'relative',
    bottom: '100px',
    right: '10px',
  }

  const boxStyle = {
    width: 90,
    height: 90,
    // marginTop: '20px',
    // border: '1px solid #dddddd',
    textAlign: 'center',
    padding: '10px 15px',
    cursor: 'pointer',
    // backgroundColor: isChecked ? '#efefef' : 'none',
    '&:hover': {
      backgroundColor: '#efefef',
      opacity: [0.9, 0.8, 0.7],
    },
  }

  function fileTextStyle() {
    return {
      // border: '1px solid red',
      position: 'relative',
      bottom: '5px',
      right: '16px',
      fontSize: '9px',
      width: '90px',
      margin: '0 auto',
      // padding: '0 5px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }
  return (

    <div style={{ height: '90px' }}>
      <StyledTooltip title={fileInfo} enterDelay={1000} enterNextDelay={1000} >
        <Box
          sx={boxStyle}
          onDoubleClick={() => goToSubFolder(data.path)}
        >
          <FolderIcon style={{ color: 'orange', fontSize: '60px', display: data.isdir ? 'block' : 'none' }} />
          <InsertDriveFileOutlinedIcon style={{ color: '#ddd', fontSize: '60px', display: data.isdir ? 'none' : 'block' }} />
          <div style={fileTextStyle()}>{data.name}</div>
          <label htmlFor={data.name} />

        </Box>
      </StyledTooltip >
      <Checkbox
        type="checkbox"
        id={data.name}
        onChange={(e) => handleChange(e.target.checked)}
        checked={checkList.includes(data) ? true : false}
        style={checkboxStyle}
      />
    </div>
  );
}