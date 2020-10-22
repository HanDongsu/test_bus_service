import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import Router from "next/router";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// 컴포넌트
import ReserveStatistics from "../components/statistics/ReserveStatistics";
import RiderStatistics from "../components/statistics/RiderStatistics";
import DriverStatistics from "../components/statistics/DriverStatistics";
import OperatorStatistics from "../components/statistics/OperatorStatistics";

const useStyles = makeStyles(theme => ({
  '@global': {
    '.Mui-selected': {
      color: '#4fa0cb',
    },
    '.MuiTab-wrapper': {
      alignItems: 'stretch',
      paddingLeft: 30,
    },
  },
  root: {
    height: '100%',
    minHeight: 687,
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    //border: '1px solid red',
  },
  container1: {
    width: 209,
    backgroundColor:'#f5f6f8',
    //border: '1px solid blue',
  },
  container2: {
    minWidth: 1070,
    width: '100%',
    minHeight: 687,
    height: '100%',
  },
  BigInfoText:{
    height: 87,
    width: '100%',
    fontSize: 28,
    paddingLeft:29,
    paddingTop:29,
    transform: 'perspective(100px) translateZ(0px)', // 가상의 100의 공간을 뒤에 만들고 현재 z = -100위치 
    transition: 'transform 200ms linear', // fade 효과
    '&:hover': {
      cursor: 'pointer',
      transform: 'perspective(100px) translateZ(4px)',
    },
  },
  tabs: {
    alignItems: 'stretch',
  },
  navTab: {  // 기본 Material-ui의 tab에 css가 있어서. 강제로 변경해줌.
    height: 48,
    borderBottom: '1px solid #e1e4e8',
    fontSize: 14,
    fontColor: '#212121',
    padding: 0,
    textAlign: 'left',
    alignItems: 'stretch',
    '&:hover': {
      color: '#4fa0cb',
      textShadow: 'initial',
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Chart = () => {
  const classes = useStyles();
  const router = useRouter()
  const [value, setValue] = React.useState(0);
  // console.log(router.query.param);

  useEffect(() => {
    if(router.query.param == 7){
      handleChange('', 7);
    }else{
      handleChange('', 0);
    }
  }, [router.query.param]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const goInfo = () => {
    Router.push("/info")
    handleChange('', 0);
    // setValue(0);
  };
  
  // console.log("]-----] member [-----[ ", member);

  return (
    <div className={classes.root}>
      <Grid className={classes.container1}>
          <div className={classes.BigInfoText} onClick={goInfo}>통계관리 </div>
          <Tabs
          disableripple="true"
          disablefocusripple="true"
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          // aria-label="Vertical tabs example"
          className={classes.tabs}
          >
          <Tab className={classes.navTab} style={{borderTop: '1px solid #e1e4e8'}} label="예약 통계" {...a11yProps(0)} />
          <Tab className={classes.navTab} label="회원 통계" {...a11yProps(1)} />
          <Tab className={classes.navTab} label="승무사원 통계" {...a11yProps(2)} />
          <Tab className={classes.navTab} label="상담원 통계" {...a11yProps(3)} />
        </Tabs>
      </Grid>
      <Grid className={classes.container2}>
        <TabPanel value={value} index={0}>
          <ReserveStatistics/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RiderStatistics/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <DriverStatistics/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <OperatorStatistics/>
        </TabPanel>
      </Grid>
    </div>
  );

};

// Info.getInitialProps = ({query})  => {
//   return {query};
// };

// Info.getInitialProps = async props => {
//   const { store, isServer } = props;
//   store.dispatch(loadBusData());
//   store.dispatch(loadMemberData());
//   if (isServer) {
//     /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
//   }
//   return { isServer };
// };

// const mapStateToProps = state => {
//   return {
//     // member: state.member.data,
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   // memberLoad: () => dispatch(loadMemberData()),
// });

// export default compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   ),
//   withAuthSync
// )(Info);


export default Chart;