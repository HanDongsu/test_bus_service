import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Voc from "./Voc";
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import * as sha512 from "./Sha512"; // EICN에서 암호화를 위해 사용, 파일로 저장
import io from 'socket.io-client'; // EICN, socket io를 사용하기 때문에, 패키지 다운로드

import { loadMemberData, loadMemberSearchPhoneData, loadMemberSearchCurStationData, saveCalledRiderInfoData, loadCall2CallEventData } from "../lib/member/actions";
import { saveConsultantState } from "../lib/consultant/actions";

let phoneNum = '';
let phonePeer = '';
let userName = '';
let phoneStatus = '';
let forwardWhen = '';
let forwardNum = '';
let memberStatus = '';
let recordType = '';
let eventNum = '';
let bMemberStatus = '';
let cMemberStatus = '';
let socket = null;

const useStyles = makeStyles(theme => ({
  callStatus: {
    backgroundColor: "#223152",
    height: 60,
    maxWidth: '100%',
    display: "flex",
    boxShadow: 'none',
  },
  buttonIconWrapper: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  buttonIconLogo: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  slideSnack: {
    zIndex: 1220,
    width: "100%",
    height: 60,
    color: '#ffffff',
    backgroundColor: "#223152",
    position: "fixed",
    top: 0,
    left: 0,
  },
  slideSnackRoot: {
    top: 0,
    width: "100%",
    fontSize: 28,

  },
  callInfo: {
    width: "100%",
    display: "flex",
    backgroundColor: "#4fa0c9",
    marginRight: 275,
  },
  callingBell: {
    minWidth: 250,
    paddingLeft: 40,
    paddingRight: 40,
    marginRight: 30,
    display: "flex",
    textAlign: "center",
    paddingTop: 13,
    borderRight: "0.01rem solid #223152",
  },
  callClient: {
    paddingTop: 13,
    marginLeft: 20,
    minWidth: 300,
  },

  callController: {
    width: 275,
    height: 60,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#223152",
    display: "flex",
  },
  callControllerToggle: {
    width: 397,
    // width: 275,
    height: 60,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#223152",
    display: "flex",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalKindWrapper: {
    '&:focus': {
      outline: 'none',
    }
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
  modalContentText: {
    color: '#d62b28',
    fontSize: 14,
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
}));

const CallEventHandler = param => {
  const classes = useStyles();

  const [openModal, setOpenModal] = React.useState(false);
  const [modalKind, setModalKind] = useState('');
  const [callEvent, setCallEvent] = useState(false); // 콜이벤트 여부
  const [callEventOpen, setCallEventOpen] = React.useState(false); // 콜 이벤트 발생 시, 헤더 팝업 여부
  const [callEventStatus, setCallEventStatus] = useState(''); // 전화이벤트 상태(전화옴, 통화중, 전화거는중, 등)
  const [vocOpen, setVocOpen] = useState(false);
  const [holdState, setHoldState] = useState(false); // 보류여부 체크

  const [callNumber, setCallNumber] = useState(''); // 전화번호 저장

   // 전화 번호 검색으로 얻어온 정보를 담을 state 객체
  const [memberDatas, setMemberDatas] = useState({
    dataBool: false, // 승객 정보 유/무
    riderPhone: '', // 승객 전화번호
    riderName: '', // 승객 이름
    riderNo: '', // 승객 고유 번호
    riderCurStart: [], // 승객 최근 승차지
    riderCurArrival: [], // 승객 최근 하차지
  });

  const handleVocOpen = () => {
    setVocOpen(true);
  };

  /**
   * 콜 이벤트로 받은 전화번호를 서버로 전송하여 데이터를 가져온다
   * 
   * @param {*} data 콜이벤트에서 발생한 전화번호
   * 
   * 전화번호가 연속된 숫자(01012345678)로 들어오기 때문에, '-'를 붙여주고
   * 해당 전화번호를 갖고, 전화번호 검색(서버API)로 전송 및 전화번호 state 객체에 저장한다.
   */
  const handleCallNumber = data => {
    if (data.length == 11) {
      var tmp = data.substring(0, 3) + "-" + data.substring(3, 7) + "-" + data.substring(7, 11);
    } else if (data.length == 10) {
      var tmp = data.substring(0, 3) + "-" + data.substring(3, 6) + "-" + data.substring(6, 10);
    } else {
      var tmp = data;
    }

    param.memberPhoneSearch(tmp); // data이 전화번호 데이터, 해당 데이터로 전화번호 검색 (서버 API),
    setCallNumber(tmp); // 전화번호 저장
  }


  useEffect(() => {
    /**
     * 웹에서 로그인 후, 로그인시 사용된 내선번호로 로그인 시도 
     */
    if (param.phoneLineNum) {
      login(param.phoneLineNum);
    }
  }, [param.phoneLineNum])

  /**
   * 전화 끊기, 당겨받기 등 버튼 클릭 시, 팝업 모달 OPEN 시 사용
   * @param {*} num 사용하고자 하는 모달의 번호
   */
  const handleOpenModal = num => {
    setModalKind(num);
    setOpenModal(true);
  };

  /**
   * 전화 끊기, 당겨받기 등 버튼 클릭 시, 팝업 모달을 CLOSE 시 사용
   */
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  /**
   * EICN
   * EICN 서버로 로그인 요청
   * @param {*} lineNumber 내선 번호
   */
  const login = (lineNumber) => {
    var company_id = 'sjdrt'; // 세종시 ID
    var userid = lineNumber; // 상담원 ID
    var exten = lineNumber; // 내선번호
    var passwd = 'sjdrt!234'; // 상담원 ID 비밀번호
    var server_ip = '210.91.209.170'; // EICN 서버 IP
    var nodejs_connector_url = 'http://' + server_ip + ':8087'; // EICN측 서버 URL
    if (company_id == "" || userid == "" || exten == "" || passwd == "" || server_ip == "" || nodejs_connector_url == "") {
      // console.log("로긴 정보를 모두 입력하세요");
      return;
    }
    //패스워드암호화
    passwd = sha512.hex_sha512(passwd);

    //화면에서 가져오는걸로 수정됨
    //소켓프레임으로 IPCC서버 로긴을 요청함
    ConnectServer(nodejs_connector_url, company_id, userid, exten, passwd, server_ip, "M", "0");
    return;
  }

  /**
   * EICN
   * EICN 서버와 연동하는 부분
   * @param {*} nodejs_connector_url EICN측 서버 URL
   * @param {*} company_id 세종시 ID
   * @param {*} userid 상담원 ID
   * @param {*} exten 내선번호
   * @param {*} passwd 상담원 ID 비밀번호
   * @param {*} server_ip EICN 서버 IP
   * @param {*} usertype 서버 전송이외에 사용처는 분석안됨
   * @param {*} option 로그인 후, 상담원의 상태(0 - 대기중, 1 - 상담중, 2 - 후처리중, 3 - 휴식, 4 - 식사, 5 - 자리비움 등)
   * 
   * EICN 서버의 서버 상태, 서버 연결 상태, 서버로 부터 받은 이벤트(콜이벤트) 등을 처리
   * 서버에서 받은 데이터는
   * LOGIN|KIND:LOGIN_OK|DATA1:7019|DATA2:test|DATA3:0|DATA4:OK|DATA5:75497019|DATA6:N|DATA7:|DATA8:M 형식
   */
  const ConnectServer = (nodejs_connector_url, company_id, userid, exten, passwd, server_ip, usertype, option) => {
    var ressult;

    // 소켓이 전역변수가 아닐 경우 찾지 못하여 socket변수를 전역으로 설정해줌
    // const socket = null;
    // var socket;
    // displayText("S", "로긴정보보내기("+company_id+","+userid+","+passwd+")");
    try {
      if (nodejs_connector_url.indexOf('https') > -1) {
        socket = io.connect(nodejs_connector_url, {
          'secure': true,
          'reconnect': true,
          'resource': 'socket.io'
        });
      } else {
        socket = io.connect(nodejs_connector_url, {
          'reconnect': true,
          'resource': 'socket.io'
        });
      }
      // 소켓 서버의 "climsg_login"로 데이터를 전송
      socket.emit('climsg_login', {
        company_id: company_id,
        userid: userid,
        exten: exten,
        passwd: passwd,
        pbxhost: server_ip,
        usertype: usertype,
        option: option
      });
      socket.on('connect', function () {
        parseMessage("NODEJS|KIND:CONNECT_OK");
      });
      socket.on('svcmsg', function (data) {
        // LOGIN|KIND:LOGIN_OK|DATA1:7019|DATA2:test|DATA3:0|DATA4:OK|DATA5:75497019|DATA6:N|DATA7:|DATA8:M
        // MEMBERSTATUS|KIND:0
        console.log(data);
        parseMessage(data);
      });
      socket.on('svcmsg_ping', function () {
        socket.emit('climsg_pong');
      });
      socket.on('disconnect', function () {
        parseMessage("NODESVC_STATUS|KIND:DISCONNECT");
      });
      socket.on('error', function () {
        parseMessage("NODESVC_STATUS|KIND:ERROR");
      });
      socket.on('end', function () {
        parseMessage("NODESVC_STATUS|KIND:END");
      });
      socket.on('close', function () {
        parseMessage("NODESVC_STATUS|KIND:CLOSE");
      });
    } catch (error) {
      // alert("서버가 정상인지 확인후 사용해주세요");
    }
    return ressult;
  }

  /**
   * EICN
   * 데이터를 서버로 전송하기 전에 서버로 보낼 명령어 형태("CMD|" + strCommand)를 맞춰주기 위해 사용하는 것으로 분석
   * @param {*} strCommand 소켓서버로 전송할 데이터 정보
   * 
   */
  const SendCommand = strCommand => {
    if (phoneNum == null || phoneNum == "") {
      // alert(param.phoneLineNum);

      // console.log("로긴후 사용해주세요 " + param.phoneLineNum);
      return false;
    }

    var cmd = "CMD|" + strCommand;
    //소켓프레임으로 명령어 전달
    SendCommand2Socket(cmd);
    return false;
  }

  /**
   * EICN
   * 받아온 명령어를 소켓 서버의 "climsg_command"로 strCommand를 전송
   * @param {*} strCommand 
   */
  const SendCommand2Socket = strCommand => {
    // EICN
    if (socket != null) {
      // displayText("S", strCommand);
      socket.emit('climsg_command', strCommand);
    } else {
      parseMessage("NODESVC_STATUS|KIND:RELOADED");
    }
    return false;
  }

  /**
   * EICN
   * 서버로 부터 받아온 결과값(콜이벤트, 전화끊기(승객이 끊음) 등) 또는, 특정 이벤트가 발생했을 때(전화끊기(상담원이 끊음), 당겨받기 등의 클라이언트에서 먼저 상태값을 보내야하는경우나, 서버상태 변경)의 데이터 처리해 주기 위한 함수
   * 
   * @param {*} msg 서버로 부터 받아온 결과값 또는, 최종적으로 처리해줄 데이터 정보
   * 
   * 받아온 결과 값을 파싱하여, 데이터가 갖고 있는 상태값을 어떻게 처리해 줄지 정한다.
   * 
   * TODO : 현재 콜이벤트가 발생했을 경우 사용하지 않는 기능들(PSD, 돌려주기 등)에 대해선 주석으로 막아둔 상태이거나 EICN측에서 처리함수를 주지 않은상태로, 추후 기능이 추가되면 EICN측 코드를 분석하여 추가하거나 요청해야함
   * 
   */
  const parseMessage = msg => {
    var msgs = msg.split("|");
    if (msgs == null || msgs.length < 2) {
      return;
    }
    var Insp = new Object();
    var event = msgs[0];
    for (var i = 1; i < msgs.length; i++) {
      var keyval = msgs[i].split(":");
      var tmp_val = "";
      for (var j = 1; j < keyval.length; j++) {
        if (keyval[j] != null) {
          if (j > 1) {
            tmp_val = tmp_val + ":" + keyval[j];
          } else {
            tmp_val = tmp_val + keyval[j];
          }
        }
      }
      Insp[keyval[0]] = tmp_val;
    }
    var kind = Insp["KIND"];
    var peer = Insp["PEER"];
    var data0 = Insp["DATA0"];
    var data1 = Insp["DATA1"];
    var data2 = Insp["DATA2"];
    var data3 = Insp["DATA3"];
    var data4 = Insp["DATA4"];
    var data5 = Insp["DATA5"];
    var data6 = Insp["DATA6"];
    var data7 = Insp["DATA7"];
    var data8 = Insp["DATA8"];
    var data9 = Insp["DATA9"];
    var data10 = Insp["DATA10"];
    var data11 = Insp["DATA11"];
    var data12 = Insp["DATA12"];

    // console.log(Insp);

    if (event == "LOGIN") {
      parseLogin(kind, data1, data2, data3, data4, data5, data6, data7, data8);
      return;

    } else if (event == "PEER") { // 전화기 상태, 사용 안함
      return;

    } else if (event == "MEMBERSTATUS") {
      if (cMemberStatus != "1") { // 1번은 상담중
        bMemberStatus = cMemberStatus;
      }
      cMemberStatus = kind;
      parseMemberStatus(kind);

    } else if (event == "CALLEVENT") {

      //내선일때 팝업을 막고 싶다면
      if (data1.length == 3 && data2.length == 3) {
        return;
      }
      parseCallEvent(kind, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12);
      return;

    } else if (event == "HANGUPEVENT") {
      //내선끊은후 이전 상태콘트롤
      if (data8 == "" && data1.length == 3 && data2.length == 3)
      {
        // data8 = B_MEMBER_STATUS;
        data8 = bMemberStatus;
      } else if (data8 == "") {
        data8 = "NORMAL";
      }
      SendCommand2Socket("CMD|HANGUP_ACK|" + data5 + "," + data8);
      parseHangupEvent(kind, data1, data2, data3, data4, data7, data8, data9, data10, data11);
      return;

    } else if (event == "SAME_USERID") {
      parseSameUserId(kind, data1, data2);
    } else if (event == "NODESVC_STATUS") {
      parseNodeSvc(kind);
    } else if (event == "BYE") {
      if (kind == "SAME_UID") {
        alert("다른 컴퓨터에서 같은 아이디로 로긴되어서 서버와 끊김");
      } else if (kind == "SAME_PID") {
        alert("다른 컴퓨터에서 같은 내선으로로 로긴되어서 서버와 끊김");
      }
      parseBye(kind, data1, data3);
    } else if (event == "HOLD_START") {
      // 보류 시작
      if (kind == "OK") {
        setHoldState(true);
      }
    } else if (event == "HOLD_STOP") {
      // 보류 끝
      if (kind == "OK") {
        setHoldState(false);
      }
    } else {
      //alert("ELSE:"+msg);
    }
    return;
  }

  /**
   * EICN
   * 서버 로그인 시, 서버로 부터 받아온 데이터의 이벤트가 "LOGIN"인 경우 실행
   * LOGIN|KIND:LOGIN_OK|DATA1:300|DATA2:상담원1|DATA3:0|DATA4:OK|DATA5:11110002
   * kind: 로그인 성공 여부 ["LOGIN_OK","LOGIN_FAIL"]
   * data1: "7019" 내선번호
   * data2: "test"
   * data3: "0" 상담원 상태
   * data4: "OK" 전화기 상태
   * data5: "75497019" 
   * data6: "N"
   * data7: ""
   * data8: "M"
   * 
   * EICN 코드 참조
   */
  const parseLogin = (kind, data1, data2, data3, data4, data5, data6, data7, data8) => {
    // LOGIN|KIND:LOGIN_OK|DATA1:300|DATA2:상담원1|DATA3:0|DATA4:OK|DATA5:11110002
    if (kind == "LOGIN_OK") {
      phoneNum = data1;
      userName = data2;
      memberStatus = data3;
      phoneStatus = data4;
      phonePeer = data5;
      forwardWhen = data6;
      forwardNum = data7;
      recordType = data8;

      SendCommand("LOGIN_ACK");
    } else if (kind == "LOGOUT") {
      // alert("로그아웃");
    } else {
      // alert("로긴 실패");
    }
    return;
  }

  // EICN 측 코드로, 서버 장애 발생 시 실행
  const parseNodeSvc = kind => {
    // alert("Nodejs 서버 장애["+kind+"]");
    logoutfromserver();
  }

  // EICN 측 코드, 로그아웃 시 사용
  const parseLogout = kind => {
    logoutfromserver();
  }

  // EICN 측 코드, 다른 컴퓨터에서 같은 아이디 또는 내선 번호로 로그인시 실행
  const parseBye = (kind, uid, name) => {
    logoutfromserver();
  }

  // EICN 콜 이벤트 발생시, 콜이벤트 상태(kind)를 처리
  const parseCallEvent = (kind, data1, data2, data3, data4, data5, data6) => {
    if (kind == "IR") { // 전화 왔을때,
      // alert("**"+phoneNum+" 인바운드 전화가 ["+data1+"]에서 왔음");
      setCallEvent(true);
      setCallEventStatus('IR');
      handleCallNumber(data1);
    } else if (kind == "ID") {
      // alert("**"+phoneNum+" 인바운드 전화 ["+data1+"]와 통화중");
      setCallEventStatus('ID');
      param.consultantState(1); // 상담원 상태를 저장 (redux)
    } else if (kind == "OR") {
      // alert("**"+phoneNum+" 아웃바운드 전화 ["+data1+"]와 시도중");
      setCallEventStatus('OR');
      setCallEventOpen(true);
    } else if (kind == "OD") {
      // alert("**"+phoneNum+" 아웃바운드 전화 ["+data1+"]와 통화중");
      setCallEventStatus('OD');
    } else if (kind == "PICKUP") {
      // alert("**"+phoneNum+" 당겨받기 전화 ["+data1+"]와 통화중");
      setCallEventStatus('PICKUP');
      setCallEvent(true);
      handleCallNumber(data1);
    }

    return;
  }

  /**
   * EICN
   * 전화 끊기 함수
   * 해당 함수가 실행되면 전화이벤트 관련 변수를 초기화되어야 할 것으로 생각되어
   * 전화이벤트 관련 변수 초기화
   */
  const parseHangupEvent = (kind, data1, data2, data3, data4) => {
    setCallEvent(false);
    setCallEventOpen(false);
    setCallEventStatus('');
    command_memberstatus(0);
    param.consultantState(0);
    setCallNumber('');
    param.memberDataSave(false); // 멤버 정보 (redux) 초기화
    param.call2CallEvent(false, false); // 전화하기 값 초기화
    setMemberDatas({
      ...memberDatas,
      dataBool: false,
      riderPhone: '',
      riderName: '',
      riderNo: '',
      riderCurStart: '',
      riderCurArrival: '',
    })
  }

  /**
   * EICN
   * 전화 당겨받기 함수
   * 전화 당겨받기 실행 시, 콜이벤트 팝업 활성화 시켜준다
   */
  const click2call = number => {
    setCallEventOpen(true);
    var number = number;
    var cid_num = '';

    if (number.length == 0 || number == false) {
      alert("전화번호를 입력하세요");
      return;
    }
    SendCommand("CLICKDIAL|" + cid_num + "," + number + ",oubbound");
    return false;
  }

  /**
   * 전화 끊기 클릭 시, 서버로 HANGUP 이벤트 전송
   */
  const handleHangUpEvent = () => {
    // 전화 끊기
    SendCommand("HANGUP|" + phonePeer);
    handleCloseModal();
    setCallEventOpen(false);
    //HANGUPEVENT|KIND:I|COMP:SJDRT|PEER:75497019|DATA1:01031646344|DATA2:7019|DATA3:07075497019|DATA4:|DATA5:1|DATA6:N|DATA7:1582696625.111|DATA8:|DATA9:|DATA10:0|DATA11:|DATA12:/DATA/SJDRT/202002/0226/|DATA13:01031646344_7019_20200226145705.MP3|DATA14:2020-02-26145712
  }

  /**
   * 전화 받기 클릭 시, 서버로 RECEIVE 이벤트 전송
   */
  const handleReceiveEvent = () => {
    SendCommand("RECEIVE|" + phonePeer);
    //HANGUPEVENT|KIND:I|COMP:SJDRT|PEER:75497019|DATA1:01031646344|DATA2:7019|DATA3:07075497019|DATA4:|DATA5:1|DATA6:N|DATA7:1582696625.111|DATA8:|DATA9:|DATA10:0|DATA11:|DATA12:/DATA/SJDRT/202002/0226/|DATA13:01031646344_7019_20200226145705.MP3|DATA14:2020-02-26145712
  }

  /**
   * 전화 당겨받기 클릭 시, 서버로 PICKUP 이벤트 전송
   */
  const handlePickUp = () => {
    SendCommand("PICKUP|" + phonePeer);
    handleCloseModal(); // 당겨받으시겠습니까? 팝업 닫기
  }

  /**
   * 전화 보류 시, 서버로 HOLD_START(보류 시작), HOLD_STOP(보류 끝) 이벤트 전송
   */
  const handleHoldOff = data => {
    if (data) {
      SendCommand("HOLD_START|" + phonePeer);
    } else {
      SendCommand("HOLD_STOP|" + phonePeer);
    }
  }

  useEffect(() => {
    // 콜이벤트로 받아온 번호를 통해 얻어온 정보를 setMemberDatas(redux)에 저장하여 콜이벤트가 발생 했을 때, 배차하기에서 사용하기 위해
    if (param.searchPhone.memberInfo && param.searchPhone.memberInfo.data.length > 0) {
      // 최근 승하차지 구하기 위해 라이더 번호로 서칭
      param.memberNumSearch(param.searchPhone.memberInfo.data[0].rider_no);
      setMemberDatas({
        ...memberDatas,
        dataBool: true,
        riderPhone: param.searchPhone.memberPhone,
        riderName: param.searchPhone.memberInfo.data[0].rider_nm,
        riderNo: param.searchPhone.memberInfo.data[0].rider_no,
      });
    } else {
      setMemberDatas({
        ...memberDatas,
        dataBool: true,
        riderPhone: callNumber,
        riderName: '',
        riderNo: '',
      });

    }
  }, [param.searchPhone.memberInfo])

  useEffect(() => {
    // 승객 번호로 서칭하여 얻어온 최근 승/하차지 데이터를 가져와 정류소 중복여부를 판별하여 setMemberDatas state객체의 riderCurStart, riderCurArrival에 넣어준다.
    if (param.searchPhone.curStation) {
      let current_dep_station_temp = param.searchPhone.curStation.data.recent_dep_stations;
      let current_dest_station_temp = param.searchPhone.curStation.data.recent_dest_stations;
      let current_dep_station = [];
      let current_dest_station = [];

      if (current_dep_station_temp.length > 0) {
        for (let i = 0; i < current_dep_station_temp.length; i++) {
          let flag = true;
          if (current_dep_station.length < 1) {
            current_dep_station.push(current_dep_station_temp[i]);
          } else {
            for (let j = 0; j < current_dep_station.length; j++) {
              flag = true;
              if (current_dep_station_temp[i].station_no == current_dep_station[j].station_no) {
                flag = false;
              }
            }
            if (flag) {
              current_dep_station.push(current_dep_station_temp[i]);
            }
          }
        }
      } else {
        current_dep_station = [];
      }


      if (current_dest_station_temp.length > 0) {
        for (let i = 0; i < current_dest_station_temp.length; i++) {
          let flag = true;
          if (current_dest_station.length < 1) {
            current_dest_station.push(current_dest_station_temp[i]);
          } else {
            for (let j = 0; j < current_dest_station.length; j++) {
              flag = true;
              if (current_dest_station_temp[i].station_no == current_dest_station[j].station_no) {
                flag = false;
              }
            }
            if (flag) {
              current_dest_station.push(current_dest_station_temp[i]);
            }
          }
        }
      } else {
        current_dest_station = [];
      }

      setMemberDatas({
        ...memberDatas,
        riderCurStart: current_dep_station,
        riderCurArrival: current_dest_station
      });
    }
  }, [param.searchPhone.curStation])

  useEffect(() => {
    // 운행 리스트, 예약 리스트에서, 승무사원 전화번호, 승객 전화번호 클릭시, 전화번호를 redux에 저장하기 때문에
    // redux에서 call2callNum 변수를 받아서 전화걸기 함수로 넘겨준다
    if (param.searchPhone.call2callNum) {
      click2call(param.searchPhone.call2callNum);
    }
  }, [param.searchPhone.call2callNum])

  useEffect(() => {
    // setMemberDatas에 정보가 있는경우, 리덕스에 승객 정보 저장(배차하기에서 사용하기위해)
    if (memberDatas.dataBool) {
      param.memberDataSave(memberDatas);
    }
  }, [memberDatas])

  useEffect(() => {
    // 상담원의 상태가 변경 될 때마다 redux로 저장하여, Nav에서 상담원 상태에서 사용한다
    if (param.loadConsultantState) {
      command_memberstatus(param.loadConsultantState); // 상담원 상태 변경
    }
  }, [param.loadConsultantState]);

  /**
   * EICN
   * 상담원 상태 변경 함수로, 서버로 MEMBERSTATUS 명령어와 상담원 상태값, 전화번호를 보낸다
   * @param {*} s 상담원 상태
   */
  const command_memberstatus = s => {
    memberStatus = s;
    SendCommand("MEMBERSTATUS|" + s + "," + phoneNum + "," + memberStatus);
  }

  useEffect(() => {
    // 전화 이벤트가 발생했을 때, 전화팝업을 띄워주고, 단축키를 등록하여야 한다.
    if (callEvent) {
      setCallEventOpen(true);
    }
    
    // 전화 팝업이 활성화 된경우, keydown 이벤트를 등록하여 전화 받기, 끊기, 당겨받기에 대한 단축키를 등록해 준다
    if (callEventOpen) {
      $(document).bind('keydown', function (e) {
        /**************  number  keycode  **************/
        /*   alt -> 18   ||   2 -> 50   ||   7 -> 55   */
        /*  ctrl -> 17   ||   3 -> 51   ||   8 -> 56   */
        /* shift -> 16   ||   4 -> 52   ||   9 -> 57   */
        /*     0 -> 48   ||   5 -> 53   ||             */
        /*     1 -> 49   ||   6 -> 54   ||             */
        /***********************************************/
        // 단축키 번호 등록
        if (e.altKey == true && e.keyCode == 49) {
          handleReceiveEvent(); // 전화 받기
          return false
        }
        if (e.altKey == true && e.keyCode == 50) {
          if (!holdState) {
            handleOpenModal(3); // 끊기
            return false
          } else {
            alert("보류중에는 끊을 수 없습니다.");
          }
        }
        if (e.altKey == true && e.keyCode == 51) {
          if (!holdState || callEvent) {
            handleOpenModal(6); // 당겨받기
            return false
          } else {
            alert("통화중 또는 보류중에는 당겨받기 기능은 사용 할 수 없습니다.");
          }
        }
      })
    } else {
      $(document).unbind('keydown');
    }
  }, [callEventOpen, callEvent]);


  return (
    <div>
      <AppBar position="static" className={classes.callStatus}>
        <div style={{ minWidth: 275, display: "flex" }}>
          <div>
            <img src="/static/buttonicon/voc.png" alt="voc" style={{ cursor: 'pointer' }} onClick={handleVocOpen} />
          </div>
          <div>
            {param.loadConsultantState == 0 ? // 대기
              <img src="/static/buttonicon/stay.png" alt="대기중" />
              : param.loadConsultantState == 1 ? // 상담중/통화중
                <img src="/static/buttonicon/call.png" alt="통화중" />
                : param.loadConsultantState == 2 || param.loadConsultantState == 6 ? // 후처리
                  <img src="/static/buttonicon/postprocess.png" alt="후처리" />
                  : param.loadConsultantState == 3 ? // 휴식
                    <img src="/static/buttonicon/rest.png" alt="휴식" />
                    : param.loadConsultantState == 4 ? // 식사
                      <img src="/static/buttonicon/food.png" alt="식사" />
                      : param.loadConsultantState == 5 ? // 자리비움
                        <img src="/static/buttonicon/absent.png" alt="자리비움" />
                        : param.loadConsultantState == 7 ? // 아웃바운드
                          <span>아웃바운드</span>
                          : param.loadConsultantState == 8 ? // PDS
                            <span>PDS</span>
                            : <div></div>
            }
          </div>
          <div className={classes.buttonIconWrapper}>
            <img src="/static/buttonicon/telephone1.png" alt="받기" onClick={() => handleReceiveEvent()} className={classes.buttonIconLogo} />
          </div>
          <div className={classes.buttonIconWrapper} onClick={() => handleOpenModal(3)}>
            <img src="/static/buttonicon/telephone2.png" alt="끊기" className={classes.buttonIconLogo} />
          </div>
          <div className={classes.buttonIconWrapper} onClick={() => handleOpenModal(6)}>
            <img src="/static/buttonicon/telephone4.png" alt="당김" className={classes.buttonIconLogo} />
          </div>
          {!holdState ?
            <div className={classes.buttonIconWrapper}>
              <img src="/static/buttonicon/telephone5.png" alt="보류" className={classes.buttonIconLogo} />
            </div>
            :
            <div className={classes.buttonIconWrapper}>
              <img src="/static/buttonicon/telephone5-1.png" alt="보류" className={classes.buttonIconLogo} />
            </div>
          }
        </div>
      </AppBar>

      <Modal
        disableEnforceFocus   // 오토포커스 테두리 삭제
        disableAutoFocus
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={openModal}>
          <div className={classes.modalKindWrapper}>
            {modalKind === 3 ?
              <div className={classes.modalBox}>
                <div className={classes.modalTitle}>전화 끊기
            <img src="/static/modal_x.png"
                    alt="logo"
                    className={classes.modalClose}
                    onClick={handleCloseModal}
                  />
                </div>
                <div className={classes.modalContentWrapper}>
                  · <span className={classes.modalContentText}>전화를 끊으시겠습니까?</span>
                  <div className={classes.modalContentImgWrapper}>
                    <img
                      src="/static/popup_cancel.png"
                      alt="logo"
                      onClick={handleCloseModal}
                      className={classes.modalContentImg}
                    />
                    <img
                      src="/static/popup5.png"
                      alt="logo"
                      onClick={handleHangUpEvent}
                      className={classes.modalContentImg}
                    />
                  </div>
                </div>
              </div>
              : modalKind === 6 ?
                <div style={{ backgroundColor: "#fff" }}>
                  <div className={classes.modalTitle}><span style={{ color: "#f25f5d" }}>전화 당겨받기</span>
                    <img src="/static/modal_x.png"
                      alt="logo"
                      className={classes.modalClose}
                      onClick={handleCloseModal} />
                  </div>
                  <div className={classes.modalContentWrapper} style={{ fontSize: 14 }}>
                    <div>전화를 당겨 받으시겠습니까?</div>
                    <div className={classes.modalContentImgWrapper}>
                      <img src="/static/popup_cancel.png"
                        alt="cancel"
                        onClick={handleCloseModal}
                        className={classes.modalContentImg}
                      />
                      <img src="/static/popup3.png"
                        alt="confirm"
                        onClick={handlePickUp}
                        className={classes.modalContentImg}
                      />
                    </div>
                  </div>
                </div>
                : <div></div>
            }
          </div>
        </Fade>
      </Modal>

      <Slide in={callEventOpen} mountOnEnter unmountOnExit direction="down" className={classes.slideSnack}>
        <Grid container>
          <div className={classes.callInfo}>
            <div className={classes.callingBell}>
              <div className={classes.callAlert}>
                <img className="shake shake-constant" src="/static/bell.png" alt="CallAlert" />
              </div>
              {callEventStatus == 'IR' ?
                <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }} className="shake shake-constant">전화가 왔습니다.</span>
                : callEventStatus == 'ID' ?
                  <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }}>통화중</span>
                  : callEventStatus == 'OR' ?
                    <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }}>전화 시도중...</span>
                    : callEventStatus == 'OD' ?
                      <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }}>통화중</span>
                      : callEventStatus == 'PICKUP' ?
                        <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }}>통화중</span>
                        : <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }} ></span>
              }
            </div>
            {param.searchPhone.memberInfo && param.searchPhone.memberInfo.data.length > 0 ?
              <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25, paddingTop: 13 }}>
                {param.searchPhone.memberInfo.data[0].rider_nm}
              </div>
              : param.searchPhone.call2callName ?
                <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25, paddingTop: 13 }}>
                  {param.searchPhone.call2callName}
                </div>
                :
                <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25, paddingTop: 13 }}>
                </div>
            }
            <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }} className={classes.callClient}> &nbsp;&nbsp;
        {param.searchPhone.call2callNum ?
                param.searchPhone.call2callNum
                :
                callNumber
              }
            </div>
          </div>
          <div className={classes.callControllerToggle}>
            <div>
              <img src="/static/buttonicon/voc.png" alt="voc" style={{ cursor: 'pointer' }} onClick={handleVocOpen} />
            </div>
            <div>
              {param.loadConsultantState == 0 ? // 대기
                <img src="/static/buttonicon/stay.png" alt="대기중" />
                : param.loadConsultantState == 1 ? // 상담중/통화중
                  <img src="/static/buttonicon/call.png" alt="통화중" />
                  : param.loadConsultantState == 2 || param.loadConsultantState == 6 ? // 후처리
                    <img src="/static/buttonicon/postprocess.png" alt="후처리" />
                    : param.loadConsultantState == 3 ? // 휴식
                      <img src="/static/buttonicon/rest.png" alt="휴식" />
                      : param.loadConsultantState == 4 ? // 식사
                        <img src="/static/buttonicon/food.png" alt="식사" />
                        : param.loadConsultantState == 5 ? // 자리비움
                          <img src="/static/buttonicon/absent.png" alt="자리비움" />
                          : param.loadConsultantState == 7 ? // 아웃바운드
                            <span>아웃바운드</span>
                            : param.loadConsultantState == 8 ? // PDS
                              <span>PDS</span>
                              : <div></div>
              }
            </div>
            <div className={classes.buttonIconWrapper}>
              <img src="/static/buttonicon/telephone1.png" alt="받기" onClick={() => handleReceiveEvent()} className={classes.buttonIconLogo} />
            </div>
            {holdState ?
              <div className={classes.buttonIconWrapper}>
                <img src="/static/buttonicon/telephone2.png" alt="끊기" className={classes.buttonIconLogo} />
              </div>
              :
              <div className={classes.buttonIconWrapper} onClick={() => handleOpenModal(3)}>
                <img src="/static/buttonicon/telephone2.png" alt="끊기" className={classes.buttonIconLogo} />
              </div>
            }
            <div className={classes.buttonIconWrapper}>
              <img src="/static/buttonicon/telephone4.png" alt="당김" className={classes.buttonIconLogo} />
            </div>
            {!holdState ?
              <div className={classes.buttonIconWrapper} onClick={() => handleHoldOff(true)}>
                <img src="/static/buttonicon/telephone5.png" alt="보류" className={classes.buttonIconLogo} />
              </div>
              :
              <div className={classes.buttonIconWrapper} onClick={() => handleHoldOff(false)}>
                <img src="/static/buttonicon/telephone5-1.png" alt="보류" className={classes.buttonIconLogo} />
              </div>
            }
          </div>
        </Grid>
      </Slide>

      <Voc vocOpen={vocOpen} setVocOpen={setVocOpen} operNum={param.operNum} />
    </div>
  );
};

