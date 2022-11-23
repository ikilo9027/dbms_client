import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import SearchTable from './searchTable'
import { selectAllFile } from '../api/modules/file';
import TextField from '@mui/material/TextField';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({ setOpenSearch, openSearch, getList, setPath }) {
  const [searchList, setSearchList] = React.useState([]);
  // const [keyword, setKeyword] = React.useState('');
  let keyword = ''

  const handleSearch = () => {
    fetchSelectAllFileList()
  };

  function onEnterSearch(e) {
    if (e.code === 'Enter') {
      fetchSelectAllFileList()
    }
  }

  async function fetchSelectAllFileList() {
    let request = {
      serch_keyword: keyword,
    }
    await selectAllFile(request).then((data) => {
      setSearchList(data.data)
    })
  }

  const handleClose = () => {
    setOpenSearch(false);
    keyword = ''
  };

  function searchKeyword(e) {
    console.log(e.target.value)
    keyword = e.target.value
  }

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  React.useEffect(() => {
    // getData('/vedio');
    fetchSelectAllFileList();
  }, []);

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openSearch}

      >
        <Search sx={{ textAlign: 'center' }} >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Search Keyword"
            variant="standard"
            fullWidth
            onChange={searchKeyword}
            defaultValue={keyword}
            sx={{ width: '70%' }}
            onKeyPress={onEnterSearch}
          />
          <Button
            variant="contained"
            color="primary"
            component="span"
            style={{ fontSize: "1px", left: '20px', height: '30px', margin: '20px 10px 20px 0' }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Search>

        <DialogContent dividers>
          <SearchTable searchList={searchList} getList={getList} setPath={setPath} setOpenSearch={setOpenSearch} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}