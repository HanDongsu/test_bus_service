import React, { useEffect } from "react";
import { createBrowserHistory } from 'history';
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from '@material-ui/core/Dialog';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import { signin } from "../lib/auth/actions";
// import { signinError } from "../lib/auth/actions";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: 132,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  durutaLogo: {
    width: 128,
    height: 128,
  },
  titleText: {
    marginTop: 12,
    marginBottom: 30,
    // width: 297,
    height: 32,
    fontFamily: 'NotoSansCJKkr',
    fontSize: 34,
    fontWeight: 500,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 0.94,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: "#212121",
  },
  textField: {
    marginBottom: 10,        
    width: 385,
    height: 56,
    webkitAppearance: 'none',
  },
  submit: {
    marginTop: 10,
    width: 385,
    height: 66,
    color: '#ffffff',
    fontFamily: 'NotoSansCJKkr',
    fontSize: 18,
    fontWeight: 500,
    backgroundColor: '#223152',
  }
}));

const Signin = ({ signinProp, auth }) => {
  const classes = useStyles();
  //const history = createBrowserHistory();
  //const location = history.location;
  // console.log(auth);
  // const { sample } = props;
  // const { history } = useReactRouter(); 
  const [open, setOpen] = React.useState(true);
  const [retry, setRetry] = React.useState(false);
  const [errmsg, setErrmsg] = React.useState('');
  const [values, setValues] = React.useState({
    extensionNum:'',
    userid: '',
    password: '',
    showPassword: false,
  });
  // const { signinError } = auth;
  
  // console.log("==========signinError=========");
  // console.log(auth);
  
  // if(auth.error){
  //   console.log(auth.error.response.data.message);
  //   setErrmsg(auth.error.response.data.message);
  // }

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleChangeNum = prop => e => {
    // 숫자만 입력 
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setValues({ ...values, [prop]: e.target.value });
    }
  };

  useEffect(() => {
    // console.log("UseEffect !!! ReservationList");
    // window.location.href = '/';
    // history.push('/content');
    // history.push('/');
    if(auth.error.response){
    // console.log(auth.error.response.data.message);
    setErrmsg(auth.error.response.data.message);
    }
  }, [auth.error]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  // 로그인 Submit
  const handleSignin = () => {
    event.preventDefault();
    // console.log(event);

    const extension = event.target.extension.value;
    const userid = event.target.userid.value;
    const password = event.target.password.value;
    // alert(extension+' : '+userid+' : '+password);

    // const data = new FormData();
    const data = {
      userid: userid,
      password: password,
      extension: extension,
    }
    // data.append("employ_id", userid);
    // data.append("employ_pw", password);
    
    // console.log(data);
    if (userid && password && extension) {
      
      signinProp(data);
      // console.log('---------- data -----------');
      // const signToken = Buffer.from(`${userid}:${password}`).toString(
        //   "base64"
        // );
      // console.log(signToken);
      //signinProp(signToken);
    }
    setRetry(true);
    return false;
    // Router.push(`/`);
    
  };

  ///////////  토큰을 사용할 경우 
  // const handleSignin = event => {
    // event.preventDefault();
    // console.log(event);
    // const username = event.target.username.value;
    // const password = event.target.password.value;
    // if (username && password) {
    //   const signToken = Buffer.from(`${username}:${password}`).toString(
    //     "base64"
    //     );
    //     console.log(signToken);
    //     signinProp(signToken);
    //   }
    //   return false;
  //   };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button> */}
      <CssBaseline />
      <Container fixed>
      <Dialog fullScreen open={open}>
       <div className={classes.paper}>
          <img src="/static/durutalogin.png" alt="두루타로고" className={classes.durutaLogo}/>
          <Typography className={classes.titleText}>
            두루타 시스템 로그인 
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSignin}>
            <Grid container wrap="nowrap" direction='column'>
            <TextField
              variant="outlined"
              margin="none"
              // label="내선번호"
              value={values.extensionNum}
              onChange={handleChangeNum('extensionNum')}
              id="extension"
              autoComplete="extension"
              autoFocus
              placeholder="내선번호"
              fullWidth
              type="string"
              //helperText="밑에 글씨1"
              className={classes.textField}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                    <img src="/static/login-call.svg" alt="내선번호입력"/>
                  </InputAdornment>,
              }}
            />
            <TextField
              variant="outlined"
              margin="none"
              id="userid"
              value={values.userid}
              onChange={handleChange('userid')}
              placeholder="아이디"
              fullWidth
              className={classes.textField}
              //helperText="밑에 글씨2"
              InputProps={{
                startAdornment: <InputAdornment position="start">
                    <img src="/static/login-id.svg" alt="아이디입력"/>
                  </InputAdornment>,
              }}
            />
            <TextField
              variant="outlined"
              margin="none"
              id="password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              placeholder="비밀번호"
              fullWidth
              className={classes.textField}
              //helperText="밑에 글씨3"
              InputProps={{
                startAdornment: <InputAdornment position="start">
                    <img src="/static/login-pw.svg" alt="비밀번호입력"/>
                  </InputAdornment>,
                endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  
              }}
            />
            {auth.error && retry ? <div style={{color:"#d62b28", marginLeft:20}}> {errmsg}
                {/* 아이디와 비밀번호를 확인해주세요. */}
            </div> : ''}

            {(values.extensionNum && values.userid && values.password) == '' ?
                <Button
                  fullWidth
                  // onClick={handleSignin}
                  variant="contained"
                  className={classes.submit}
                  disabled
                  >로그인</Button>
              :
                <Button
                  type="submit"
                  fullWidth
                  // onClick={handleSignin}
                  variant="contained"
                  className={classes.submit}
                  >로그인</Button>
              }
              </Grid>
            {/* <TextField
              variant="outlined"
              margin="normal"
              // required
              fullWidth
              id="userid"
              label="아이디"
              name="userid"
              autoComplete="userid"
            />
            <TextField
              variant="outlined"
              margin="normal"
              // required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
            /> */}
           
          </form>
      </div>
            
      </Dialog>
      </Container>
      </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => ({
  signinProp: data => dispatch(signin(data))
});
// export default Sample;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signin);
