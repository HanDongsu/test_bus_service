import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Link from "next/link";
import Router from "next/router";
import Badge from '@material-ui/core/Badge';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { signout } from "../lib/auth/actions";
import { Divider } from "@material-ui/core";
import { accessTokenName, getAccessToken } from "../utils/auth";
import { loadConsultantOne } from "../lib/consultant/actions";
// CSS 덮어쓰기 
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CallEventHandler from "./CallEventHandler";
import { saveConsultantState } from "../lib/consultant/actions";

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiTabs: {
      // Name of the rule
      root: {
        // Some CSS
        // backgroundColor: "green",
        // height: 27,
        // // minHeight:27,
        // padding: '0 30px',
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    },
  },
});

const useStyles = makeStyles(theme => ({
  '@global': {
    '.MuiTabs-indicator': {
      height: 3,
    }
  },
  root: {
    flexGrow: 1,
  },
  nav1: {
    backgroundColor: "#223152",
    display: "flex",
    boxShadow: 'none',
    transform: 'none',
    position: 'absolute',
    zIndex:1210,
    top:0,
    left:0,
  },
  nav2: {
    marginTop:60,
    backgroundColor: "#ffffff",
    height: 52,
    display: "flex",
    boxShadow: 'none',
  },
  tabs: { // 기본 Material-ui의 tab에 css가 있어서. 강제로 변경해줌.
    height: 52,
    minHeight: 27,
  },
  navTab: {  // 기본 Material-ui의 tab에 css가 있어서. 강제로 변경해줌.
    height: 52,
    minHeight:27,
    padding: 0,
    '&:hover': {
      color: '#6fc9ef',
      textShadow: 'initial',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: "center"
  },
  tabLink : {
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  allMenuWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    height: 60, 
  },
  bigLogoWrapper: {
    width: 80,
    height: 60,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  bigLogo: {
    width:80,
    height: 60,
    borderBottom: 'solid 1px #223152',
    borderTop: 'solid 1px #223152',
  },
  noticeWrapper: {
    width: 65,
    borderLeft: "1px solid #5e667b",
    borderRight: "1px solid #5e667b",
    textAlign: "center",
    paddingTop: 19,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  noticeLogoWrapper: {
      '&:hover': {
        cursor: 'pointer',
      },
  },
  noticeLogo: {
    width: 22,
    height: 22,
  },
  mypageLogoWrapper: {
    marginTop: 10,
    marginRight: 5,
      '&:hover': {
        cursor: 'pointer',
      },
  },
  loginLogoWrapper: {
    marginTop: 17,
    marginLeft:10,
      '&:hover': {
        cursor: 'pointer',
      },
  },
  menuWrapper: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  logoTopWrapper: {
    display: "flex",
  },
  rightMenuWrapper: {
    display: 'flex',
  },
  rightMenuTextColor: {
     color: '#3478a7',
  },
  csNameWrapper: {
    marginTop:21,
    marginLeft:19,
  },
  csName: {
    objectFit: "contain",
    fontFamily: "NotoSansCJKkr",
    fontSize: 13,
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: 1.15,
    letterSpacing: "normal",
    color: "#ffffff",
  },
  selectBoxWrapper: {
    marginTop:18,
    marginLeft:6,
  },
  // 커스텀 셀렉트 박스 만들기 
  selectBox: {
    width: 100,
    height: 24,
    border: "1px solid #d0d1d5", // 테두리
    backgroundColor: "#ffffff",
    background: "url(/static/selectbox.png)",  /* 화살표 모양의 이미지 */
    backgroundPosition: '90% 50%',
    backgroundSize: '8% 20%',
    backgroundRepeat: 'no-repeat',
    appearance: 'none',  // 화살표 삭제
    borderRadius: 0, // 둥근 테두리 제거
    paddingLeft: 9,
    color: '#8d939b',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  modalCSState: {
    position:"absolute" + ' !important',
    top:60 + 'px !important',
  },
  modalCSStateWrapper: {
    width: "100%",
    height: "100%",
    padding: "97px 20px 118px 20px",
    position: "relative",
    backgroundColor: "#717171",
    opacity: 0.5+ ' !important',
    borderBottom: "1px solid #717171",
  },
  inLineNumber: {
    textAlign: "center",
    color:"#ffffff",
    position: "absolute",
    right: 0,
    top: 0,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

// 네비게이션(헤더) 시작
const Nav = ({ auth, signoutCall, consultantOneLoad, consultantOne, loadConsultantState, consultantState }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { isSignin } = auth;
  const [adviserStatus, setAdviserStatus] = useState(0);
  const [callHandlerToNav, setCallHandlerToNav] = useState(0);
  const [consultantValue, setConsultantValue] = useState('');
  const [vocOpen, setVocOpen] = useState(false);
  const [operNum, setOperNum] = useState(false);
  const [phoneLineNum, setPhoneLineNum] = useState(false);
  const [openModalCSState, setOpenModalCSState] = useState(false);

  const handleChange = (event, newValue) => {
    if(newValue != 2){ // 콜센터 관리 새창 열기 
      setValue(newValue);
    }
  };
  
  const handleNavi = (path, newValue) => {
    Router.push(`/${path}`);
    if(newValue == 7){
      Router.push({pathname: '/info', query: { param: newValue }});
      setValue(1);
    };
  };

  const goHome = () => {
    Router.push(`/`)
    setValue(0);
  };


  function getData() {
    consultantOneLoad(getAccessToken());
  };

  // TODO : 설명 추가
  const handleAdvierStatus  = (e) => {
    consultantState(e.target.value); // 상담원상태를 redux 저장
  }

  const handleCloseModalCSState = () => {
    setOpenModalCSState(false);
  }

  const handleModalCSState = () => {
    setOpenModalCSState(true);
  }

  useEffect(() => {
    if(isSignin){
      getData();
    };
  }, []);

  useEffect(() => {
    if(Router.route === '/'){
      setValue(0);
    }else if(Router.route === '/info'){
      setValue(1);
    }else if(Router.route === '/signin'){
      setValue(0);
    }else if(Router.route === '/chart'){
      setValue(3);
    }

    if(consultantOne && consultantOne.data){
      setOperNum(consultantOne.data.operator_no);
      setPhoneLineNum(consultantOne.data.operator_ext_no);
    }

  }, [consultantOne, isSignin]);

  return (
    <div className={classes.root}>
    {isSignin ?  
    <div>
      <AppBar position="static" className={classes.nav1}>
          <div className={classes.allMenuWrapper}>
              <div className={classes.logoTopWrapper}>
                  <div className={classes.bigLogoWrapper} onClick={goHome}>
                    <img
                      src="/static/durutalogin.png"
                      alt="logo"
                      className={classes.bigLogo}
                    />
                  </div>
                {/* </Link> */}
                <div className={classes.noticeWrapper}>
                  <Badge
                    color="secondary"
                    overlap="circle"
                    className={classes.noticeLogoWrapper}
                    onClick={() => handleNavi('info', 7)}
                  >
                    <img
                    src="/static/notice@2x.png"
                    alt="logo"
                    className={classes.noticeLogo}
                    />
                  </Badge>
                </div>
              </div>
              
              <div className={classes.menuWrapper}>
                <div className={classes.rightMenuWrapper}>
                  <div className={classes.csNameWrapper} onClick={goHome}>
                    <span className={classes.csName}>{consultantOne && (consultantOne.data.employ_nm)}&nbsp;님</span>
                  </div>
                  <div className={classes.selectBoxWrapper}>
                    <select className={classes.selectBox} onChange={handleAdvierStatus}>
                      {consultantOne && loadConsultantState == 0 ? <option value="0" selected>업무</option> : 
                      <option value="0" >업무</option>}
                      {consultantOne && loadConsultantState == 2 ? <option value="2" selected>후처리</option> : 
                      <option value="2" >후처리</option>}
                      {consultantOne && loadConsultantState == 3 ? <option value="3" selected>휴식</option> : 
                      <option value="3" >휴식</option>}
                      {consultantOne && loadConsultantState == 4 ? <option value="4" selected>식사</option> : 
                      <option value="4" >식사</option>}
                      {consultantOne && loadConsultantState == 5 ? <option value="5" selected>자리비움</option> : 
                      <option value="5" >자리비움</option>}
                    </select>
                  </div>
                  <Link href="/">
                    <div onClick={() => signoutCall(operNum)} className={classes.loginLogoWrapper}>
                      <img src="static/logout.svg" alt="logout" />
                    </div>
                  </Link>
                </div>
                <div className={classes.inLineNumber}>내선번호&nbsp;:&nbsp;  
                {consultantOne && (consultantOne.data.operator_ext_no)} </div>
              </div>
            <CallEventHandler setNavToCallHandler={adviserStatus} setCallHandlerToNav={setCallHandlerToNav} phoneLineNum={phoneLineNum} operNum={operNum}/>
          </div>
      </AppBar>
      <Divider/>
      <AppBar position="static" className={classes.nav2}>
          <Tabs
            variant="fullWidth"
            value={value}
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="nav tabs"
            classes={{root: classes.tabs}}
          >
            <Tab value={0} className={classes.navTab} label="예약관리" onClick={() => handleNavi('', 0)} />
            <Tab value={1} className={classes.navTab} label="정보관리" onClick={() => handleNavi('info', 1)} />
            <Tab value={2} className={classes.navTab} label="콜센터 관리" onClick={()=> window.open("http://210.91.209.170/ipcc/multichannel/login/remote_login.jsp", "_blank")} />
            <Tab value={3} className={classes.navTab} label="통계관리" onClick={() => handleNavi('chart', 3)} />
            <Tab value={4} className={classes.navTab} label="기타" onClick={() => handleNavi('', 4)} />
          </Tabs>
        <Divider/>
      </AppBar>
      </div>
    : ''}
    </div>
  );
};

Nav.getInitialProps = async props => {
  const { store, isServer } = props;
  store.dispatch(loadConsultantOne());
  store.dispatch(saveConsultantState());
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
  }
  return { isServer };
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    consultantOne: state.consultant.logindata,
    loadConsultantState: state.consultant.cs_state,
  };
};

const mapDispatchToProps = dispatch => ({
  consultantOneLoad: (num) => dispatch(loadConsultantOne(num)),
  consultantState: (cs_state) => dispatch(saveConsultantState(cs_state)),
  signoutCall: (num) => dispatch(signout(num)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
