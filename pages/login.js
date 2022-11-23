import * as React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { getAuthId } from './api/modules/auth'
import router from "next/router";
import CircularIndeterminate from './components/circularIndeterminate';

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function onClickLogin() {
    fetchLogin()
  }

  function onEnterLogin(e) {
    if (e.code === 'Enter') {
      fetchLogin()
    }
  }

  async function fetchLogin() {
    setIsLoading(true)
    // test_id : 설창환
    // test_pass : qaz1206@@
    let request = {
      user_id: values.userId,
      user_passwd: values.password
    }
    if (values.userId === undefined || values.userId === '') {
      alert('아이디를 입력해주세요.')
    } else if (values.password === undefined || values.password === '') {
      alert('비밀번호를 입력해주세요.')
    } else {
      await getAuthId(request).then((res) => {
        setIsLoading(false)
        sessionStorage.setItem('accessToken', res.data.data.sid);
        sessionStorage.setItem('userId', values.userId);
        router.push('/mainBoard')
      }).catch((e) => {
        setIsLoading(false)
        if (!e.response.data.success) {
          alert('로그인 정보를 확인해주세요.')
        }
      })
    }
  }
  React.useEffect(() => {
    const preventGoBack = () => {
      history.pushState(null, '', location.pathname);
      console.log('prevent go back!');
    };

    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);

    return () => window.removeEventListener('popstate', preventGoBack);
  }, []);
  const login_box = {
    // border: '1px solid blue',
    width: '300px',
    height: '500px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
  const login_id_box = {
    // border: '1px solid red',
    textAlign: 'center'
  }

  return (
    <div style={login_box}>
      <div className="login_logo"></div>

      <div style={login_id_box} >
        <TextField
          label="User Id"
          id="outlined-basic"
          sx={{ m: 2, width: '30ch', marginTop: ' -4px', }}
          onChange={handleChange('userId')}
          variant="outlined"
          onKeyPress={onEnterLogin}
        />
        <FormControl sx={{ mb: 3, width: '30ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" style={{}}>Password</InputLabel>
          <OutlinedInput
            id="outlined-basic"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            onKeyPress={onEnterLogin}
            // style={{ height: "40px", top: '7px' }}
            endAdornment={
              <InputAdornment position="end" >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"

                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button variant="contained" sx={{ width: '250px' }} onClick={onClickLogin} >Login</Button>
      </div>
      <CircularIndeterminate isOpen={isLoading} />
    </div >
  )
}
