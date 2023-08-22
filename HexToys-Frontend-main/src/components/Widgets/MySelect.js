import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';



const useStyles = makeStyles((theme) => ({
  root: {
    background: 'rgba(255, 255, 255, 0)',
    minWidth : 86,
    border : '1px #f0f solid',
    borderRadius : '8px !important',
    
    '&:hover': {
      
    },
    '&.light': {
      '& .MuiSelect-select': {
        color : '#333 !important',
      },
      '& .MuiSvgIcon-root': {
        color : '#333 !important',
  
      },
    },
    '&:hover fieldset': {
      borderColor: '#00000000 !important',
    },
    '& fieldset': {
      borderColor: '#00000000 !important',
    },
    '& .Mui-focused': {
      borderColor: '#00000000 !important',
    },
    '& .MuiSelect-select': {
      color : '#eee !important',
      minHeight: '20px !important',
      padding : '5px 32px 5px 8px !important',
      fontSize : 16,
      fontWeight : 600,
      [theme.breakpoints.down('sm')]: {
        fontSize : 14,
      },
      
    },
    '& .MuiSvgIcon-root': {
      color : '#aaa !important',

    },
    '& .MuiMenu-list': {
      background: 'rgba(255, 255, 255, 0.1) !important',
    },
    
  },
  select: {
    borderRadius : '10px !important',
    backgroundColor: "#ffffff55 !important",
    backdropFilter: 'blur(10px)',
    marginTop : 5,
    maxHeight : '200px !important',
    "& ul": {
        
    },
    "& li": {
      transition : 'all 0.3s ease',
      textAlign : 'left !important',
      color : '#eee',
      display : 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontSize : 14,
      padding : '10px 10px',
      '&:hover': {
        backgroundColor: "#49566c33",
      },
      "& span": {
        display : 'flex',
        alignItems: 'center',
        gridArea : 'auto',
        gap : 8,
      },
    },
    "&.light": {
      "& li": {
        color : '#333 !important',
      }
    },
  },
  
}));

const MySelect = ({className, value, onChange, options}) => {
  const classes = useStyles();

  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <Select
      value={value}
      defaultValue = {value}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      className = {clsx(classes.root, className)}
      MenuProps={{ classes: { paper: clsx(classes.select, className) } }}
    >
      {options.map((d, k)=>(
        <MenuItem value={d?.value} key = {k}>{d?.label}</MenuItem>
      ))}
    </Select>
  );
};

export default MySelect;
