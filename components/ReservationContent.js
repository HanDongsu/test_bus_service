import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Popper from '@material-ui/core/Popper';
import DateFnsUtils from '@date-io/date-fns';
import koLocale from "date-fns/locale/ko";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { loadCarNumRSVDateData } from "../lib/buslist/actions";
import { loadDriveSearchCarNumData } from "../lib/drive/actions";
import { loadFindStationName } from "../lib/station/actions";
import { selectDepStationData, selectDestStationData } from "../lib/navermap/actions";

const useStyles = makeStyles(theme => ({
  '@global': {
    '.MuiPaper-elevation0': {
      backgroundColor: "transparent",
    }
  },
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
  formControl: {
    margin: '0 4px',
    width: 50,
  },
  naverMapRoot: {
    width: "33%",
    paddingRight: 10,
  },
  navermap: {
    width: '100%',
    height: '100%',
  },
  currentStations: {
    width: "100%",
    height: 95,
    border: "1px solid #d0d1d5",
    fontFamily: "NotoSansCJKkr",
    overflowY: "scroll",
    overflowX: "hidden",
    backgroundColor: "#f5f6f8",
  },

  busMenu1: {
    width: "33%",
    paddingLeft: 10,
    paddingRight: 10,
  },

  busMenu2: {
    width: "33%",
    paddingLeft: 10,
  },

  busmenupaper: {
    boxShadow: "none",
    height: "100%",

  },
  container: {
    display: 'flex',
  },
  buscontent: {
    height: "100%",
  },
  busroute: {
    height: "100%",
  },
  textName: {
    width: 146,
    height: 24,
    backgroundColor: '#f5f6f8',
    marginRight: 11,
    border: 'solid 1px #d0d1d5',
    paddingLeft: 9,
    fontSize: 13,
  },
  textName2: {
    width: 146,
    height: 24,
    backgroundColor: '#ffffff',
    marginRight: 11,
    border: 'solid 1px #d0d1d5',
    paddingLeft: 9,
    fontSize: 13,
  },
  textTel: {
    width: 171,
    height: 24,
    backgroundColor: '#f5f6f8',
    border: 'solid 1px #d0d1d5',
    paddingLeft: 9,
    fontSize: 13,
  },
  textTel2: {
    width: 171,
    height: 24,
    backgroundColor: '#ffffff',
    border: 'solid 1px #d0d1d5',
    paddingLeft: 9,
    fontSize: 13,
  },
  textInfo: {
    color: '#717171',
    marginTop: 10,
    marginBottom: 18,
    fontSize: 13,
  },
  datetime: {
    color: '#717171',
    width: 170,
    marginRight: 5,
    padding: 0,
    margin: 0,
  },
  textInfo2: {
    color: '#313131',
    fontSize: 13,
    marginLeft: 5,
  },
  usetimes: {
    borderRight: 'solid 1px #d0d1d5',
    marginRight: 10,
    paddingRight: 10,
  },
  tomorrowBtn: {
    width: 60,
    height: 32,
    marginRight: 10,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: "center",
    display: "inline-block",
    backgroundColor: "#7b8499",
    fontFamily: "NotoSansCJKkr",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
    "&:hover": {
      cursor: "pointer",
    },
  },
  searchBarWrap: {
    height: 24,
    marginTop: 15,
    marginBottom: 3,
    position: "relative",
  },
  searchBarPaper: {
    width: "100%",
    height: 24,
    border: "1px solid #d0d1d5",
    display: "flex",
    boxShadow: 'none',
    borderRadius: 0,
  },
  searchBar: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 0,
  },
  stationInfoWrap: {
    minHeight: 142,
    marginTop: 12,
    fontFamily: "NotoSansCJKkr",
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    fontSize: 13,
    letterSpacing: "normal",
    color: "#212121",
  },
  stationSelectBar: {
    width: "100%",
    height: 24,
    border: "1px solid #d0d1d5",
    position: "relative",
    overflow: "hidden",
    marginTop: 5,
  },
  selectCancel: {
    position: "absolute",
    padding: 0,
    right: 0,
    top: 0,

  },
  stationIcon: {
    width: 16,
    height: 16,
    margin: "3px 3px 3px 8px",
    position: "absolute",
    top: 0,
    left: 0,
  },
  selectedStationInfo: {
    width: 340,
    height: 24,
    marginLeft: 29,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  clientOtherInfo: {
    marginTop: 12,
    display: "flex",
  },
  clientMembers: {
    width: 60,
    marginRight: 10,
  },
  clientCargos: {
    width: 60,
    marginRight: 10,
  },
  selectBox: {
    width: 60,
    height: 24,
    border: "1px solid #d0d1d5", // 테두리
    backgroundColor: "#ffffff",
    background: "url(/static/selectbox.png)",  /* 화살표 모양의 이미지 */
    backgroundPosition: '85% 50%',
    backgroundSize: '13% 20%',
    backgroundRepeat: 'no-repeat',
    appearance: 'none',  // 화살표 삭제
    borderRadius: 0, // 둥근 테두리 제거
    paddingLeft: 9,
    color: '#8d939b',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  selectBoxBus: {
    width: 110,
    height: 24,
    border: "1px solid #d0d1d5", // 테두리
    backgroundColor: "#ffffff",
    background: "url(/static/selectbox.png)",  /* 화살표 모양의 이미지 */
    backgroundPosition: '90% 50%',
    backgroundSize: '8% 20%',
    backgroundRepeat: 'no-repeat',
    appearance: 'none',  // 화살표 삭제
    borderRadius: 0, // 둥근 테두리 제거
    marginTop: 10,
    marginBottom: 8,
    paddingLeft: 9,
    color: '#8d939b',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  busrouteInfo: {
    height: 40,
    display: 'flex',
  },
  busrouteCategory: {
    width: "50%",
    paddingTop: 11,
    textAlign: "center",
    '&:hover': {
      cursor: 'pointer',
    },
  },
  routeTimeText: {
    width: 168,
    fontSize: 16,
    fontWeight: "bold",
  },
  driverInfo: {
    width: "100%",
    borderLeft: "1px solid #dee0e8",
    borderRight: "1px solid #dee0e8",
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    textAlign: "right",
    display: "flex",
  },
  selectbusroute: {
    width: "100%",
    // height: 507,
    height: 527,
    borderTop: "none",
    border: "1px solid #dee0e8",
    float: 'left',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 11,
  },
  busRouteTimeSheet: {
    width: "100%",
    height: "100%",
    overflow: 'auto',
    border: "1px solid #dee0e8",
    backgroundColor: "#f5f6f8",
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 9,
  },
  horizontalLine: {
    borderTop: '1px solid #212121',
    width: 23,
    marginTop: 2,
    marginBottom: 2,
  },
  tiny: {
    position: "relative",
    width: 13,
    height: 10,
    marginLeft: 5,
    backgroundColor: "#237c07",
    border: '1px solid white',
    "&:hover": {
      backgroundColor: "#223152",
      cursor: 'pointer',
    }
  },
  tinyHidden: {
    position: "relative",
    width: 13,
    height: 10,
    marginLeft: 5,
    backgroundColor: "translate",
    border: 'none',
  },
  popoverWrap: {
    visibility: 'hidden',
    width: 282,
    height: 82,
    zIndex: 99,
    backgroundColor: "#7F7F7F",
    borderRadius: 5,
  },
  testPopUp: {
    visibility: 'visible',
  },
  popoverInArrowWrapper: {
    width: 14,
    height: 82,
    position: "relative",
    backgroundColor: "transparent",
  },
  popoverInArrow1: {
    position: "absolute",
    zIndex: 99,
    top: 29,
    right: -1,
    width: 0,
    height: 0,
    borderLeft: "12px solid none",
    borderRight: "12px solid #7F7F7F",
    borderTop: "12px solid transparent",
    borderBottom: "12px solid transparent",
    marginLeft: 2,
  },
  popoverInArrow2: {
    position: "absolute",
    zIndex: 100,
    top: 31,
    right: -1,
    width: 0,
    height: 0,
    borderLeft: "10px solid none",
    borderRight: "10px solid #ffffff",
    borderTop: "10px solid transparent",
    borderBottom: "10px solid transparent",
    marginLeft: 2,
  },
  popoverBoxWrapper: {
    position: "relative",
    width: 282,
    height: 82,
    zIndex: 99,
    backgroundColor: "#7F7F7F",
    borderRadius: 5,
  },
  popOverBox: {
    boxShadow: 'none',
    position: "relative",
    zIndex: 100,
    width: 280,
    height: 80,
    padding: 10,
    background: "#FFFFFF",
    borderRadius: 5,
    position: "absolute",
    top: 1,
    left: 1,
    "&::after": {
      content: `''`,
      boxShadow: 'none',
    },
  },
  popOver: {
    backgroundColor: "transparent",
  },
  bookingLists: {
    width: "100%",
    minHeight: 91,
    border: "solid 1px #b8bac0",
    backgroundColor: "#ffffff",
    marginBottom: 9,
    fontSize: 13,
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    "&:hover": {
      cursor: "pointer",
      border: "2px solid #2ba2cf",
    },
  },
  bookingHeader: {
    width: "100%",
    backgroundColor: "#d0d1d5",
    borderBottom: "1px solid #d0d1d5",
  },
  bookingInfoWrap: {
    width: "100%",
    minHeight: 26,
    display: "flex",
    backgroundColor: "#d0d1d5",
  },
  bookingNumber: {
    width: 30,
    textAlign: "center",
    color: '#717171',
    paddingTop: 3,
  },
  bookingPeople: {
    width: "100%",
    paddingLeft: 12,
    paddingTop: 3,
    fontSize: 14,
    fontWeight: "bold",
  },
  bookingLine: {
    minWidth: 60,
    maxWidth: 370,
    textAlign: "center",
    paddingTop: 3,
    "&:hover": {
      cursor: "pointer",
    },
  },
  bookingTime: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#212121",
    width: "100%",
  },
  bookingBody: {
    display: "flex",
  },
  bookingStationWrap: {
    display: "flex",
  },
  bookingIconWrap: {
    width: 37,
    position: "relative",
  },
  bookingIcon: {
    top: 4,
    left: 20,
    position: "absolute",
  },
  bookingStation: {
    width: "100%",
    fontWeight: "bold",
    fontSize: 13,
    color: "#212121",
    paddingTop: 10,
    paddingBottom: 10,

  },
  bookingStation123: {
    paddingLeft: 4, fontSize: 13, color: "#212121",
  },
  // 모달창 팝업 위치정보
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 모달창 디자인 
  modalBox: {
    width: 290,
    height: 148,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
  },
  modalBoxReserve: {
    width: 320,
    height: 261,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
  },
  modalTitle: {
    height: 45,
    backgroundColor: '#223152',
    color: '#ffffff',
    fontSize: 18,
    paddingLeft: 21,
    paddingTop: 12,
  },
  modalClose: {
    float: 'right',
    marginRight: 15,
    padding: 5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  modalContentWrapper: {
    margin: 20,
  },
  modalContentImgWrapper: {
    marginLeft: 25,
    marginTop: 10,
  },
  modalContentImg: {
    margin: 5,
    '&:hover': {
      cursor: 'pointer',
    },
  },

  searchResult: {
    height: 250,
    zIndex: 99,
    width: "100%",
    border: "1px solid #d0d1d5",
    backgroundColor: "#ffffff",
    position: "absolute",
    left: 0,
    top: 24,
    overflowY: "scroll",
    paddingTop: 8,
  },
  drt_searchs: {
    borderBottom: "1px dotted #000000",
  },
  sk_searchs: {
    paddingTop: 8,
  },
  searchResultObj: {
    position: "relative",
    padding: "2px 0 2px 8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f6f8",
    },
  },
  CurLists: {
    "&:hover": {
      backgroundColor: "#d0d1d5",
      cursor: "pointer"
    },
  },
  modalRouteInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeInfoWrap: {
    width: 500,
    height: 500,
    backgroundColor: "#FFFFFF"
  },
  routeStations: {
    width: "100%",
  }

}));

const ReservationContent = ({
  setCheckValid, // 입력된 데이터 들의 예약 가능 여부 (Reservation에서 배차하기 버튼활성 화 관련)
  openValue, // 예약 가능 시간대 알림창 여부 (배차하기 창을 닫을때, 초기화 해주어야 해서 Reservation에 선언)
  totalTime, // 운행 총 시간(초) (ReservationMap에서 받아옴)
  totalDistance, // 운행 총 거리(미터) (ReservationMap에서 받아옴)
  personTotalTime, // 승객의 이동 시간(분) (ReservationMap에서 받아옴)
  selectDepStationInfos, // 승차정류소 정보(redux)
  selectDestStationInfos, // 하차정류소 정보(redux)
  finalRoutesInfoList, // 선택 가능한 노선 리스트(ReservationMap에서 받아옴)
  setRadioRouteNumber, // 노선 리스트에서 선택된 노선정보(ReservationMap에서 사용)
  radioRouteNumber, // 노선 리스트에서 선택된 노선정보(ReservationMap에서 받아옴)
  driverLists, // 승무사원 리스트(서버 API)
  carRsvLists, // 차량에 등록된 예약 리스트(서버 API)
  carList, // 차량 리스트(서버 API)
  driveCarNum, // 차량에 등록된 운행 리스트(서버 API)
  selectStation, // 선택된 승/하차 정류소 정보(redux)
  consultant, // 상담원 상태(redux)
  selectCarAndDate, // 선택된 차량의 예약일의 운행 정보를 가져옴(서버 API)
  selectCarAndDrvDate, // 선택된 차량의 모든 운행 정보를 가여좀(서버 API)
  getReservationDatas, // 예약 정보 데이터
  setGetReservationDatas, // 현재 입력된 예약 정보 데이터
  loadFindStationName, // 서버 정류소 검색 API
  findStations, // loadFindStationName에서 검색된 정류소 데이터
  setSelectFindStation, // 검색 -> 정류소 클릭
  setSelectFindAddress, // 검색 -> 주소 클릭
  isRsvPerson, // 예약 데이터 유/무
  rsvPersonDatas, // 예약 고객 데이터
  memberInfo, //전화 멤버
  setCurrentStarts, // 최근승차에서 선택 데이터
  setCurrentArrivals, // 최근승차에서 선택 데이터
  setCurrentStartsCheck, // 최근승차지 선택 여부
  setCurrentArrivalsCheck, // 최근하차지 선택 여부
}) => {

  const classes = useStyles();

  const today = new Date(); // 실제 오늘 일자를 갖는 date obj
  const maxDate = new Date(); // 달력에서 최대 선택 가능한 날을 set하기 위한 date obj
  const minDate = new Date(); // 달력에서 최소 선택 가능한 날을 set하기 위한 date obj

  const [maxLimitDate, setMaxLimitDate] = useState(new Date(maxDate.setDate(maxDate.getDate() + 14))); // 달력에서 최대 선택 가능한 날
  const [minLimitDate, setMinLimitDate] = useState(new Date(minDate.setDate(minDate.getDate()))); // 달력에서 최소 선택 가능한 날

  const [rsvHour, setRsvHour] = useState(''); // 기본 선택 시간(시)
  const [preRsvHour, setPreRsvHour] = useState(''); // 예약 선택 시간(시) 백업, 기존운행에 추가에서 체크 박스 취소 시 사용
  const [rsvMinute, setRsvMinute] = useState(''); // 기본 선택 시간(분)
  const [preRsvMinute, setPreRsvMinute] = useState(''); // 예약 선택 시간(분) 백업, 기존운행에 추가에서 체크 박스 취소 시 사용
  const [rsvYears, setRsvYears] = useState(''); // 예약의 년도
  const [rsvMonth, setRsvMonth] = useState(''); // 예약의 달
  const [rsvDay, setRsvDay] = useState(''); // 예약의 일
  const [timeSheetId, setTimeSheetId] = useState(''); // 타임큐브에서 선택된 시간을 저장
  const [carNum, setCarNum] = useState('1'); // 차량 번호 (기본선택 1번)
  let tmpCarNm = '';
  for (var i = 0; i < carList.data.length; i++) {
    if (carList.data[i].car_no == carNum) {
      //carList(차량 리스트)에서 현재 carNum의 차량 이름을 추출
      tmpCarNm = carList.data[i].car_nm;
    }
  }
  const [carName, setCarName] = useState(tmpCarNm); // 선택된 차량명을 표시

  const timeTables = [
    // 랜더링시 map()을 이용하기 위하여 배열 생성, 타임큐브의 관련 HTML TAG의 ID에 들어갈 데이터, 
    // 타임큐브에 들어갈 시간 정보들을 연속적인 숫자로 사용하기 위해 (시*60+분)으로 표현
    // 연속된 숫자로 이루어져 있어 사용하기 편할것 같아서 사용
    // 시간대별 큐브 값
    // 06 : 00  => 360  || 07 : 00  => 420  || 08 : 00  => 480  || 09 : 00  => 540
    // 10 : 00  => 600  || 11 : 00  => 660  || 12 : 00  => 720  || 13 : 00  => 780
    // 14 : 00  => 840  || 15 : 00  => 900  || 16 : 00  => 960  || 17 : 00  => 1020
    // 18 : 00  => 1080 || 19 : 00  => 1140 || 20 : 00  => 1200 || 21 : 00  => 1260
    // 22 : 00  => 1320 || 23 : 00  => 1380 || 23 : 10  => 1390 || 23 : 20  => 1400
    // 23 : 30  => 1410 || 23 : 40  => 1420 || 23 : 50  => 1430 || 24 : 00  => 1440

    [{ 'time': 360 }, { 'time': 370 }, { 'time': 380 }, { 'time': 390 }, { 'time': 400 }, { 'time': 410 }],
    [{ 'time': 420 }, { 'time': 430 }, { 'time': 440 }, { 'time': 450 }, { 'time': 460 }, { 'time': 470 }],
    [{ 'time': 480 }, { 'time': 490 }, { 'time': 500 }, { 'time': 510 }, { 'time': 520 }, { 'time': 530 }],
    [{ 'time': 540 }, { 'time': 550 }, { 'time': 560 }, { 'time': 570 }, { 'time': 580 }, { 'time': 590 }],
    [{ 'time': 600 }, { 'time': 610 }, { 'time': 620 }, { 'time': 630 }, { 'time': 640 }, { 'time': 650 }],
    [{ 'time': 660 }, { 'time': 670 }, { 'time': 680 }, { 'time': 690 }, { 'time': 700 }, { 'time': 710 }],
    [{ 'time': 720 }, { 'time': 730 }, { 'time': 740 }, { 'time': 750 }, { 'time': 760 }, { 'time': 770 }],
    [{ 'time': 780 }, { 'time': 790 }, { 'time': 800 }, { 'time': 810 }, { 'time': 820 }, { 'time': 830 }],
    [{ 'time': 840 }, { 'time': 850 }, { 'time': 860 }, { 'time': 870 }, { 'time': 880 }, { 'time': 890 }],
    [{ 'time': 900 }, { 'time': 910 }, { 'time': 920 }, { 'time': 930 }, { 'time': 940 }, { 'time': 950 }],
    [{ 'time': 960 }, { 'time': 970 }, { 'time': 980 }, { 'time': 990 }, { 'time': 1000 }, { 'time': 1010 }],
    [{ 'time': 1020 }, { 'time': 1030 }, { 'time': 1040 }, { 'time': 1050 }, { 'time': 1060 }, { 'time': 1070 }],
    [{ 'time': 1080 }, { 'time': 1090 }, { 'time': 1100 }, { 'time': 1110 }, { 'time': 1120 }, { 'time': 1130 }],
    [{ 'time': 1140 }, { 'time': 1150 }, { 'time': 1160 }, { 'time': 1170 }, { 'time': 1180 }, { 'time': 1190 }],
    [{ 'time': 1200 }, { 'time': 1210 }, { 'time': 1220 }, { 'time': 1230 }, { 'time': 1240 }, { 'time': 1250 }],
    [{ 'time': 1260 }, { 'time': 1270 }, { 'time': 1280 }, { 'time': 1290 }, { 'time': 1300 }, { 'time': 1310 }],
    [{ 'time': 1320 }, { 'time': 1330 }, { 'time': 1340 }, { 'time': 1350 }, { 'time': 1360 }, { 'time': 1370 }],
    [{ 'time': 1380 }, { 'time': 1390 }, { 'time': 1400 }, { 'time': 1410 }, { 'time': 1420 }, { 'time': 1430 }],
  ];

  const [selectedDate, setSelectedDate] = React.useState(new Date()); // 선택될 날짜 obj
  const [parsedDepDate, setParsedDepDate] = useState(''); // 출발 시간 정보
  const [parsedDestDate, setParsedDestDate] = useState(''); // 도착 시간 정보
  const [openAlertModal, setOpenAlertModal] = useState(false); // 예약 불가능 시간대 알림 모달
  const [checkValidInside, setCheckValidInside] = useState(false); // 선택된 예약 정보들이 예약 가능한지에 대한 정보

  let rsvTimeTables = []; // 선택 불가능한 시간대 정보를 담을 배열(타임큐브에서 사용)
  let rsvTimeTables2 = []; // 선택 가능한 시간대 정보를 담을 배열(타임큐브에서 사용)
  let driveRsvListsArr = []; // 선택 가능한 예약을 담을 배열
  let driveRsvListsArr2 = []; // 선택 불가능한 예약을 담을 배열
  const [rsvTimeTablesList, setRsvTimeTablesList] = useState([]); // rsvTimeTables의 예약 불가능한 시간 데이터에서 중복된 값 제거하고 담기 위한 배열
  const [driveRsvLists, setDriveRsvLists] = useState([]); // driveRsvListsArr, driveRsvListsArr2에 담긴 운행 정보들을 담기 위한 배열
  const [busrouteCategory, SetBusrouteCategory] = useState(true); // 신규운행 생성 / 기존운행에 추가 탭
  const [passenger, setPassenger] = useState('1'); // 탑승인원
  const [findStationName, setFindStationName] = useState(''); // 검색 값
  const [findDrtStationsValue, setFindDrtStationsValue] = useState(''); // 정류소 검색 값 저장
  const [findDrtStationsValue2, setFindDrtStationsValue2] = useState(false); // SK주소 검색 값 유/무 여부
  const [isFindChecker, setIsFindChecker] = useState(false); // 검색 결과 창 팝업 유/무
  const [searchValResult, setSearchValResult] = useState([]); // SK주소 검색으로 받아온 데이터를 담을 배열
  const [riderName, setRiderName] = useState(''); // 승객 이름
  const [riderNameCheck, setRiderNameCheck] = useState(true); // 승객 이름 입력 여부
  const [riderPhone, setRiderPhone] = useState(''); // 승객 전화번호
  const [riderPhoneCheck, setRiderPhoneCheck] = useState(true); // 승객 전화번호 입력 여부
  const [diverNum, setDiverNum] = useState('1'); // 승무사원 번호

  //기존 운행에 추가
  const [addDrv, setAddDrv] = useState(''); // 기존운행에 추가시 선택된 운행 번호 

  // 예약 불가 알림 닫기
  const handleAlertModal = () => {
    setOpenAlertModal(false);
  }

  // 예약 시간(시) 변경 시, 시간(시) 저장 및 백업해 주기 위해
  // 백업된 시간은 기존운행에 추가 에서 체크 해제 시, 체크 이전에 선택했던 시간정보를 가져오기 위해
  const handleChangeHour = (event) => {
    setRsvHour(event.target.value);
    setPreRsvHour(event.target.value); // 예약 시간(시) 백업
  };

  // 예약 시간(분) 변경, 시간(분) 저장 및 백업해 주기 위해
  // 백업된 시간은 기존운행에 추가 에서 체크 해제 시, 체크 이전에 선택했던 시간정보를 가져오기 위해
  const handleChangeMinute = (event) => {
    setRsvMinute(event.target.value);
    setPreRsvMinute(event.target.value); // 예약 시간(분) 백업
  };

  // 날짜를 년,월,일로 분리하여 리턴
  const dateParser = date => {
    let years = date.getFullYear();
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return { years, month, day }
  }

  // 노선 목록에서 노선 변경 클릭 시, 노선 번호를 저장 해주기 위해
  const handleRouteChange = data => {
    setRadioRouteNumber(data.route_no);
  };

  const handelCheckDrv = e => {
    // 기존 운행에 추가 체크 박스 이벤트
    var targetIndex = e.target.getAttribute('index'); // 체크박스 태그에 부여된 인덱스를 가져옴
    var obj = document.getElementsByName("drives"); // drives라는 name을 가진 obj를 가져옴
    var driveNum = ''; // 운행 번호 담기 위한 변수
    // checkbox obj전체를 돌면서, 현재 선택된 index와 비교하여, index와 obj의 순번이 같지 않다면, 체크 해제
    for (var i = 0; i < obj.length; i++) {
      if (i != targetIndex) {
        obj[i].checked = false;
      } else {
        driveNum = obj[i].value;
        // index와 obj의 순번이 같을 때, 체드여부 확인, false이면 백업 해둔 시간(기존운행에 추가로 선택하기 이전의 시간)으로 시간 변경
        if (obj[i].checked == false) {
          driveNum = ''; // 체크해제 시 운행 번호 초기화
          setRsvHour(preRsvHour);
          setRsvMinute(preRsvMinute);
        } else {
          // 출발 시간, 랜더링시 부여된 'drvT_ + 운행번호' tag ID를 찾아 start_t attribute에 담긴 출발시간 데이터를 가져옴
          var st = document.getElementById("drvT_" + obj[i].value).getAttribute('start_t');
          setRsvHour(st.substring(8, 10));
          setRsvMinute(st.substring(10, 12));
        }
      }
    }

    setAddDrv(driveNum); // 기존운행에 추가시 선택된 운행번호를 담는다
  }

  // 검색 취소버튼 클릭 시, 검색 관련 데이터를 조기화 해 주기위해
  const searchClear = () => {
    setFindStationName('');
    setIsFindChecker(false);
    setSearchValResult(false);
  }

  // 검색어 입력 시, 검색 데이터를 저장해준다
  const handleFindStation = e => {
    setFindStationName(e.target.value);
  }

  // 검색 결과에서 정류소 정보를 클릭한 경우, 정류소 정보를 넘겨주기 위함
  const handleClickFind_DRT_Station = data => {
    setSelectFindStation(data);
  }

  // 검색 결과에서 주소 정보를 클릭한 경우, 주소 정보를 넘겨주기 위함
  const handleClickFind_SK_Address = data => {
    setSelectFindAddress(data);
  }

  // 검색창에서 포커스아웃 시, 검색 관련 데이터를 초기화해주기 위해
  const handleFocusOutFindStation = e => {
    setTimeout(() => {
      setIsFindChecker(false);
      setFindDrtStationsValue('');
      setFindDrtStationsValue2(false);
      setFindStationName('');
      setSearchValResult('');
    }, 200); // 포커스 아웃 시, 바로 초기화를 할 경우, 데이터가 전달되기 전에 초기화가 이루어져, 0.2초 뒤에 초기화
  }

  // 검색창으로 포커스 인 된 경우, 검색결과 창을 띄우기 위함
  const handleFocusInFindStation = e => {
    setIsFindChecker(true);
  }

  {/* 주소 검색 START */ }
  let timer = null; // 검색 시 사용할 타이머 변수

  useEffect(() => {
    // 검색어가 있을 경우,
    if (findStationName && findStationName != '') {
      // 검색 시 기존 데이터 남아있어서 초기화, 새로 입력 및 추가 검색시 초기화
      setFindDrtStationsValue('');
      // 검색 시 기존 데이터 남아있어서 초기화, 새로 입력 및 추가 검색시 초기화
      setFindDrtStationsValue2(false);
      timer = setTimeout(() => {
        // onChange 이벤트 종료 후,  0.3초 뒤에 API 발송
        findStationNameParser(findStationName);
      }, 300);
      return () => { clearTimeout(timer); } // 계속 입력 될 시, timeout 클리어
    } else {
      setFindStationName('');
      setIsFindChecker(false);
    }
  }, [findStationName]);

  useEffect(() => {
    // 정류소 검색 시,
    if (findStations) {
      var seq = false; // 검색 결과 값 여부 flag
      if (findStations.data.length > 0) {
        seq = true; // 검색 결과 값이 있는 경우
      } else {
        seq = false; // 검색 결과 값이 없는 경우
      }
      // 검색 시, flag와 검색 결과값을 json형식으로  정류소 검색 값에 저장
      // flag를 통해 검색 결과 값이 없는지, 검색이 이루어지지 않았는지 판별하여, 클라이언트에 표시하기 위해서 사용
      setFindDrtStationsValue(createFindValue(seq, findStations));
    }
  }, [findStations]);

  const createFindValue = (seq, stations) => {
    return { seq, stations }
  }

  /**
   * 검색어 입력 시, 받아온 정보에서 미완성형 글자를 제거해 주기 위해
   * @param {*} data 주소 검색으로 받아온 정보
   */
  const findStationNameParser = data => {
    // 미완성형 글자 제거 함수 및 검색 API 전송
    let tempData = [];
    let checkedValue = ''; // 최종적으로 API에 전송할 온전한 데이터를 저장할 변수
    let match = null;
    let num = 0;
    const check = /[ㄱ-ㅎ|ㅏ-ㅣ]/g; // 미 완성형 글자의 정규식
    for (let i = 0; i < data.length; i++) {
      // 혹시 몰라서, tempData의 배열에 검색어로 입력된 값인 data를 넣는다
      tempData[i] = data[i];
    }
    while ((match = check.exec(data)) !== null) {
      // data에서 정규식 비교하여, 정규식 패턴에 맞는 문자열 탐색을 수행, 해당 정규식 패턴을 찾지 못하거나 끝을 만나면 종료
      tempData[match.index] = ''; // 정규식에 맞는 문자열이 탐색되면 해당 문자열을 공백으로 치환,
      num++;
    }
    for (let i = 0; i < tempData.length; i++) {
      // tempData 배열에서 정규식에 맞는 문자열이 탐색되면 해당 문자열을 공백으로 치환되었으므로, 해당 문자열을 연결하면 완성형 문자들만 존재
      checkedValue += tempData[i];
    }

    if (checkedValue != '') {
      loadFindStationName(checkedValue); // 서버 API
      sk_FindSearchAddress(checkedValue); // SK API
    } else if (data.length > 0) { // 전달받은 data의 길이가 0보다 크지만, 완성형 글자가 존재 하지 않을 경우
      setFindDrtStationsValue(createFindValue(false, ''));
      setSearchValResult(false); // 검색 없음
    }
  }

  /**
   * sk 주소 검색 관련
   * 참조 http://tmapapi.sktelecom.com/main.html#webservice/sample/WebSamplePoi
   * @param {*} data 미완성형 글자가 제거된 주소검색 정보
   * 검색된 주소 정보를 SK 통합검색 API에 전송하여 주소 정보들을 받아와 배열에 저장후 
   * 글자순으로 정렬하여 setSearchValResult에 값을 담아 ReservationMap으로 넘겨주어 마커를 찍는다
   */
  const sk_FindSearchAddress = data => {
    setFindDrtStationsValue2(true); // SK주소 검색 값 유/무 여부
    const searchResults = [];
    $.ajax({
      method: "GET",
      url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
      async: false,
      data: {
        "appKey": "a3bb2817-6417-4060-bd8f-b1ca928ef831",
        "searchKeyword": data,
        "resCoordType": "WGS84GEO",
        "reqCoordType": "WGS84GEO",
        // "count" : 10,
        "areaLLCode": "36"
      },
      success: function (response) {
        if (response) {
          let resultpoisData = response.searchPoiInfo.pois.poi;
          for (let i in resultpoisData) {
            let json_data = "";
            json_data = {
              "name": resultpoisData[i].name,
              "id": resultpoisData[i].id,
              "address": resultpoisData[i].upperAddrName + " " + resultpoisData[i].upperAddrName + " " + resultpoisData[i].roadName + " " + resultpoisData[i].firstBuildNo,
              "lat": resultpoisData[i].frontLat,
              "lng": resultpoisData[i].frontLon,
              "seq": "/static/mapicon/map_marker.png",
              "seq2": "tmap"
            }
            searchResults.push(json_data);
          }
        } else {
          setSearchValResult(false); // 검색 없음
        }
      },
      error: function (request, status, error) {
        console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
      }
    });
    // 글자순 정렬 
    if (searchResults.sort(ascsort).length > 0) {
      setSearchValResult(searchResults.sort(ascsort)); // SK 검색 값, 저장
    } else {
      setSearchValResult(false);
    }

    // 정렬 asc
    const ascsort = (a, b) => {
      if (a.name < b.name) return -1;
      else if (a.name == b.name) return 0;
      else return 1;
    }
  }
  {/* 주소 검색 END */ }

  /**
   * 시간 정보를 받아와 년도, 월, 일, 시, 분으로 나눈 뒤,
   * 추가 시간이 있을 경우, 추가 시간을 받아온 시간정보에 추가시간을 더한 시간 정보를 구해주기 위해
   * @param {*} date 시간 정보
   * @param {*} addMinutes 추가 될 시간 정보
   * 
   * 구한 시간 정보를 detach_DateData로 보낸뒤, 받은 값을 리턴
   */
  const dateData_Parser = (date, addMinutes) => {
    let year = '';
    let month = '';
    let day = '';
    let hour = '';
    let min = '';
    let sec = '00';

    let values = '';
    let tempDate = new Date();

    let addTime = Number(addMinutes) % 10 == 0 ? Number(addMinutes) : parseInt(Number(addMinutes) / 10 + 1) * 10; // addTime이 1~10일때는 10, 11~20일때는 20...
    if (date instanceof Date) {
      year = date.getFullYear();
      month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    } else {
      year = date.substring(0, 4);
      month = date.substring(4, 6);
      day = date.substring(6, 8);
      hour = date.substring(8, 10);
      min = date.substring(10, 12);
    }
    // 현재시간(분) 올림
    min = Number(min) % 10 == 0 ? Number(min) : parseInt(Number(min) / 10 + 1) * 10;

    //받아온 date를 Date객체에 넣는다
    tempDate.setFullYear(year);
    tempDate.setMonth(month - 1);
    tempDate.setDate(day);
    tempDate.setHours(hour);
    addTime = Number(addTime + min);
    tempDate.setMinutes(addTime);
    tempDate.setSeconds(sec);

    values = detach_DateData(tempDate); // detach_DateData 함수에서 { year, month, day, hours, min, sec, yymmdd, hhmmss } 의 형태의 리턴값을 받아옴

    return { values };
  }

    /**
   * 시간 정보를 받아와, 년, 월, 일, 시, 분으로 나눠준다.
   * @param {*} date 시간 정보
   * 
   * 나눠준 년,월,일,시,분,초, 년월일, 시분초 값을 json형식으로 리턴
   * 
   * dateData_Parser와 따로 쓰일 수 있을것 같아 나눠둠
   */
  const detach_DateData = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let sec = '00';
    year = String(year);
    month = String(month);
    day = String(day);
    hour = String(hour);
    min = String(min);
    sec = String(sec);
    let yymmdd = year + month + day;
    let hhmmss = hour + min + sec;
    return { year, month, day, hour, min, sec, yymmdd, hhmmss }
  }

  useEffect(() => {
    // 배차하기 진입시 분기 및 초기화
    if (isRsvPerson) { // app예약에서 배차하기 클릭한 경우
      if (rsvPersonDatas) {
        // 예약 정보 있는경우(앱예약 or 재배차)
        setRiderName(rsvPersonDatas.data[0].rsv_rider.rider_nm);
        setRiderPhone(rsvPersonDatas.data[0].rsv_rider.rider_phone);
        // APP 예약 생성 시, 이미 시간이 정해져 있으므로 dateData_Parser에 추가시간 부분에 "00" 넣어준다.
        let person_date = dateData_Parser(rsvPersonDatas.data[0].rsv_dep_time, '00');
        // 예시 값 
        // person_date : {
        //    year: "2020"
        //    month: "04"
        //    day: "10"
        //    hour: "19"
        //    min: "00"
        //    sec: "00"
        //    yymmdd: "20200410"
        //    hhmmss: "190000" }
        let year = person_date.values.year;
        let month = person_date.values.month;
        let day = person_date.values.day;
        let hour = person_date.values.hour;
        let min = person_date.values.min;
        let date = new Date(year, month, day, hour, min);
        date.setFullYear(Number(year));
        date.setMonth(Number(month - 1));
        date.setDate(Number(day));
        date.setHours(Number(hour));
        date.setMinutes(Number(min));
        // 시간 관련 데이터 들을 예약된 데이터들에서 가져와 넣어준다
        setSelectedDate(date);
        setRsvHour(hour);
        setRsvMinute(min);
        setRsvYears(year);
        setRsvMonth(month);
        setRsvDay(day);
        setPassenger(rsvPersonDatas.data[0].rsv_person_cnt);
        selectCarAndDrvDate(carNum);
        setFindDrtStationsValue('');
        selectCarAndDate(carNum, year + month + day);
      }
    } else {
      // 신규 예약 진행 //
      let toDay = new Date();
      // 신규 예약 생성 시, 시간 기본값은 현재 시간 + 60분 이므로, dateData_Parser함수에서 처리 할 수 있도록 '60'을 넣어준다.
      let new_rsv = dateData_Parser(toDay, '60');
      let year = new_rsv.values.year;
      let month = new_rsv.values.month;
      let day = new_rsv.values.day;
      let hour = new_rsv.values.hour;
      let min = new_rsv.values.min;
      let date = new Date(year, month, day, hour, min);
      date.setFullYear(Number(year));
      date.setMonth(Number(month - 1));
      date.setDate(Number(day));
      date.setHours(Number(hour));
      date.setMinutes(Number(min));
      setSelectedDate(date);
      setRsvHour(hour);
      setRsvMinute(min);
      setRsvYears(year);
      setRsvMonth(month);
      setRsvDay(day);
      selectCarAndDrvDate(carNum);
      setFindDrtStationsValue('');
      selectCarAndDate(carNum, year + month + day);
    }
  }, [rsvPersonDatas])

  useEffect(() => {
    // 신규 운행 생성 타임 큐브 관련, 예약 가능한 시간대와, 불가능한 시간대를 구분
    // busrouteCategory(기존/신규 생성탭값), carRsvLists(선택된 차량이 갖는 예약들), carNum(차량번호), rsvYears(예약년도), rsvMonth(예약 월), rsvDay(예약일자) 변경 시,
    if (busrouteCategory) {
      if (carNum) {
        if (carRsvLists) {
          rsvTimeTables = [];
          for (let i = 0; i < carRsvLists.data.length; i++) {
            for (let j = 0; j < carRsvLists.data[i].reserves.length; j++) {
              //dataformat=> 20 20 03 29 10 10 00
              // 예약 취소가 아닐 때,
              if (carRsvLists.data[i].reserves[j].rsv_stat != 'RSV_CANCEL') {
                // 선택한 년+월+일과 예약 일자(년+월+일)이 같을 때,
                if ((rsvYears + rsvMonth + rsvDay) == carRsvLists.data[i].reserves[j].rsv_dep_time.substring(0, 8)) {
                  // 운행에 속한 예약들의 출발 시간 추출
                  let depTime = carRsvLists.data[i].reserves[j].rsv_dep_time;
                  // 출발시간을 타임큐브의 시간포멧으로 변경(시*60 +분)
                  depTime = (Number(depTime.substring(8, 10)) * 60) + Number(depTime.substring(10, 12));
                  // 운행에 속한 예약들의 도착 시간 추출
                  let destTime = carRsvLists.data[i].reserves[j].rsv_dest_time;
                  // 도착시간이 6시 이전인 경우(도착시간이 자정이 지났을 경우로 생각)
                  if (Number(destTime.substring(8, 10)) < 6) {   // 시간이 6보다 작을때 
                    destTime = 1440; // 도착시간을 24:00(1440)으로 맞춘다
                    // TODO : 운행시간이 24시간이 넘거나, 도착시간이 다음날 오전 6시 이후인 경우에 대해 처리해주어야 한다.
                  } else {
                    destTime = (Number(destTime.substring(8, 10)) * 60) + Number(destTime.substring(10, 12))
                  }
                  // 출발시간과 도착시간 사이의 모든 시간 데이터를 구해, 예약 불가능한 시간대 배열에 넣는다
                  for (let k = depTime / 10; k <= destTime / 10; k++) {
                    if (k < 36 || k > 144) {

                    } else {
                      rsvTimeTables.push(k * 10);  // 예약불가능한 시간 배열 입력 
                    }
                  }
                }
              }
            }
          }

          let toDayYear = today.getFullYear();
          let toDayMonth = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
          let toDayDay = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
          let toDayHour = today.getHours();
          let toDayMins = today.getMinutes() % 10 == 0 ? (parseInt(today.getMinutes() / 10)) * 10 + 60 : (parseInt(today.getMinutes() / 10)) * 10 + 60;
          let tmp = toDayHour * 60 + toDayMins; // 현재 시간(타임큐브 형식)
          let realToDay = toDayYear + toDayMonth + toDayDay; // 실제 오늘 날짜
          let selectRsvDay = rsvYears + rsvMonth + rsvDay; // 선택한 예약 날짜
          // 실제 오늘 날짜와 선택한 예약 날짜가 같다면, 현재 시간이전대의 시간은 선택이 불가능 해야함
          if (selectRsvDay == realToDay) {
            // 현재 시간 이전의 시간대는 예약 불가능 시간대 배열에 넣는다
            for (var i = 36; i <= tmp / 10; i++) {
              rsvTimeTables.push(i * 10);
            }
          }
          // 예약 불가능한 시간 데이터 배열에서 중복된 값 제거
          rsvTimeTables = Array.from(new Set(rsvTimeTables));
          setRsvTimeTablesList(rsvTimeTables);

          for (let i = 36; i < 144; i++) {
            //06:00(360)에서 24:00(1440)까지 돌면서, 예약 불가능한 시간에 포함되지 않은 값을 추출하여, 예약 가능한 시간 배열에 넣는다
            if (!rsvTimeTables.includes(i * 10)) {
              rsvTimeTables2.push(i * 10);
            }
          }
          // 예약 가능한 시간 데이터 배열에서 중복된 값 제거
          rsvTimeTables2 = Array.from(new Set(rsvTimeTables2));

          // 예약 불가능한 시간대 배열으 돌면서, 해당 태그ID의 값을 변경.
          for (let i = 0; i < rsvTimeTables.length; i++) {
            if (rsvTimeTables[i] > 350 && rsvTimeTables[i] < 1440) {
              document.getElementById(rsvTimeTables[i]).style.backgroundColor = "#b5b8bf";
              document.getElementById(rsvTimeTables[i]).style.pointerEvents = "none";
              document.getElementById(rsvTimeTables[i]).setAttribute('isRsv', 'false');
            }
          }
          // 예약 가능한 시간대 배열으 돌면서, 해당 태그ID의 값을 변경.
          for (let i = 0; i < rsvTimeTables2.length; i++) {
            if (rsvTimeTables2[i] > 350 && rsvTimeTables2[i] < 1440) {
              document.getElementById(rsvTimeTables2[i]).style.backgroundColor = "#237c07";
              document.getElementById(rsvTimeTables2[i]).style.pointerEvents = "auto";
              document.getElementById(rsvTimeTables2[i]).setAttribute('isRsv', 'true');
            }
          }

        }
      }
    }
  }, [carRsvLists, carNum, busrouteCategory, rsvYears, rsvMonth, rsvDay, selectedDate]);

  useEffect(() => {
    // 기존 운행에 추가 목록 생성
    // busrouteCategory(기존/신규 생성탭값), carNum(차량번호 선택), driveCarNum(차량에 배정된 모든 운행 데이터), radioRouteNumber(노선변경), selectedDate(날짜), rsvHour(시), rsvMinute(분)이 변경 될 때
    // driveCarNum의 데이터를 파싱
    // 기존 운행의 목록들은 운행에 첫번째로 등록된 예약의 정보를 토대로 만든다
    if (!busrouteCategory) {
      if (carNum) {
        if (driveCarNum) {
          let selectDay = rsvYears + rsvMonth + rsvDay; //선택된 날짜
          let stationArr = []; // 운행에 포함된 정류소들의 정보를 담을 배열(기존운행(단건)에서 사용 할 노선정보정류소 정보에 필요)
          driveRsvListsArr = []; // 선택 가능한 예약을 담을 배열
          driveRsvListsArr2 = []; // 선택 불가능한 예약을 담을 배열
          let tmpArr = []; // driveRsvListsArr와 driveRsvListsArr2를 잠시 담아둘 배열
          for (var i = 0; i < driveCarNum.length; i++) {
            // driveCarNum(차량에 배정된 모든 운행 데이터 배열)에서 예약의 날짜와 선택된 날짜가 같을 경우
            if (driveCarNum[i].drv_date == selectDay) {
              let drvNo = driveCarNum[i].drv_no;
              let routeNo = driveCarNum[i].drv_route.route_no;
              let routeNm = driveCarNum[i].drv_route.route_nm;
              let drvStation = driveCarNum[i].stations; // 운행에 소속된 노선의 정류소들
              stationArr = [];
              for (var j = 0; j < drvStation.length; j++) {
                // 운행에 소속된 노선의 정류소들을 위에서 생성한 배열에 담아 둔다
                if (j != 0 && j != drvStation.length - 1) {
                  stationArr.push(drvStation[j]);
                }
              }
              let routeLength = stationArr.length - 1;
              let chagneRoute = [];
              if (stationArr[0].route_station_turn_no > stationArr[routeLength].route_station_turn_no) {
                // 운행에 소속된 노선들의 route_station_turn_no 값이 작은 번호가 첫번째 배열에 들어오도록 순서를 바꾼다
                // (route_station_turn_no가 작을 수록 출발지와 가깝기때문)
                for (var j = routeLength; j > -1; j--) {
                  chagneRoute.push(stationArr[j]);
                }
                stationArr = chagneRoute;
              }
              let rsvPerson = driveCarNum[i].drv_total_rsv_cnt; // 운행에 등록된 총 탑승 인원
              let totalSeat = driveCarNum[i].drv_car.car_person_cnt; // // 운행에 등록된 차량의 총 좌석수
              if (driveCarNum[i].reserves.length > 0) {
                let startT = driveCarNum[i].reserves[0].rsv_dep_time; // 운행에 등록된 첫번째 예약의 승차시간
                let endT = driveCarNum[i].reserves[0].rsv_dest_time; // 운행에 등록된 첫번째 예약의 하차시간
                let distance = driveCarNum[i].reserves[0].rsv_est_distance; // 운행에 등록된 첫번째 예약의 이동거리
                let totalTime = driveCarNum[i].reserves[0].rsv_est_time; // 운행에 등록된 첫번째 예약의 운행시간
                let startS = '';
                let endS = '';
                for (var j = 0; j < driveCarNum[i].stations.length; j++) {
                  // 운행에 등록된 첫번째 예약의 승차정류소를 탐색하여, 변수에 담아둔다
                  if (driveCarNum[i].stations[j].route_station_turn_no == 1) {
                    startS = driveCarNum[i].stations[j];
                  }
                  // 운행에 등록된 첫번째 예약의 하차정류소를 탐색하여, 변수에 담아둔다
                  if (driveCarNum[i].stations[j].route_station_turn_no == (driveCarNum[i].stations.length)) {
                    endS = driveCarNum[i].stations[j];
                  }
                }

                // 함수가 받아온 데이터를 json형식으로 리턴해 주기 위해 사용
                function parsingDrvData(drvNo, routeNo, routeNm, drvStation, rsvPerson, totalSeat, startT, endT, distance, totalTime, startS, endS) {
                  return { drvNo, routeNo, routeNm, drvStation, rsvPerson, totalSeat, startT, endT, distance, totalTime, startS, endS };
                }
                // 같은 노선인지  &&  예약이 가능한 시간인지 + 그외전부 를 배열에 넣는다. (체크가능한 예약이 위로 가게끔)
                if (radioRouteNumber == driveCarNum[i].drv_route.route_no && (Number(driveCarNum[i].reserves[0].rsv_dep_time.substring(8, 10)) * 60 + Number(driveCarNum[i].reserves[0].rsv_dep_time.substring(10, 12))) >= ((Number(rsvHour) * 60) + Number(rsvMinute))){
                  // 노선이 같고 예약이 가능한 시간인 경우의 운행 정보를 json형식으로 변환하여 배열에 담는다
                  driveRsvListsArr.push(parsingDrvData(drvNo, routeNo, routeNm, stationArr, rsvPerson, totalSeat, startT, endT, distance, totalTime, startS, endS));
                } else {
                  // 그외 운행 정보
                  driveRsvListsArr2.push(parsingDrvData(drvNo, routeNo, routeNm, stationArr, rsvPerson, totalSeat, startT, endT, distance, totalTime, startS, endS));
                }
              }
            }

          }
          // 위에서 생성한 운행 정보들을 배열에 담는다
          tmpArr.push(driveRsvListsArr);
          tmpArr.push(driveRsvListsArr2);
          setDriveRsvLists(tmpArr);
        }
      } else {
        // 차량이 선택이 없을경우 배열을 비워준다
        setDriveRsvLists([]);
      }
    }
  }, [busrouteCategory, carNum, driveCarNum, radioRouteNumber, selectedDate, rsvHour, rsvMinute]);



  /**
   * 승/하차의 정류소 선택 취소 버튼 클릭 함수
   * @param {*} data 정류소 종류 [dep, dest]
   * 취소된 정류소 정보(종류)를 토대로 정보를 비워주기 위해
   */
  const selectCancel = data => {
    // 승차지인 경우, 승차지와 관련된 state를 비워주기 위해
    if (data == 'dep') {
      // 승차정류소 정보를 비움
      selectDepStationInfos(false);
      // 최근 승차지에서 선택된 정보를 비움
      setCurrentStarts('');
      // 최근 승차지 선택 여부를 취소
      setCurrentStartsCheck(false);
    }
    // 하차지인 경우, 하차지와 관련된 state를 비워주기 위해
    else if (data == 'dest') {
      // 하차정류소 정보를 비움
      selectDestStationInfos(false);
      // 최근 하차지에서 선택된 정보를 비움
      setCurrentArrivals('');
      // 최근 하차지 선택 여부를 취소
      setCurrentArrivalsCheck(false);
    }
  }

  // 이름 state 설정
  const handleName = e => {
    setRiderName(e.target.value);
  };

  // 전화번호 state 설정
  const handleTel = event => {
    var e = event.target.value;
    var tel = "";
    var number = e.replace(/[^0-9]/g, "");
    if (number.length < 4) {
      tel += number;
      setRiderPhone(tel);
    } else if (number.length < 7) {
      tel += number.substr(0, 3);
      tel += "-";
      tel += number.substr(3);
      setRiderPhone(tel);
    } else if (number.length < 11) {
      tel += number.substr(0, 3);
      tel += "-";
      tel += number.substr(3, 3);
      tel += "-";
      tel += number.substr(6);
      setRiderPhone(tel);
    } else if (number.replace(/\-/g, '').length < 12) {
      tel += number.substr(0, 3);
      tel += "-";
      tel += number.substr(3, 4);
      tel += "-";
      tel += number.substr(7);
      setRiderPhone(tel);
    }

  };

  /**
   * 최근 승차지를 클릭 시 실행
   * 
   * @param {*} data 선택된 정류소 정보
   * 
   * 승차지 정보를 담아주며 (setCurrentStarts),
   * 최근 승차지에서 클릭 되었다는 여부(setCurrentStartsCheck)를 변경 한다. 클릭 여부를 통해, ReservationMap에서 마커를 찍어줄지 말지 결정
   */
  const handleClickCurStart = data => {
    setCurrentStarts(data);
    setCurrentStartsCheck(true);
  }

  /**
   * 최근 하차지 클릭 시 실행
   * 
   * @param {*} data 선택된 정류소 정보
   * 
   * 하차지 정보를 담아주며 (setCurrentArrivals),
   * 최근 하차지 클릭 되었다는 여부(setCurrentArrivalsCheck)를 변경 한다. 클릭 여부를 통해, ReservationMap에서 마커를 찍어줄지 말지 결정
   */
  const handleClickCurArrival = data => {
    setCurrentArrivals(data);
    setCurrentArrivalsCheck(true);
  }

  /**
   * 신규운행/기존운행에 추가 탭 변경
   * 
   * @param {*} e 탭 상태값 [true, false]
   * 
   * true - 신규운행 생성 탭
   * false - 기존운행에 추가 탭
   */
  const handleChangeRoute = e => {
    SetBusrouteCategory(e);
  }

  /**
   * 내일 버튼 클릭 시 사용
   * 오늘 날짜에 하루만 더해주는 형식
   * 날짜가 변경 되면, 예약 일자와, 예약 년,월,일을 저장해 주고,
   * 선택되어져 있는 차량의 운행 정보를 변경된 날짜로 다시 구해온다.
   */
  const selectTomorrow = () => {
    setSelectedDate(today.setDate(today.getDate() + 1));
    setRsvYears(dateParser(today).years);
    setRsvMonth(dateParser(today).month);
    setRsvDay(dateParser(today).day);
    selectCarAndDate(carNum, dateParser(today).years + dateParser(today).month + dateParser(today).day);
  };

  /**
   * 달력에서 날짜 변경 시 사용
   * 
   * @param {*} date 달력에서선택 된 날짜
   * 
   * 날짜가 변경 되면, 예약 일자와, 예약 년,월,일을 저장해 주고,
   * 선택되어져 있는 차량의 운행 정보를 변경된 날짜로 다시 구해온다.
   */
  const handleDateChange = date => {
    setSelectedDate(date);
    setRsvYears(dateParser(date).years);
    setRsvMonth(dateParser(date).month);
    setRsvDay(dateParser(date).day);
    selectCarAndDate(carNum, dateParser(date).years + dateParser(date).month + dateParser(date).day);
  };

  // 탑승 인원 변경
  const handlePassengerChange = event => {
    setPassenger(event.target.value);
  };

  const [open, setOpen] = React.useState(false); // [popper] 타임 큐브 말풍선 관리
  const [anchorEl, setAnchorEl] = React.useState(null); // [popper] 타임 큐브 말풍선 관련
  const [placement, setPlacement] = React.useState(); // [popper] 타임 큐브 말풍선 관련

  /**
   * 타임큐브 클릭 시, 말풍선 활성화 함수
   * 
   * @param {*} newPlacement popper가 활성화 될 위치 정보
   * 
   * meterail ui popper 참조
   */
  const handlePopper = (newPlacement) => (event) => {
    let hour = parseInt(Number(event.target.id) / 60);
    hour = hour < 10 ? "0" + hour : hour;
    setRsvHour(String(hour)); // 선택된 타임큐브의 id에서 시긴을 구함
    let mins = Number(event.target.id) % 60;
    mins = mins < 10 ? "0" + mins : mins;
    setRsvMinute(String(mins)); // 선택된 타임큐브의 id에서 분을 구함

    // meterail ui popper 참조
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  useEffect(() => {
    // 예약 불가능 시간 알림 모달 팝업 관련
    // 예약 시간 가능 여부(openValue)에 따라 타임큐브 말풍선 활성화 여부를 정해준다
    if (!openValue) {
      setOpen(openValue);
    }
  }, [openValue]);


  /**
   * 승무사원 변경 시, 변경된 승무사원 번호 저장
   * 
   * @param {*} e 승무사원 변경 시 받는 이벤트 데이터
   */
  const handleChangDriverNum = e => {
    setDiverNum(e.target.value);
  }

  /**
   * 차량 변경 시 실행
   * 
   * @param {*} e 차량 변경 시 받는 이벤트 데이터
   * 
   * 변경된 차량 번호와 이름을 저장하고
   * 변경된 차량의 번호와 예약날짜로 예약 목록 불러오기(서버 API)
   * 변경된 차량의 번호의 모든 운행 정보 불러오기 (서버 API)
   * 선택된 차량이 포함된 운행정보와 예약목록을 사용하기 위해
   */
  const handleChangCarNum = e => {
    if (e.target.value != '' && e.target.value != 0) {
      setCarNum(e.target.value);
      for (var i = 0; i < carList.data.length; i++) {
        if (carList.data[i].car_no == e.target.value) {
          setCarName(carList.data[i].car_nm);
        }
      }
      selectCarAndDate(e.target.value, rsvYears + rsvMonth + rsvDay); // 변경된 차량의 번호와 예약날짜로 예약 목록 불러오기(서버 API)
      selectCarAndDrvDate(e.target.value); // 변경된 차량의 번호의 모든 운행 정보 불러오기 (서버 API)
    }
  }

  useEffect(() => {
    // ** 신규운행생성 메뉴 **
    // 예약의 시간 정보(년도, 월, 일, 시, 분, 운행 총시간)가 모두 있을 때, 승/하차 시간을 파싱하기 위함, 
    // rsvYears, rsvMonth, rsvDay, rsvHour, rsvMinute, totalTime의 시간 관련 값들이 변경 될 때마다 실행하여야 한다
    // 선택 예약시간으로, 출발시간을 저장하고, 출발시간에 운행 소요시간을 더하여, 도착시간을 구해 저장해 준뒤,
    // 해당 출발시간을 토대로, 타임큐브의 말풍선의 위치를 저장해준다.
    if (rsvYears && rsvMonth && rsvDay && rsvHour && rsvMinute && totalTime) {
      setOpen(false); // 혹시 모를 타임큐브 말풍선을 닫는 값으로 설정
      var tmp = '';
      var tmpDate = new Date();
      // 운행 총 시간을 10분단위로 변경
      if (Math.ceil(totalTime / 60) % 10 != 0) {
        tmp = Math.ceil(Math.ceil(totalTime / 60) / 10) * 10;
      } else {
        tmp = Math.ceil(totalTime / 60);
      }
      var tmp_hours = rsvHour; // 예상 도착 시간(시)
      var tmp_mins = rsvMinute; // 예샹 도착 시간(분)
      if (Number(rsvMinute) + Number(tmp) < 60) { // 예약 시간 + 총 운행시간이 60분 미만인 경우
        tmp_mins = Number(rsvMinute) + Number(tmp);
      } else { // 예약 시간 + 총 운행시간이 60분 이상인 경우, 
        tmp_mins = Number(rsvMinute) + Number(tmp) - 60 == 0 ? "00" : Number(rsvMinute) + Number(tmp) - 60; // 합한 시간에서 60을 빼 분을 구함
        tmp_hours = Number(tmp_hours) + 1 < 10 ? "0" + (Number(tmp_hours) + 1) : Number(tmp_hours) + 1; // 예약 시간에서 +1한다
      }

      // 승차시간 파싱
      setParsedDepDate(String(rsvYears + rsvMonth + rsvDay + rsvHour + rsvMinute + "00")); 

      // 예상 도착시간이 24시 이후인 경우
      if (tmp_hours > 23) {
        tmpDate.setFullYear(Number(rsvYears));
        tmpDate.setMonth(Number(rsvMonth) - 1);
        tmpDate.setDate(Number(rsvDay));
        tmpDate.setHours(Number(tmp_hours));
        tmpDate.setMinutes(Number(tmp_mins));
        let year = tmpDate.getFullYear();
        let month = (tmpDate.getMonth() + 1) < 10 ? '0' + (tmpDate.getMonth() + 1) : tmpDate.getMonth() + 1;
        let day = tmpDate.getDate() < 10 ? '0' + tmpDate.getDate() : tmpDate.getDate();
        let hour = tmpDate.getHours() < 10 ? '0' + tmpDate.getHours() : tmpDate.getHours();
        let min = tmpDate.getMinutes() < 10 ? '0' + tmpDate.getMinutes() : tmpDate.getMinutes();
        // date obj를 사용하여, 다음 날의 정보를 얻어온다.(년, 월이 바뀔수 있으므로 date obj에 set한뒤 변경 된 값에서 다시 추출하는 형식으로 함)
        setParsedDestDate(String(year + month + day + hour + min + "00")); // 하차시간 파싱
      } else {
        setParsedDestDate(String(rsvYears + rsvMonth + rsvDay + tmp_hours + tmp_mins + "00")); // 하차시간 파싱
      }
      if (((Number(rsvHour) * 60) + Number(rsvMinute)) > 1430 || ((Number(rsvHour) * 60) + Number(rsvMinute)) < 360) {
        // 예약하고자하는 시간이, 범위를 벗어난 경우 06:00(360)(타임큐브 데이터 포멧)으로 맞춘다
        setTimeSheetId(360);
      } else {
        setTimeSheetId((Number(rsvHour) * 60) + Number(rsvMinute));
      }
    }
  }, [rsvYears, rsvMonth, rsvDay, rsvHour, rsvMinute, totalTime]);

  useEffect(() => {
    // ValidChecker 함수를 통해 입력된 값들이 유효한 테이터 인지 확인 후, 선택된 예약 정보들이 예약 가능한지 유/무를 저장
    // 배차하기 버튼 활성화용 
    setCheckValidInside(ValidChecker());
  }, [
    selectStation.dep.data, selectStation.dest.data, radioRouteNumber, timeSheetId, addDrv,
    passenger, parsedDepDate, parsedDestDate, rsvTimeTablesList, riderPhone, riderName,
    busrouteCategory, open]);


  useEffect(() => {
    // 입력된 정보들이 예약 가능한 정보들이면, 해당 정보들을 setGetReservationDatas state 객체에 넣어 Reservation으로 넘겨준다
    if (checkValidInside) {
      // Reservation의 setCheckValid state객체에 배차하기 버튼 활성화 여부 상태를 넣는다.
      setCheckValid(checkValidInside);
      // Reservation의 setGetReservationDatas state객체에 입력된 정보들을 넣는다.
      setGetReservationDatas({
        ...getReservationDatas,
        phone: riderPhone,
        name: riderName,
        rsv_dep_station_no: selectStation.dep.data.id,
        rsv_dep_station_name: selectStation.dep.data.name,
        rsv_dep_time: parsedDepDate,
        rsv_dest_station_no: selectStation.dest.data.id,
        rsv_dest_station_name: selectStation.dest.data.name,
        rsv_dest_time: parsedDestDate,
        rsv_est_distance: totalDistance,
        rsv_est_time: totalTime,
        rsv_operator_no: consultant.operator_no,
        rsv_person_cnt: passenger,

        drv_car_no: carNum,
        drv_driver_no: diverNum,
        drv_route_no: radioRouteNumber,

        drv_no: addDrv,
        car_name: carName,
      });
    } else {
      setCheckValid(checkValidInside);
    }
  }, [checkValidInside, riderPhone, riderName, selectStation,
    parsedDepDate, parsedDestDate, totalDistance, totalTime,
    passenger, carNum, diverNum, radioRouteNumber, addDrv, carName,
    rsvHour, rsvMinute]);

  /**
   * 배차하기 진행 시, 값들이 입력 되어 있는지 판별하고, 예약 시간이 예약 가능한 시간대 인지 판별하기 위한 함수로
   * 예약 가능한 정보들이 입력된 경우 True, 불가능한 정보인 경우 False 리턴
   */
  const ValidChecker = () => {
    if (selectStation.dep.data && selectStation.dest.data && radioRouteNumber &&
      passenger && totalTime && parsedDepDate && parsedDestDate) {

      if (riderName != '') {
        setRiderNameCheck(true);
      } else {
        setRiderNameCheck(false); // 승객 이름 미입력시 알림 글 활성화
      }
      if (riderPhone != '') {
        setRiderPhoneCheck(true);
      } else {
        setRiderPhoneCheck(false); // 승객 전화번호 미입력시 알림 글 활성화
      }

      if (riderName != '' && riderPhone != '') {
        // 신규 운행 생성인 경우
        if (busrouteCategory) {
          var drvStTime = (Number(rsvHour) * 60) + Number(rsvMinute); // 승차시간(hhmm -> ((hh * 60) + mm)분으로 타임큐브 데이터 포멧으로 변경)
          var tmpTotal = '';
          tmpTotal = Math.ceil(Math.ceil(totalTime / 60) / 10) * 10;
          var drvArrTime = (Number(rsvHour) * 60) + Number(rsvMinute) + Number(tmpTotal); // 하차시간(승차시간 + 운행시간)(타임큐브 데이터 포멧으로 변경)
          var drvTime_fl = true; // 예약 가능한 시간인지에 대한 flag
          //예약의 출발 시간과 도착시간, 사이시간이 예약 불가능 배열에 포함되어있는지 탐색
          for (var i = drvStTime; i < drvArrTime; i += 10) {
            if (rsvTimeTablesList.includes(i)) {
              drvTime_fl = false;
            }
          }
          // 예약 출발시간이 범위안에 존재하는지 탐색
          if (drvStTime < 360 || drvStTime > 1440) {
            drvTime_fl = false;
          }

          // 예약 가능한 경우
          if (drvTime_fl) {
            // 스크롤 이동시 40을 빼주는 이유는 최상단에 붙을 경우, 말풍선이 짤리기 때문
            document.getElementById(Number(drvStTime) - 40).scrollIntoView(); // 스크롤 이동
            document.getElementById(Number(drvStTime)).click();
            setOpen(true); // 타임 큐브 말풍선 활성화
            return true;
          }
          // 예약 불가능한 경우(예약 시간 중복)
          else {
            // 예약 시간이 6시 이전이거나 24시 이후인지 판별 하여, 해당되면 타임큐브의 스크롤을 최상단(6시)으로 이동시켜 준다.
            if (drvStTime < 360 || drvStTime > 1440) {
              document.getElementById(Number(360) - 40).scrollIntoView();
            } else {
              // 스크롤 이동
              document.getElementById(Number(drvStTime) - 40).scrollIntoView();
            }
            setOpen(false); // 타임 큐브 말풍선 비활성화
            setOpenAlertModal(true); // 예약 불가 알림 활성화
            return false;
          }
        } else {
          // 기존운행에 추가인 경우
          if (addDrv) {
            // 운행번호 체크
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    } else {
      // 타임 큐브 말풍선 비활성화
      setOpen(false);
      return false;
    }
  }


  useEffect(() => {
    // 걸려온 전화에 대한 승객 정보(redux)가 있을 때, 승객의 이름과 전화번호의 존재여부를 판별하여 해당 객체에 넣어준다
    if (memberInfo.riderInfoSave && memberInfo.riderInfoSave.dataBool) {
      if (memberInfo.riderInfoSave.riderPhone != '') {
        setRiderPhone(memberInfo.riderInfoSave.riderPhone);
      }
      if (memberInfo.riderInfoSave.riderName != '') {
        setRiderName(memberInfo.riderInfoSave.riderName);
      }
    }
  }, []);

  /**
   * 총 운행 시간데이터(초)를 00시00분, 00분과 같이 처리해주기 위해 사용
   * @param {*} time 운행 시간(초)
   * 최종적으로 구해진 시간은 10분단위 이어야 하므로, 11분과 같은 경우 올림으로 20분으로 만들어 줘야한다
   */
  const handleTotalTime = time => {
    let text = '';
    let minTime = Math.ceil(time / 60);
    if ((Number(minTime) % 10) != 0) {
      minTime = Math.ceil(minTime / 10) * 10;
    }
    if (minTime > 59) {
      text = parseInt(minTime / 60) + "시간" + parseInt(minTime % 60) < 10 ? "0" + parseInt(minTime % 60) : parseInt(minTime % 60) + "분";
    } else {
      text = parseInt(minTime % 60) < 10 ? "0" + parseInt(minTime % 60) : parseInt(minTime % 60) + "분";
    }
    return text;
  }


  return (
    <React.Fragment>
      <div className={classes.busMenu1}>
        <div className={classes.buscontent} >
          <div style={{ height: 66 }}>
            <FormControl style={{ width: '44%', marginRight: '6%' }}>
              <InputLabel htmlFor="rider-name" style={{ color: '#000000' }}>승객명</InputLabel>
              {isRsvPerson ?
                <Input
                  id="rider-name"
                  value={riderName}
                  style={{ paddingLeft: 5, paddingRight: 5 }}
                  onChange={handleName}
                  error={false}
                  readOnly //앱 예약인 경우 승객명 변경 불가
                />
                :
                <Input
                  id="rider-name"
                  value={riderName}
                  style={{ paddingLeft: 5, paddingRight: 5 }}
                  onChange={handleName}
                  startAdornment={
                    <span></span>
                  }
                  error={false}
                />
              }
              {riderNameCheck ?
                ''
                :
                <span style={{ color: "#d62b28", fontWeight: "bold" }}>승객명을 입력해 주세요.</span>
              }
            </FormControl>
            <FormControl style={{ width: '50%', }}>
              <InputLabel htmlFor="rider-phone" style={{ color: '#000000' }}>전화번호</InputLabel>
              {isRsvPerson ?
                <Input
                  id="rider-phone"
                  value={riderPhone}
                  style={{ paddingLeft: 5, paddingRight: 5 }}
                  onChange={handleTel}
                  readOnly //앱 예약인 경우 승객전화 변경 불가
                  error={false}
                />
                :
                <Input
                  id="rider-phone"
                  value={riderPhone}
                  style={{ paddingLeft: 5, paddingRight: 5 }}
                  onChange={handleTel}
                  startAdornment={
                    <span></span>
                  }
                  error={false}
                />
              }
              {riderPhoneCheck ?
                ''
                :
                <span style={{ color: "#d62b28", fontWeight: "bold" }}>전화번호를 입력해 주세요.</span>
              }
            </FormControl>
          </div>
          <div style={{ marginTop: 5 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
              <Grid>
                <span className={classes.tomorrowBtn} style={{ float: "left", marginTop: 0 }} onClick={selectTomorrow}>내일</span>
                <KeyboardDatePicker
                  autoOk='true'
                  variant="inline"
                  format="yyyy/MM/dd"
                  margin="normal"
                  id="date-picker-inline"
                  inputVariant='standard'
                  allowKeyboardControl={false}
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  maxDate={maxLimitDate}
                  minDate={minLimitDate}
                  style={{ marginTop: 0, width: 140 }}
                  error={false}
                  InputLabelProps={{
                    shrink: true,
                    root: "#000000"
                  }}
                />

                <span style={{ marginLeft: 8, marginRight: 4, }}>시</span>
                <Select
                  className={classes.timeselect}
                  native={true}
                  value={rsvHour}
                  onChange={handleChangeHour}
                  style={{ width: 50, margin: "0 4px", }}
                  error={false}
                >
                  <option value={'06'}>&nbsp;06</option>
                  <option value={'07'}>&nbsp;07</option>
                  <option value={'08'}>&nbsp;08</option>
                  <option value={'09'}>&nbsp;09</option>
                  <option value={'10'}>&nbsp;10</option>
                  <option value={'11'}>&nbsp;11</option>
                  <option value={'12'}>&nbsp;12</option>
                  <option value={'13'}>&nbsp;13</option>
                  <option value={'14'}>&nbsp;14</option>
                  <option value={'15'}>&nbsp;15</option>
                  <option value={'16'}>&nbsp;16</option>
                  <option value={'17'}>&nbsp;17</option>
                  <option value={'18'}>&nbsp;18</option>
                  <option value={'19'}>&nbsp;19</option>
                  <option value={'20'}>&nbsp;20</option>
                  <option value={'21'}>&nbsp;21</option>
                  <option value={'22'}>&nbsp;22</option>
                  <option value={'23'}>&nbsp;23</option>
                </Select>
                <span style={{ marginLeft: 8, marginRight: 4, }}>분</span>
                <Select
                  native={true}
                  value={rsvMinute}
                  onChange={handleChangeMinute}
                  style={{ width: 50, margin: "0 4px", }}
                  error={false}
                >
                  <option value={'00'}>&nbsp;00</option>
                  <option value={'10'}>&nbsp;10</option>
                  <option value={'20'}>&nbsp;20</option>
                  <option value={'30'}>&nbsp;30</option>
                  <option value={'40'}>&nbsp;40</option>
                  <option value={'50'}>&nbsp;50</option>
                </Select>
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
          <div id="searchBarWrap" className={classes.searchBarWrap}>
            <Paper className={classes.searchBarPaper}>
              <InputBase
                id="searchBar" autoComplete="off" placeholder="주소 검색"
                className={classes.searchBar}
                onChange={handleFindStation}
                onFocus={handleFocusInFindStation}
                onBlur={handleFocusOutFindStation}
                value={findStationName}
              />
              {!findStationName ?
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>
                :
                <IconButton type="submit" onClick={searchClear} className={classes.iconButton} aria-label="search">
                  <CloseIcon />
                </IconButton>
              }
            </Paper>
            {!isFindChecker ?
              ''
              :
              <div id="searchResult" className={classes.searchResult}>
                <div className={classes.drt_searchs}>
                  <div className={classes.searchSeq}>정류소</div>
                  {findDrtStationsValue == '' ?
                    <div style={{ height: 20 }}></div>
                    :
                    !findDrtStationsValue.seq ?
                      '검색 결과가 없습니다.'
                      :
                      findDrtStationsValue.stations.data.map((findStation, i) => {
                        return (
                          <div className={classes.searchResultObj} key={i} onClick={() => handleClickFind_DRT_Station(findStation)} style={{ cursor: "pointer" }}>
                            <img style={{ width: 10, height: 13, position: "absolute", left: 6, top: 3, }} src='/static/mapicon/drt_busstation.png' alt="" />
                            <div style={{ marginLeft: 13, }}>
                              <span style={{ fontSize: 13, color: "#313131", letterSpacing: -0.13, }}>{findStation.station_nm}</span>
                              <span style={{ fontSize: 10, color: "#717171", marginLeft: 2, letterSpacing: -0.1, verticalAlign: "middle" }}>({findStation.station_nm})</span>
                            </div>
                          </div>
                        )
                      })
                  }
                </div>
                <div className={classes.sk_searchs}>
                  <div className={classes.searchSeq}>주소</div>
                  {!findDrtStationsValue2 ?
                    ''
                    :
                    !searchValResult ?
                      '검색 걸과가 없습니다.'
                      :
                      searchValResult.map((searchValResult, i) => {
                        return (
                          <div className={classes.searchResultObj} key={i} onClick={() => handleClickFind_SK_Address(searchValResult)} style={{ cursor: "pointer" }}>
                            {searchValResult.seq2 != 'tmap' ?
                              <img style={{ width: 16, height: 16, position: "absolute", left: 4, top: 3, }} src={searchValResult.seq} alt="" />
                              :
                              <img style={{ width: 10, height: 13, position: "absolute", left: 6, top: 3, }} src={searchValResult.seq} alt="" />
                            }
                            <div style={{ marginLeft: 13, }}>
                              <span style={{ fontSize: 13, color: "#313131", letterSpacing: -0.13, }}>{searchValResult.name}</span>
                              <span style={{ fontSize: 10, color: "#717171", marginLeft: 2, letterSpacing: -0.1, verticalAlign: "middle" }}>({searchValResult.address})</span>
                            </div>
                          </div>
                        )
                      })
                  }

                </div>
              </div>
            }
          </div>

          <div id="startStation" className={classes.stationInfoWrap}>
            <div>승차 정류소</div>
            <div className={classes.stationSelectBar}>
              <div style={{ paddingLeft: 8 }}>
                {!selectStation.dep.data ?
                  '-'
                  :
                  <img className={classes.stationIcon} src={selectStation.dep.data.img} alt="" />
                }
              </div>
              <div className={classes.selectedStationInfo}>
                <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                  {!selectStation.dep.data ? '' : selectStation.dep.data.name}
                </span>
                <span style={{ fontSize: 10, margin: "5px 3px 0 3px", color: "#212121" }}>
                  {!selectStation.dep.data ? '' : '|'}
                </span>
                <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                  {!selectStation.dep.data ? '' : selectStation.dep.data.id}
                </span>
                <span style={{ fontSize: 10, margin: "5px 0 0 3px", color: "#717171" }}>
                  {!selectStation.dep.data ? '' : '(' + selectStation.dep.data.address + ')'}
                </span>
              </div>
              {!selectStation.dep.data || isRsvPerson ?
                ''
                :
                <IconButton onClick={() => selectCancel('dep')} className={classes.selectCancel} aria-label="search">
                  <CloseIcon />
                </IconButton>
              }
            </div>

            {memberInfo.riderInfoSave.dataBool && memberInfo.riderInfoSave.riderCurStart.length > 0 ?
              <div className={classes.currentStations}>
                {memberInfo.riderInfoSave.riderCurStart.map(currentStart => (
                  <div className={classes.CurLists} key={currentStart.station_no} onClick={() => handleClickCurStart(currentStart)} value="start">
                    <span style={{ fontSize: 10, color: "#212121", }}>최근승차지</span>
                    <img style={{ width: 11, height: 11, }} src="/static/mapicon/drt_busstation.png" alt="" />
                    <span style={{ fontSize: 10, color: "#313131", }}>{currentStart.station_nm}</span>
                    <span style={{ fontSize: 10, color: "#313131", }}>|</span>
                    <span style={{ fontSize: 10, color: "#313131", }}>{currentStart.station_no}</span>
                    <span style={{ fontSize: 10, color: "#717171", }}>({currentStart.station_address})</span>
                  </div>
                ))}
              </div>
              :
              ''
            }
          </div>

          <div id="arrivalStation" className={classes.stationInfoWrap}>
            <div>하차 정류소</div>
            <div className={classes.stationSelectBar}>
              <div style={{ paddingLeft: 8 }}>
                {!selectStation.dest.data ?
                  '-'
                  :
                  <img className={classes.stationIcon} src={selectStation.dest.data.img} alt="" />
                }
              </div>
              <div className={classes.selectedStationInfo}>
                <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                  {!selectStation.dest.data ? '' : selectStation.dest.data.name}
                </span>
                <span style={{ fontSize: 10, margin: "5px 3px 0 3px", color: "#212121" }}>
                  {!selectStation.dest.data ? '' : '|'}
                </span>
                <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                  {!selectStation.dest.data ? '' : selectStation.dest.data.id}
                </span>
                <span style={{ fontSize: 10, margin: "5px 0 0 3px", color: "#717171" }}>
                  {!selectStation.dest.data ? '' : '(' + selectStation.dest.data.address + ')'}
                </span>
              </div>
              {!selectStation.dest.data || isRsvPerson ?
                ''
                :
                <IconButton onClick={() => selectCancel('dest')} className={classes.selectCancel} aria-label="search">
                  <CloseIcon />
                </IconButton>
              }
            </div>
            {memberInfo.riderInfoSave.dataBool && memberInfo.riderInfoSave.riderCurArrival.length > 0 ?
              <div className={classes.currentStations}>
                {memberInfo.riderInfoSave.riderCurArrival.map(currentArrival => (
                  <div className={classes.CurLists} key={currentArrival.station_no} onClick={() => handleClickCurArrival(currentArrival)} value="arrival">
                    <span style={{ fontSize: 10, color: "#212121", }}>최근하차지</span>
                    <img style={{ width: 11, height: 11, }} src="/static/mapicon/drt_busstation.png" alt="" />
                    <span style={{ fontSize: 10, color: "#313131", }}>{currentArrival.station_nm}</span>
                    <span style={{ fontSize: 10, color: "#313131", }}>|</span>
                    <span style={{ fontSize: 10, color: "#313131", }}>{currentArrival.station_no}</span>
                    <span style={{ fontSize: 10, color: "#717171", }}>({currentArrival.station_address})</span>
                  </div>
                ))}
              </div>
              :
              ''
            }
          </div>

          <div className={classes.clientOtherInfo}>
            <div className={classes.clientMembers}>
              <div>인원수</div>
              <select className={classes.selectBox} onChange={handlePassengerChange}>
                {passenger == 1 ? <option value="1" selected>1</option> : <option value="1" >1</option>}
                {passenger == 2 ? <option value="2" selected>2</option> : <option value="2" >2</option>}
                {passenger == 3 ? <option value="3" selected>3</option> : <option value="3" >3</option>}
                {passenger == 4 ? <option value="4" selected>4</option> : <option value="4" >4</option>}
                {passenger == 5 ? <option value="5" selected>5</option> : <option value="5" >5</option>}
                {passenger == 6 ? <option value="6" selected>6</option> : <option value="6" >6</option>}
                {passenger == 7 ? <option value="7" selected>7</option> : <option value="7" >7</option>}
                {passenger == 8 ? <option value="8" selected>8</option> : <option value="8" >8</option>}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 10 }}>
            <div style={{ width: "50%" }}>예상 승객 이동 시간 : {personTotalTime ? personTotalTime + ' 분' : '-'}  </div>
            <div style={{ width: "50%" }}>예상 노선 운행 시간 : {totalTime ? Math.ceil(totalTime / 60) + ' 분' : '-'}  </div>
          </div>
          {finalRoutesInfoList ?
            <RadioGroup aria-label="routes" name="routes" value={radioRouteNumber} style={{ display: "block", height: 90, overflowY: "auto" }}>
              {finalRoutesInfoList.map((finalRoutesInfo, i) => (
                <FormControlLabel
                  style={{ margin: 0, paddingRight: 10, width: "50%" }}
                  className={classes.formControlLabel}
                  control={
                    <Radio key={i} onChange={() => handleRouteChange(finalRoutesInfo)} value={finalRoutesInfo.route_no} />
                  }
                  label={finalRoutesInfo.route_nm}
                />
              ))}
            </RadioGroup>
            :
            ''
          }
        </div>
      </div> {/* busmenu1 END */}

      <div className={classes.busMenu2}>
        <Paper elevation={0} className={classes.busmenupaper}>
          <div className={classes.busroute}>
            {busrouteCategory ?
              <Grid container spacing={0} className={classes.busrouteInfo}>
                <div className={classes.busrouteCategory} style={{ borderTop: "1px solid #dee0e8", borderLeft: "1px solid #dee0e8" }} onClick={() => handleChangeRoute(true)}>
                  <span className={classes.routeTimeText} style={{ color: "#4fa0cb" }}>신규운행 생성</span>
                </div>
                <div className={classes.busrouteCategory} style={{ backgroundColor: '#b8babf' }} onClick={() => handleChangeRoute(false)}>
                  <span className={classes.routeTimeText} style={{ color: "#ffffff" }}>기존운행에 추가</span>
                </div>
              </Grid>
              :
              <Grid container spacing={0} className={classes.busrouteInfo}>
                <div className={classes.busrouteCategory} style={{ backgroundColor: '#b8babf' }} onClick={() => handleChangeRoute(true)}>
                  <span className={classes.routeTimeText} style={{ color: "#ffffff" }}>신규운행 생성</span>
                </div>
                <div className={classes.busrouteCategory} style={{ borderTop: "1px solid #dee0e8", borderRight: "1px solid #dee0e8" }} onClick={() => handleChangeRoute(false)}>
                  <span className={classes.routeTimeText} style={{ color: "#4fa0cb" }}>기존운행에 추가</span>
                </div>
              </Grid>
            }
            <div className={classes.driverInfo}>
              <div style={{ width: "35%", paddingLeft: 15 }}>
                <select id="selectCar" value={carNum} className={classes.selectBoxBus} onChange={handleChangCarNum} style={{ width: "100%", minHeight: 24, }}>
                  {carList && carList.data.length > 0 && carList.data.map(car => (
                    <option value={car.car_no} key={car.car_no}>{car.car_nm}</option>
                  ))}
                </select>
              </div>
              <div style={{ width: "30%", paddingLeft: 15 }}>
                <select value={diverNum} className={classes.selectBoxBus} onChange={handleChangDriverNum} style={{ width: "100%", }}>
                  {driverLists && driverLists.data.length > 0 && driverLists.data.map(driver => (
                    <option value={driver.driver_no} key={driver.driver_no}>{driver.employ_nm}</option>
                  ))}
                  <option value=' '>보류</option>
                </select>
              </div>
            </div>

            <div className={classes.selectbusroute}>
              {busrouteCategory ?
                <React.Fragment>
                  <div id='testScroll' className={classes.busRouteTimeSheet} style={{ position: 'relative' }}>
                    <div className={classes.tinyHidden} id='320'></div>
                    <div className={classes.tinyHidden} id='330'></div>
                    <div className={classes.tinyHidden} id='340'></div>
                    <div className={classes.tinyHidden} id='350'></div>
                    {timeTables.map((timetable, i) => (
                      <Grid container key={'sht' + i}>
                        <div>{i + 6 < 10 ? '0' + (i + 6) : i + 6}</div>
                        <div>
                          <div className={classes.horizontalLine}></div>
                          {timetable.map((time, j) => (
                            <div className={classes.tiny} id={time.time} onClick={handlePopper('right')} isrsv='false' key={time.time}>
                            </div>
                          ))}
                        </div>

                      </Grid>
                    ))}
                    <div className={classes.tinyHidden} id='1390'></div>
                    <div className={classes.tinyHidden} id='1400'></div>
                    <div className={classes.tinyHidden} id='1410'></div>
                    <div className={classes.tinyHidden} id='1420'></div>
                    <Popper id='testpopper' disablePortal={true} open={open} anchorEl={anchorEl} placement={placement} transition style={{ zIndex: 1201 }}>
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                          <div style={{ display: "flex", backgroundColor: "transparent", }}>
                            <div className={classes.popoverInArrowWrapper}>
                              <div className={classes.popoverInArrow1}></div>
                              <div className={classes.popoverInArrow2}></div>
                            </div>
                            <div className={classes.popoverBoxWrapper}>
                              <div className={classes.popOverBox} style={{ marglinLeft: 5, }}>
                                <span className={classes.routeTimeText}>{parsedDepDate.substring(8, 10) + ":" + parsedDepDate.substring(10, 12)}
                                  <img style={{ verticalAlign: "middle" }} src="/static/reserve_arrowS.png" alt="reserveArrow" />
                                  {parsedDestDate.substring(8, 10) + ":" + parsedDestDate.substring(10, 12)}
                                </span>
                                <span className={classes.routeTimeText} style={{ size: 14, color: "#d62b28" }}> ({handleTotalTime(totalTime)} 소요) </span>
                                <div>
                                  승차 <img
                                    src="/static/mapicon/drt_busstation.png"
                                    alt="drt_busstation"
                                    style={{ width: 16, height: 16, verticalAlign: "middle" }} /> <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                                    {selectStation == '' ? '' : selectStation.dep.data.name}
                                  </span>
                                  <span style={{ margin: "5px 3px 0 3px", color: "#212121" }}>
                                    {selectStation == '' ? '' : '|'}
                                  </span>
                                  <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                                    {selectStation == '' ? '' : selectStation.dep.data.id}
                                  </span>
                                </div>
                                <div>
                                  하차 <img
                                    src="/static/mapicon/drt_busstation.png"
                                    alt="drt_busstation"
                                    style={{ width: 16, height: 16, verticalAlign: "middle" }} /> <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                                    {selectStation == '' ? '' : selectStation.dest.data.name}
                                  </span>
                                  <span style={{ margin: "5px 3px 0 3px", color: "#212121" }}>
                                    {selectStation == '' ? '' : '|'}
                                  </span>
                                  <span style={{ fontSize: 13, marginTop: 2, color: "#212121" }}>
                                    {selectStation == '' ? '' : selectStation.dest.data.id}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Fade>
                      )}
                    </Popper>
                  </div>
                </React.Fragment>

                :
                // 기존운행에 추가
                <div className={classes.busRouteTimeSheet}>
                  <Grid container>
                    {driveRsvLists.length < 1 ?
                      ""
                      :
                      driveRsvLists.map((driveList, j) => ( //driveList ==> 선택된 노선과 같은 노선배열[0], 선택된 노선과 다른 노선배열[1] 으로 구성
                        driveList.map((drive, i) => (
                          <div id={"drv_" + drive.drvNo} className={classes.bookingLists} key={'routeY_' + i}>
                             {/* 선택할수 없는 기존운행 */}
                            {j != 0 ?
                              <div className={classes.bookingHeader}>
                                <div className={classes.bookingInfoWrap}>
                                  <div className={classes.bookingNumber}>{i + 1}</div>
                                  <div className={classes.bookingPeople}>
                                    좌석&nbsp;{Number(drive.rsvPerson)}/{Number(drive.totalSeat)}&nbsp;
                                    {Number(drive.totalSeat) - Number(drive.rsvPerson) == 0 ?
                                      <span style={{ color: "#000000" }}>(만석)</span>
                                      : Number(drive.totalSeat) - Number(drive.rsvPerson) < Number(passenger) ?
                                        <span style={{ color: "#d62b28" }}>(인원 초과)</span>
                                        :
                                        <span style={{ color: "#d62b28" }}>({Number(drive.totalSeat) - Number(drive.rsvPerson)}석)</span>
                                    }
                                  </div>
                                  <div className={classes.bookingLine}>{drive.routeNm}</div>
                                </div>
                                <div className={classes.bookingTimeWrap} style={{ display: "flex" }}>
                                  <div style={{ width: 35, }}>

                                    <input index={i} type="checkbox" name="drives" value={drive.drvNo} onChange={handelCheckDrv} disabled checked={false} />
                                  </div>
                                  <div id={"drvT_" + drive.drvNo} className={classes.bookingTime} start_t={drive.startT} end_t={drive.endT}>
                                    {drive.startT.substring(8, 10)}:{drive.startT.substring(10, 12)}&nbsp;~&nbsp;{drive.endT.substring(8, 10)}:{drive.endT.substring(10, 12)}&nbsp;&nbsp;&nbsp;[{handleTotalTime(drive.totalTime)} 소요]
                    </div>
                                </div>
                              </div>
                              :
                             //  선택할수 있는 기존운행   
                              <div className={classes.bookingHeader} >
                                <div className={classes.bookingInfoWrap}>
                                  <div className={classes.bookingNumber}>{i + 1}</div>
                                  <div className={classes.bookingPeople}>
                                    좌석&nbsp;{Number(drive.rsvPerson)}/{Number(drive.totalSeat)}&nbsp;
                                    {Number(drive.totalSeat) - Number(drive.rsvPerson) == 0 ?
                                      <span style={{ color: "#000000" }}>(만석)</span>
                                      :
                                      Number(drive.totalSeat) - Number(drive.rsvPerson) < Number(passenger) ?
                                        <span style={{ color: "#d62b28" }}>(인원 초과)</span>
                                        :
                                        <span style={{ color: "#d62b28" }}>({Number(drive.totalSeat) - Number(drive.rsvPerson)}석)</span>
                                    }
                                  </div>
                                  <div className={classes.bookingLine}>{drive.routeNm}</div>
                                </div>
                                <div className={classes.bookingTimeWrap} style={{ display: "flex" }}>
                                  <div style={{ width: 35, }}>
                                    {Number(drive.totalSeat) - Number(drive.rsvPerson) < Number(passenger) ?
                                      <input index={i} type="checkbox" name="drives" value={drive.drvNo} onChange={handelCheckDrv} disabled checked={false} />
                                      :
                                      <input index={i} type="checkbox" name="drives" value={drive.drvNo} onChange={handelCheckDrv} />
                                    }
                                  </div>
                                  <div id={"drvT_" + drive.drvNo} className={classes.bookingTime} start_t={drive.startT} end_t={drive.endT}>
                                    {drive.startT.substring(8, 10)}:{drive.startT.substring(10, 12)}&nbsp;~&nbsp;{drive.endT.substring(8, 10)}:{drive.endT.substring(10, 12)}&nbsp;&nbsp;&nbsp;[{handleTotalTime(drive.totalTime)} 소요]
                                  </div>
                                </div>
                              </div>
                            }
                            <div className={classes.bookingBody}>
                              <div style={{ width: "100%" }}>
                                <ExpansionPanel
                                  style={{ border: 'none', boxShadow: 'none' }}
                                >
                                  <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon style={{ position: "absolute" }} />}
                                    style={{ padding: '0 24px 0 0', position: 'relative' }}
                                  >
                                    <div className={classes.bookingStationWrap} style={{ paddingTop: 8, }} value="112233">
                                      <div className={classes.bookingIconWrap}>
                                        <img className={classes.bookingIcon} src="/static/card-start-circle-n.svg" alt="" />
                                      </div>
                                      <div className={classes.bookingStationInfo}>
                                        <span className={classes.bookingStation}>{drive.startS.station_nm}</span>
                                      </div>
                                    </div>
                                  </ExpansionPanelSummary>
                                  <ExpansionPanelDetails style={{ display: "block", padding: "0 0 0 40px" }}>
                                    {drive.startS.station_no == selectStation.dep.data.id ?
                                      <span className={classes.routeStations} style={{ color: "red", marginTop: 2, marginBottom: 2 }}>{drive.startS.station_nm}</span>
                                      :
                                      <span className={classes.routeStations} style={{ marginTop: 2, marginBottom: 2 }}>{drive.startS.station_nm}</span>
                                    }
                                    {drive.drvStation.map((station, i) => (
                                      station.station_no == selectStation.dest.data.id || station.station_no == selectStation.dep.data.id ?
                                        <div className={classes.routeStations} style={{ color: "red", marginTop: 2, marginBottom: 2 }}>{station.station_nm}</div>
                                        :
                                        <div className={classes.routeStations} style={{ marginTop: 2, marginBottom: 2 }}>{station.station_nm}</div>
                                    ))}
                                    {drive.endS.station_no == selectStation.dest.data.id ?
                                      <span className={classes.routeStations} style={{ color: "red", marginTop: 2, marginBottom: 2 }} >{drive.endS.station_nm}</span>
                                      :
                                      <span className={classes.routeStations} style={{ marginTop: 2, marginBottom: 2 }}>{drive.endS.station_nm}</span>
                                    }
                                  </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <div className={classes.bookingStationWrap} style={{ paddingTop: 8, paddingBottom: 8 }}>
                                  <div className={classes.bookingIconWrap}>
                                    <img className={classes.bookingIcon} src="/static/card-end-circle-n.svg" alt="" />
                                  </div>
                                  <div className={classes.bookingStationInfo}>
                                    <span className={classes.bookingStation}>{drive.endS.station_nm}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        ))))
                    }
                  </Grid>
                </div>
              }
            </div>

          </div>
        </Paper>
      </div>

      <Modal
        disableEnforceFocus   // 오토포커스 테두리 삭제
        disableAutoFocus
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openAlertModal}
        onClose={handleAlertModal}
        BackdropComponent={Backdrop}
        hideBackdrop
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div style={{ width: "100%", height: "100%", backgroundColor: "translate", position: 'relative' }} onClick={handleAlertModal}>
          <div style={{ width: 365, heigth: 100, top: 150, right: 50, position: 'absolute', backgroundColor: 'red', paddingLeft: 20, borderRadius: 15 }}>
            <div style={{ color: "#ffffff" }}>
              <h3>해당 시간대는 예약이 불가하여,</h3>
              <h3>다른 시간으로 안내 부탁드립니다.</h3>
            </div>
          </div>
        </div>
      </Modal>


    </React.Fragment>
  );
};
ReservationContent.getInitialProps = async props => {
  const { store, isServer } = props;
  store.dispatch(selectDepStationData());
  store.dispatch(selectDestStationData());
  store.dispatch(loadCarNumRSVDateData());
  store.dispatch(loadDriveSearchCarNumData());
  store.dispatch(loadFindStationName());
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
  }
  return { isServer };
};

const mapStateToProps = state => {
  return {
    selectStation: { dep: state.navermap.depStationInfos, dest: state.navermap.destStationInfos },
    consultant: state.consultant.logindata.data,
    carList: state.buslist.carList,
    carRsvLists: state.buslist.carRsvLists,
    driverLists: state.driver.driverList,
    driveCarNum: state.drive.drv_list.data,
    findStations: state.station.find_st_nm, // 검색 결과, loadFindStationName에서 받아온 데이터,
    rsvPersonData: state.rsvlist.rsvNoData,
    memberInfo: state.member,
  };
};

const mapDispatchToProps = dispatch => ({
  selectDepStationInfos: (depStationInfos) => dispatch(selectDepStationData(depStationInfos)),
  selectDestStationInfos: (destStationInfos) => dispatch(selectDestStationData(destStationInfos)),
  selectCarAndDate: (carNum, rsvDate) => dispatch(loadCarNumRSVDateData(carNum, rsvDate)),
  selectCarAndDrvDate: (carNum) => dispatch(loadDriveSearchCarNumData(carNum)),
  loadFindStationName: (findStationName) => dispatch(loadFindStationName(findStationName)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationContent);