CallEventHandler.getInitialProps = async props => {
  const { store, isServer } = props;
  store.dispatch(loadMemberData());
  store.dispatch(loadMemberSearchPhoneData());
  store.dispatch(loadMemberSearchCurStationData());
  store.dispatch(saveCalledRiderInfoData());
  store.dispatch(loadCall2CallEventData());
  store.dispatch(saveConsultantState());
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
  }
  return { isServer };
};
const mapStateToProps = state => {
  return {
    searchPhone: state.member,
    loadConsultantState: state.consultant.cs_state,
    test: state,
  };
};

const mapDispatchToProps = dispatch => ({
  memberLoad: () => dispatch(loadMemberData()),
  memberPhoneSearch: (memberPhone) => dispatch(loadMemberSearchPhoneData(memberPhone)),
  memberNumSearch: (memberNum) => dispatch(loadMemberSearchCurStationData(memberNum)),
  memberDataSave: (riderInfoSave) => dispatch(saveCalledRiderInfoData(riderInfoSave)),
  call2CallEvent: (call2callNum, call2callName) => dispatch(loadCall2CallEventData(call2callNum, call2callName)), // 전화하기에서 사용하는 대상 전화번호, 대상 이름을 redux에 저장하여, BusServiceList, ReservationList와 데이터 수신/및 전달을 하여 데이터 변경하기 위함
  consultantState: (cs_state) => dispatch(saveConsultantState(cs_state)), // 상담원 상태 변경(redux)저장하여, Nav에서 상담원 상태관리를 하기 위함,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallEventHandler);