import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import Pagination from "material-ui-flat-pagination";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Portal from '@material-ui/core/Portal';
import { Divider } from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import CircularProgress from "@material-ui/core/CircularProgress";

// import FormLabel from '@material-ui/core/FormLabel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Radio from '@material-ui/core/Radio';
// import Paper from '@material-ui/core/Paper';

import { loadContents } from "../lib/content/actions";
import { loadBusData } from "../lib/buslist/actions";
import { withAuthSync } from "../utils/auth";
import request from "../lib/request";

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// if (typeof Highcharts === 'object') {
//   HighchartsExporting(Highcharts)
// }

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0),
    width:"100%",
    height: 700,
    marginLeft: 30,
  },
  paging: {
    textAlign: "center"
  },
  dialogPpaper: {
    width: "100%"
  },
  buttonWrap: {
    marginBottom: 10
  },
  slider: {
    height: 500,
    width: 400,
    border: '1px solid black',
    position:'relative',
    // float: 'center',
  },
  scroll: {
    overflow: 'auto',
    border: '1px solid red',
    margin: 10,
    padding: 10,
    height: 60,
    // overflowX: 'scroll',
    // overflowY: 'scroll',
  },
  scrollvertical: {
    overflow: 'auto',
    border: '1px solid red',
    margin: 10,
    padding: 10,
    height: 300,
  },
  verticalLine: {
    borderRight: '2px solid gray',
    margin: 4,
    paddingTop: 10,
    paddingBottom: 10,
  },
  horizontalLine: {
    borderTop: '2px solid gray',
    margin: 4,
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
  },
  tiny:{
    width: 12,
    height: 15,
    padding: 4,
    backgroundColor: "green",
    border: '1px solid white',
      "&:hover": {
        backgroundColor: "yellow",
        cursor: 'pointer',
      }
  },
}));

const Content = ({ buslist , contentsLoad, contents, loading }) => {
  const classes = useStyles();
  const router = useRouter();
  const defaultPageSize = 12;
  const [show, setShow] = React.useState(false);
  const container = React.useRef(null);
  const [loadingSave, setLoadingSave] = React.useState(false);

  const [page, setPage] = useState(false);
  const [phone, setPhone] = useState('');

  // const { content, pageable, totalElements } = contents;

  const handleClick = () => {
    setShow(!show);
  };

  const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      data: [1, 5, 80]
    }]
  }
  
  // const handleChange = event => {
  //   const value = event.target.value;
  //   if (numberRegex.test(value)) {
  //     setPositionMembers(value);
  //     handleChange(clubMemberInfo, value);
  //   }
  // };

  // const phoneFomatter = event => {
  //   var formatNum = "";

  //   console.log(event.target.value);
  //   var e = event.target.value;
  //   if(e.replace(/\-/g,'').length < 12){
  //     if (/^[0-9]*$/.test(e)) {
  //       formatNum = e.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  //       setPhone(formatNum);
  //     }else if(/^[0-9]*$/.test(formatNum.replace(/\-/g,''))){
  //       setPhone(formatNum);
  //     } 
  //   }
  // }
  
  const phoneFomatter = event => {

    var e = event.target.value;    
    var tel = "";
    var number = e.replace(/[^0-9]/g, "");

    if(number.length < 4) {
        tel += number;
        setPhone(tel);
    } else if(number.length < 7) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3);
        setPhone(tel);
    } else if(number.length < 11 ) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3, 3);
        tel += "-";
        tel += number.substr(6);
        setPhone(tel);
    } else if(number.replace(/\-/g,'').length < 12) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3, 4);
        tel += "-";
        tel += number.substr(7);
        setPhone(tel);
    }
  }

  // console.log("]-----] contents [-----[ ", contents);
  // console.log("]-----] buslist [-----[ ", buslist);
  //console.log("]-----] sample [-----[ ", sample);

  useEffect(() => {
    // console.log("]-----] useEffect call [-----[ ", contents);
    // pageLoad(1, defaultPageSize, "", "");
    // if (!contents) {
    // pageLoad(1, null, "", "");
    // }
    //  buslistLoad();
  }, []);

  const pageLoad = (page, pageSize, searchKey, searchVal) => {
    if (loading) {
      return false;
    }
    if (!pageSize) {
      pageSize = defaultPageSize;
    }
    setPage(page);
    // contentsLoad(page, pageSize, searchKey, searchVal);
    return true;
  };

  const handlePost = () => {
    // console.log("]-----] handlePost call [-----[");
    router.push("/contentpost");
  };
  
  useEffect(() => {
    // var url = "http://210.91.209.170/";
    // var wnd = window.open("http://210.91.209.170/", "_blank")
    // window.open("http://210.91.209.170/", "_blank").document.getElementById("userid").value = 'idinput';
    
  }, []);
  

  // useEffect(function handleCall() {
  //   alert('1234');
  //   //document.title = name + ' ' + surname;
  // });
 




  const [values, setValues] = useState({
    id: "",
    station_id: "",
    station_name_kr: "",
    station_name_en: "",
    station_latitude: "",
    station_longitude: "",
    station_address: "",
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = async () => {
    if (loadingSave) {
      return false;
    }
    try {
      setLoadingSave(true);
    
      const data = new FormData();
      data.append("operator_no", values.station_id);
      data.append("rsv_memo_content", values.station_name_kr);
      data.append("rsv_no", values.station_name_en);
      // data.append("sportType", values.sportType);
      // data.append("station_latitude", values.station_latitude);
      // data.append("station_longitude", values.station_longitude);
      // data.append("station_address", values.station_address);
  
      const options = {
        method: "POST",
        data: data
      };
      // 주소를 /api/v1/stations/${id} 로 지정하면 수정기능  
      const result = await request(`/api/v1/rsvmemo`, options);
      console.log("]-----] Post result [-----[ ", result);
      if (result) {
        router.push("/content");
      }
    } catch (error) {
      console.log("]-----] Post error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    return true;
  };

  return (
    <div className={classes.root}>
      {loadingSave && <CircularProgress />}
      <h2 style={{color:'red',fontSize:40}}>  TEST PAGE</h2>
      <button type="button" onClick={handleClick}>
        {show ? '감추기' : '보이기'}
      </button>

      <Link href="/testpage">
      <button style={{height:100, witdh:150}}>
            <div>테이블리스트 테스트 페이지 가기</div>
      </button>
      </Link>
          {show ? (
              <Portal container={container.current}>
                <h2>숨김맨</h2>
              </Portal>
            ) : null}
      <div ref={container} /><p/>

      {/* <Button onClick={() => handleCall()}>- 콜센터 - </Button> */}

      <input type="text" onChange={phoneFomatter} value={phone}></input>

      <div>
            [[[[ 예약메모 등록하기 ]]]]<p/>
            상담원회원번호<input onChange={handleChange("station_id")}></input><p/>
            메모내용<input onChange={handleChange("station_name_kr")}></input><p/>
            예약번호<input onChange={handleChange("station_name_en")}></input><p/>
            {/* 위도36...<input onChange={handleChange("station_latitude")}></input><p/>
            경도12x...<input onChange={handleChange("station_longitude")}></input><p/>
            주소명<input onChange={handleChange("station_address")}></input><p/> */}
      </div>
      <Button
              variant="contained"
              component="span"
              className={classes.button}
              color="primary"
              
              onClick={handleSave}
              disabled={loadingSave}
            >
              저장하기
              {loadingSave && (
                <CircularProgress
                  size={24}
                />
              )}
            </Button>
        

      <HighchartsReact highcharts={Highcharts} options={options}/>
      {/* <div className={classes.slider}>

        <div className={classes.scroll}>

          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <span className={classes.verticalLine}></span>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
          <a className={classes.tiny}></a>
        </div>

        <div className={classes.scrollvertical}>

          <div className={classes.horizontalLine}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.horizontalLine}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.horizontalLine}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.horizontalLine}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.horizontalLine}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.horizontalLine}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.tiny}></div>
          <div className={classes.horizontalLine}></div>
       


        </div> */}
        {/* <Slider
          orientation="horizontal"
          defaultValue={[100, 110]}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="on" // auto 클릭시
          step={10}
          marks
          min={100}
          max={200}
          ThumbComponent="span"
          track="false"
        />
        <Slider
          orientation="vertical"
          defaultValue={[100, 110]}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          // valueLabelDisplay="on" // auto 클릭시
          step={10}
          marks={marks}
          min={100}
          max={200}
          ThumbComponent="span"
          track="false"
        /> */}

      {/* </div> */}

      {/* <div className={classes.buttonWrap}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handlePost}
        >
          컨텐츠 등록
        </Button>
      </div> */}
      <div>
        {/* <Grid container spacing={3}>
          {content &&
            content.length > 0 &&
            content.map(row => (
              <Grid item xs={3} key={row.id}>
                <ContentCard content={row} />
              </Grid>
            ))}
        </Grid> */}
     
      </div>

   
    </div>
  );
};

// Content.getInitialProps = async props => {
//   // console.log(props);
//   const { store, isServer } = props;
//   // console.log("Nav isServer token==[ ", token);
//   // console.log("Content.js isServer===", isServer);
//   store.dispatch(loadBusData());
//   // store.dispatch(loadData());
//   store.dispatch(loadContents());
//   if (isServer) {
//     /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
//   }
//   return { isServer };
// };

const mapStateToProps = state => {
  return {
    // contents: state.content.contents,
    // loading: state.content.loading,
    // buslist: state.buslist.carList,
  };
};

const mapDispatchToProps = dispatch => ({
  // buslistLoad: () => dispatch(loadBusData()),
  // contentsLoad: (page, pageSize, searchKey, searchVal) =>
  //   dispatch(loadContents(page, pageSize, searchKey, searchVal))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withAuthSync
)(Content);
