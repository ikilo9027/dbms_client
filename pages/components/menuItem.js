import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowRightTwoToneIcon from '@mui/icons-material/ArrowRightTwoTone';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import { subFolderList } from '../api/modules/file'

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function SimpleAccordion({ menuItem, getList, setPath, close }) {
  const [expanded, setExpanded] = React.useState(false);
  const [subList, setSubList] = React.useState([]);

  const handleChange = (panel) => (event, newExpanded) => {
    // console.log(event, newExpanded)
    setExpanded(newExpanded);
  };

  function goToSubFolder(data) {
    close()
    setExpanded(false)
    getList(data.path)
    setPath(data.path)
  }

  async function fetchGetSubFolder(path) {
    let request = {
      // file_path: `/${event.target.innerText}`
      file_path: path
    }
    await subFolderList(request).then((data) => {
      let folderList = data.data.files.filter(file => file.isdir);
      setSubList(folderList)
    })
  }

  React.useEffect(() => {
    // getData('/vedio');
    fetchGetSubFolder(menuItem.path)
  }, []);

  return (
    <div>
      <Accordion expanded={expanded} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{menuItem.name}</Typography>
        </AccordionSummary>
        {subList && subList.map((data, i) => (
          <MenuItem key={`submenu_${i}`} onClick={() => goToSubFolder(data)}>
            <ListItemIcon>
              <ArrowRightTwoToneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={{ transform: 'translate(-25%, 5%) scale(0.6)' }}>{data.name}</ListItemText>
          </MenuItem>
        ))}
      </Accordion>
    </div>
  );
}