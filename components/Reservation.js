import React, { useEffect, useState, useRef, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";
import { loadBusData } from "../lib/buslist/actions";
import { loadMapData } from "../lib/navermap/actions";
import { loadDriverData } from "../lib/driver/actions";
import { loadMemberSearchPhoneData } from "../lib/member/actions";
import { loadRsvNumberData } from "../lib/rsvlist/actions";
import { loadRouteStationData } from "../lib/routestation/actions";
import { saveConsultantState } from "../lib/consultant/actions";
import request from "../lib/request";
import ReservationMap from "./ReservationMap";
import ReservationContent from "./ReservationContent";
import { 
  selectDepStationData,
  selectDestStationData } from "../lib/navermap/actions";

const useStyles = makeStyles(theme => ({
  root:{
    width: "100%",
    height: 850,
    padding: "97px 20px 118px 20px",
    position: "relative",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #717171",
    '&:focus': {
      outline: 'none',
    }
  },
  modal: {
    zIndex:1200+' !important',
  },
  closeBtnWrap : {
    position: "absolute",
    top: 73,
    right: 13,
    width: 21,
    height: 21,
    cursor: "pointer",
    '&:hover': {
      cursor: "pointer",
    },
  },
  closeBtn: {
    width: 21,
    height: 21,
  },
  bookingSuccessWrap: {
    width: "100%",
    height: 90,
    paddingTop: 40,
    textAlign: "center",
  },
  bookingSuccess: {
    width: "100%",
    paddingLeft:20,
    paddingRight:20,
  },
  bookingBtn: {
    backgroundColor: "#223152",
    color: "#ffffff",
    height: 48,
    fontFamily: 'NotoSansCJKkr',
    fontSize: 16,
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#fefefe',
    paddingTop: 16,
    paddingBottm: 16,
    "&:hover": {
      cursor: "pointer",
    },
  },
  bookingBtnFail: {
    backgroundColor: "#b8babf",
    color: "#ffffff",
    height: 48,
    fontFamily: 'NotoSansCJKkr',
    fontSize: 16,
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#fefefe',
    paddingTop: 16,
    paddingBottm: 16,
    
  },

  //ConfirmModal
  confirmModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmModalBoxReserve: {
    width: 320,
    height: 261,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  confirmModalTitle: {
    height: 45,
    backgroundColor: '#223152',
    color: '#ffffff',
    fontSize: 18,
    paddingLeft: 21,
    paddingTop: 12,
  },
  confirmModalClose: {
    float: 'right',
    marginRight: 15,
    padding: 5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  confirmModalContentWrapper: {
    margin: 20,
  },
  confirmModalContentImgWrapper: {
    marginLeft: 25,
    marginTop: 10,
  },
  confirmModalContentImg: {
    margin: 5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const Reservation = ({
  setRsvOpenModal, // APP예약 인지 신규인지 여부(ReservationList, BusServiceList에서 받아옴)
  modal,
  mapLoad,
  carLoad,
  dispatchPerson, // 예약 번호
  setDispatchPerson, // APP예약 승객 여부
  dispatchPersonLoad, // APP 예약 정보(서버 API)
  routeStationLoad,  // 노선정류소 정보 로드 (서버 API)
  rsvPersonData, // app 예약 고객 데이터(서버 API)
  memberInfo, // 승객정보(서버 API)
  consultantState, // 상담원 상태값(redux)
  selectDepStationInfos, // 승차정류소 정보(redux)
  selectDestStationInfos, // 하차정류소 정보(redux)
}) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [modalKind, setModalKind] = useState('');
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [totalTime, setTotalTime] = useState(''); // 노선 총 시간
  const [totalDistance, setTotalDistance] = useState(''); // 노선 총 거리
  const [personTotalTime, setPersonTotalTime] = useState(''); // 실제 탑승객 소요 시간
  const [personTotalDistance, setPersonTotalDistance] = useState(''); // 실제 탑승객 이동 거리
  const [isRsvPerson, setIsRsvPerson] = useState(false); // 예약 고객 유/무
  const [selectFindStation, setSelectFindStation] = useState(''); // 검색 -> DRT 정류소 클릭
  const [selectFindAddress, setSelectFindAddress] = useState(''); // 검색 -> 주소 정보 클릭
  const [openValue, setOpenValue] = useState(true); // 예약 가능 시간대 알림창 여부 (배차하기 창을 닫을때, 초기화 해주어야 해서 Reservation에 선언)
  const [checkValid, setCheckValid] = useState(false); // 입력된 데이터 들의 예약 가능 여부 (Reservation에서 배차하기 버튼활성 화 관련)
  const [checkValidInside, setCheckValidInside] = useState(false); // 위의 checkValid를 갖고 배차하기 버튼 활성화 여부 판별
  const [finalRoutesInfoList, setFinalRoutesInfoList] = useState([]); // 승/하차 입력 시, 받게될 노선 정보 배열
  const [radioRouteNumber, setRadioRouteNumber] = useState('');
  const [currentStarts, setCurrentStarts] = useState(''); // 최근승차에서 선택 데이터
  const [currentStartsCheck, setCurrentStartsCheck] = useState(false); // 최근승차지 선택 여부
  const [currentArrivals, setCurrentArrivals] = useState(''); // 최근하차에서 선택 데이터
  const [currentArrivalsCheck, setCurrentArrivalsCheck] = useState(false); // 최근하차지 선택 여부
  const [rsvPersonDatas, setRsvPersonDatas] = useState(''); //앱예약 고객 데이터
  const [getReservationDatas, setGetReservationDatas] = useState({ // 최종적으로 서버로 전송할 데이터를 담을 state 객체
    phone: '',
    name: '',
    rsv_baggage_cnt: '0',
    rsv_dep_station_no: '',
    rsv_dep_time: '',
    rsv_dest_station_no: '',
    rsv_dest_time: '',
    rsv_est_distance: '',
    rsv_est_time: '',
    rsv_gb: 'PHONE',
    rsv_operator_no: '',
    rsv_person_cnt: '',
    rsv_rider_no: '',
    rsv_stat: 'RSV_REQUEST',
    drv_baggage_cnt: '0',
    drv_car_no: '',
    drv_driver_no: '',
    drv_person_cnt: '0',
    drv_route_no: '',
    drv_stat: 'DRV_READY',
    rsv_no: '',
    drv_no: '',
    car_name: '',
  });

  useEffect(() => {
    mapLoad();
    carLoad();
    routeStationLoad();
  }, []);
  
  // 배차하기 닫기 시 값 초기화
  const handleCloseModal = () => {
    // 전화 이벤트 없는 경우 상담원 상태 변경
    if(memberInfo.riderInfoSave.riderPhone == null || memberInfo.riderInfoSave.riderPhone == "") {
      // 상담원 상태를 0(대기중)으로 변경
      consultantState(0);
    }
    setOpenModal(false);
    setRsvOpenModal(false);
    setOpenValue(false);
    setIsRsvPerson(false);
    setDispatchPerson('');
    setRadioRouteNumber('');
    setCurrentStarts('');
    setCurrentArrivals('');
    setRsvPersonDatas('');
    setPersonTotalTime('');
    setTotalTime('');
  };

  /**
   * 버튼 클릭 시, 번호를 받아와 어떤 모달창을 활성화 할지 여부 체크하기 위해
   * @param {*} num 모달창 번호(5 : 배차하기 전송 전 확인창, 6 : 배차 완료 팝업창)
   * 
   * 배차 완료 창이 뜨는 경우에는, 프로그레스바 제거
   */
  const handleOpenConfirmModal = num => {
    setOpenConfirmModal(true);
    if(num == 6) {
      setTimeout(() => {
        setLoadingSave(false);
        setModalKind(num);
      }, 1000);
    } else {
      setModalKind(num);
    }
  };

  /**
   * 배차 확인 창 닫았을 때 실행,
   * 
   * 해당 함수가 실행되면, 1초뒤에 프로그레스바 비활성화 시킨다.
   */
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  useEffect(() => {
    setOpenModal(modal);
    // ReservationList, BusServiceList에서 배차하기 버튼 클릭 시
    if(modal) {
      if(memberInfo.riderInfoSave.riderPhone == null || memberInfo.riderInfoSave.riderPhone == "") {
        // 전화 이벤트가 없이 배차하기 버튼을 클릭한 경우 상담원 상태를 2번(후처리)로 변경해 주기위해
        consultantState(2);
      }
    }
    setRadioRouteNumber('');
    setPersonTotalTime('');
    setTotalTime('');
    selectDepStationInfos(false);
    selectDestStationInfos(false);
  }, [modal]);

  useEffect(() => {
    // APP 예약 번호(dispatchPerson)가 있는지 판별하여, 예약테이터인지 유/무(setIsRsvPerson)값을 저장하고, dispatchPerson로 예약정보 가져오기 API에 전송한다(dispatchPersonLoad)
    if(dispatchPerson != '') {
      setIsRsvPerson(true);
      dispatchPersonLoad(dispatchPerson);
    } else {
      setIsRsvPerson(false);
      setDispatchPerson('');
    }
  }, [dispatchPerson]);

  useEffect(() => {
    // app 예약 고객 데이터(서버 API)의 데이터를 저장하기 위해
    setRsvPersonDatas(rsvPersonData);
  }, [rsvPersonData]);

  useEffect(() => {
    // 입력된 데이터들이 유효한 경우(checkValid) setCheckValidInside값에 유효여부를 넣어준다(checkValidInside 상태에 따라 배차하기 버튼 활성화 / 비활성화)
    setCheckValidInside(checkValid);
  }, [checkValid]);

  /**
   * 예약 정보를 파악(APP인지 신규인지)를 파악하여 해당 예약에 맞는 API로 데이터를 전송하기 위함
   */
  const handleValidationCheck = () => {
    if(isRsvPerson && rsvPersonDatas) { // APP예약인 경우
      if(getReservationDatas.drv_no != '') {
        // 앱 예약 기존 운행에 추가
        appRsvAddOldDrive_API(rsvPersonDatas.data[0].rsv_no);
      } else {
        // 앱 예약 신규 운행 생성
        appRsvMakeNewDrive_API(rsvPersonDatas.data[0].rsv_no);
      }
    } else {
      // 앱 예약 고객이 아니라면, 승객 정보가 존재하는지 유무를 판별
      checkRiderInfo_API(getReservationDatas.phone, getReservationDatas.name);
    }
  }

  /**
   * 등록 되있는 앱 예약으로 기존 운행에 추가
   * @param {*} rsvNo 앱 예약의 예약 번호
   * 
   * 운행 추가가 완료되면, 운행완료 모달창 팝업
   */
  const appRsvAddOldDrive_API = async (rsvNo) => {
    if (!rsvNo) {
      return false;
    }
    try {
      const options = {
        method: "POST",
        data: {
          drv_no : getReservationDatas.drv_no,
          rsv_no : rsvNo
        }
      };

      let depTime = getReservationDatas.rsv_dep_time;
      let destTime = getReservationDatas.rsv_dest_time;
      let oper_no = getReservationDatas.rsv_operator_no;
      const result = await request(`/api/v1/drive/reserve?operator_no=${oper_no}&updateRsvDepTime=${depTime}&updateRsvDestTime=${destTime}`, options);
      if (result.data.success) {
        handleOpenConfirmModal(6)
      }
    } catch (error) {
      handleCloseConfirmModal();
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };

  /**
   * 등록 되있는 앱 예약으로 신규 운행을 생성
   * @param {*} rsvNo 앱 예약의 예약 번호
   * 
   * 운행 생성 완료되면, 운행완료 모달창 팝업
   */
  const appRsvMakeNewDrive_API = async (rsvNo) => {
    if (!rsvNo) {
      return false;
    }
    try {
      const options = {
        method: "POST",
        data: {
          drv_baggage_cnt: getReservationDatas.drv_baggage_cnt,
          drv_car_no: getReservationDatas.drv_car_no,
          drv_driver_no: getReservationDatas.drv_driver_no,
          drv_person_cnt: getReservationDatas.drv_person_cnt,
          drv_route_no: getReservationDatas.drv_route_no,
          drv_stat: getReservationDatas.drv_stat,
          rsv_no : rsvNo
        }
      };

      let depTime = getReservationDatas.rsv_dep_time;
      let destTime = getReservationDatas.rsv_dest_time;
      let oper_no = getReservationDatas.rsv_operator_no;
      const result = await request(`/api/v1/drive?operator_no=${oper_no}&updateRsvDepTime=${depTime}&updateRsvDestTime=${destTime}`, options);
      if (result.data.success) {
        handleOpenConfirmModal(6)
      }
    } catch (error) {
      console.log("]-----] App Make New Drv Post error [-----[ ", error);
      handleCloseConfirmModal();
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };

  /**
   * 예약 하는 승객 정보로 서버에 전송하여 데이터가 존재하는지 유/무 판별하기 위함
   * @param {*} riderPhone 예약 정보의 승객 전화번호
   * @param {*} riderName 예약 정보의 승객 이름
   * 서버에 승객 데이터가 존재하지 않는 경우, 신규 등록
   * 서버에 승객 데이터가 존재하는 경우, API리턴 값으로 승객 고유 번호를 가져와 예약 진행
   */
  const checkRiderInfo_API = async (riderPhone, riderName) => {
    if (!riderPhone) {
      return false;
    }
    try {
      const options = {
        method: "GET",
      };
      const result = await request(`/api/v1/rider/phone?rider_phone=${riderPhone}`,options);
      if (result.data.success) {
        if(result.data.data.length == 0) { // 승객 데이터가 없을때 승객 신규등록 
          signInNewRider(riderName, riderPhone);
        } else {
          makeNewReservation(result.data.data[0].rider_no); // 승객 데이터가 있을때 위에서 가져온 승객고유번호로 신규 예약생성
        }
      }
    } catch (error) {
      console.log("]-----] Check Rider Post error [-----[ ", error);
      handleCloseConfirmModal();
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };

  /**
   * 승객 이름과 전화 번호로 신규 승객을 등록시켜주기 위해
   * @param {*} rName 예약 승객 이름
   * @param {*} rPhone 예약 승객 전화 번호
   * 승객 정보를 등록 후, API 리턴 값으로 승객 고유 번호를 가져와 예약 진행
   */
  const signInNewRider = async (rName, rPhone) => {
    try {
      const options = {
        method: "POST",
        data: {
          rider_address: 'ETC',
          rider_birth: '',
          rider_device_uuid: '',
          rider_email: '',
          rider_gb: 'PHONE',
          rider_gender: 'ETC',
          rider_marketing_fl: 'NO',
          rider_nm: rName,
          rider_phone: rPhone,
          rider_token: '',
        }
      };
      const result = await request(`/api/v1/rider`, options);
      if (result) {
        makeNewReservation(result.data.data);
      }
    } catch (error) {
      console.log("]-----] Add Rider Post error [-----[ ", error);
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };

  /**
   * 배차하기에서 받아와 저장되어 있던 데이터(getReservationDatas)와 승객 고유 번호로 예약을 생성하기 위함
   * @param {*} rNumber 승객 고유 번호
   * 예약이 완료되면, API리턴 값으로 예약 번호를 가져오고,
   * getReservationDatas에 운행 번호가 있는지를 판별하여, 기존운행인지 신규운행인지 판별하여 예약 번호를 전달하여 진행
   */
  const makeNewReservation = async (rNumber) => {
    if (loadingSave) {
      return false;
    }
    try {
      const options = {
        method: "POST",
        data: {
          rsv_baggage_cnt: getReservationDatas.rsv_baggage_cnt,
          rsv_dep_station_no: getReservationDatas.rsv_dep_station_no,
          rsv_dep_time: getReservationDatas.rsv_dep_time,
          rsv_dest_station_no: getReservationDatas.rsv_dest_station_no,
          rsv_dest_time: getReservationDatas.rsv_dest_time,
          rsv_est_distance: getReservationDatas.rsv_est_distance,
          rsv_est_time: getReservationDatas.rsv_est_time,
          rsv_gb: getReservationDatas.rsv_gb,
          rsv_operator_no: getReservationDatas.rsv_operator_no,
          rsv_person_cnt: getReservationDatas.rsv_person_cnt,
          rsv_rider_no: rNumber,
          rsv_stat: getReservationDatas.rsv_stat
        }
      };
      const result = await request(`/api/v1/reserve`, options);
      if (result) {
        if(getReservationDatas.drv_no) { // 등록된 운행 번호 있는지 판별 후
          // 기존운행에 추가
          requestAddOldDrive(result.data.data.rsv_no); // 리턴값 변경 수정 부분
        } else {
          // 신규 운행 생성
          requestMakeNeWDrive(result.data.data.rsv_no); // 리턴값 변경 수정 부분
        }
        
      }
    } catch (error) {
      console.log("]-----] Phone Make New Rsv Post error [-----[ ", error);
      handleCloseConfirmModal();
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };

  /**
   * 배차하기에서 받아와 저장되어 있던 데이터(getReservationDatas)와 예약 번호로 신규 운행을 생성하기 위함
   * @param {*} rsvNo 예약 번호
   * 운행이 생성되면, 예약 완료 팝업을 띄워준다
   */
  const requestMakeNeWDrive = async (rsvNo) => {
    if (!rsvNo) {
      return false;
    }
    try {
      const options = {
        method: "POST",
        data: {
          drv_baggage_cnt: getReservationDatas.drv_baggage_cnt,
          drv_car_no: getReservationDatas.drv_car_no,
          drv_driver_no: getReservationDatas.drv_driver_no,
          drv_person_cnt: getReservationDatas.drv_person_cnt,
          drv_route_no: getReservationDatas.drv_route_no,
          drv_stat: getReservationDatas.drv_stat,
          rsv_no : rsvNo
        }
      };

      const result = await request(`/api/v1/drive`, options);
      if (result.data.success) {
        handleOpenConfirmModal(6)
      }
    } catch (error) {
      console.log("]-----] Phone Make New Drv Post error [-----[ ", error);
      handleCloseConfirmModal();
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };

  /**
   * 배차하기에서 받아와 저장되어 있던 데이터(getReservationDatas)와 예약 번호로 기존 운행에 추가해주기 위함
   * @param {*} rsvNo 예약 번호
   * 운행이 생성되면, 배차완료 창을 닫아 준다
   */
  const requestAddOldDrive = async (rsvNo) => {
    if (!rsvNo) {
      return false;
    }
    try {
      const options = {
        method: "POST",
        data: {
          drv_no : getReservationDatas.drv_no,
          rsv_no : rsvNo
        }
      };

      const result = await request(`/api/v1/drive/reserve`, options);
      if (result.data.success) {
        handleOpenConfirmModal(6)
      }
    } catch (error) {
      console.log("]-----] Phone Add Old Drv Post error [-----[ ", error);
      handleCloseConfirmModal();
    } finally {
      // setLoadingSave(false);
    }
    return true;
  };


  // 최종적으로 로딩창을 열어주며, 데이터 체크 후 api 전송
  const handleSendReqDatas = () => {
    setLoadingSave(true);
    handleValidationCheck();
  }

  /**
   * 배차 완료 모달이 떳을 때, 확인 버튼을 클릭 해주면, 배차하기창과 배차완료 모달창을 닫아주기 위해
   */
  const handleSuccess = () => {
    handleCloseModal();
    handleCloseConfirmModal();
  }
  
  return (
  <React.Fragment>
    <Modal 
      disableEnforceFocus   // 오토포커스 테두리 삭제
      disableAutoFocus
      disableEscapeKeyDown
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleCloseModal}
      BackdropComponent={Backdrop}
      hideBackdrop
      className={classes.modal}
    >
      <Fade in={openModal}>
        <div className={classes.root}>
          <div className={classes.closeBtnWrap} onClick={handleCloseModal}>
            <img
              src="/static/buttonicon/popup-close.svg"
              alt="배차하기창닫기"
              className={classes.closeBtn}
            />
          </div>
          <div style={{display: "flex", height: "100%", }}>
            <ReservationMap
              openModal={openModal}
              setFinalRoutesInfoList={setFinalRoutesInfoList}
              setRadioRouteNumber={setRadioRouteNumber}
              radioRouteNumber={radioRouteNumber}
              setTotalDistance={setTotalDistance}
              setTotalTime={setTotalTime}
              setPersonTotalTime={setPersonTotalTime}
              setPersonTotalDistance={setPersonTotalDistance}
              setSelectFindStation={setSelectFindStation}
              selectFindStation={selectFindStation}
              setSelectFindAddress={setSelectFindAddress}
              selectFindAddress={selectFindAddress}
              isRsvPerson={isRsvPerson}
              rsvPersonDatas={rsvPersonDatas}
              currentStarts={currentStarts}
              setCurrentStarts={setCurrentStarts}
              currentArrivals={currentArrivals}
              setCurrentArrivals={setCurrentArrivals}
              currentStartsCheck={currentStartsCheck}
              setCurrentStartsCheck={setCurrentStartsCheck}
              currentArrivalsCheck={currentArrivalsCheck}
              setCurrentArrivalsCheck={setCurrentArrivalsCheck}
            />
            <ReservationContent
              openModal={openModal}
              checkValid={checkValid}
              setCheckValid={setCheckValid}
              finalRoutesInfoList={finalRoutesInfoList}
              setRadioRouteNumber={setRadioRouteNumber}
              radioRouteNumber={radioRouteNumber}
              totalTime={totalTime}
              totalDistance={totalDistance}
              personTotalTime={personTotalTime}
              personTotalDistance={personTotalDistance}
              openValue={openValue}
              getReservationDatas={getReservationDatas}
              setGetReservationDatas={setGetReservationDatas}
              setSelectFindStation={setSelectFindStation}
              setSelectFindAddress={setSelectFindAddress}
              isRsvPerson={isRsvPerson}
              rsvPersonDatas={rsvPersonDatas}
              setCurrentStarts={setCurrentStarts}
              setCurrentArrivals={setCurrentArrivals}
              currentStartsCheck={currentStartsCheck}
              setCurrentStartsCheck={setCurrentStartsCheck}
              currentArrivalsCheck={currentArrivalsCheck}
              setCurrentArrivalsCheck={setCurrentArrivalsCheck}
            />
          </div>
          <div className={classes.bookingSuccessWrap}>
          {checkValidInside ?
            <div className={classes.bookingBtn} onClick={() => handleOpenConfirmModal(5)}>
              배차하기
            </div>
          :
            <div className={classes.bookingBtnFail}>
              배차하기
            </div>
          }
          </div>
        </div>
      </Fade>
    </Modal>

    <Modal 
      disablePortal
      disableEnforceFocus   // 오토포커스 테두리 삭제
      disableAutoFocus
      disableEscapeKeyDown
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.confirmModal}
      open={openConfirmModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500, }}
    >
      <Fade in={openConfirmModal}>
        <div className={classes.confirmModalBoxReserve}>
        {loadingSave && 
          <div style={{position:"absolute", left:0, top:0 ,zIndex: 9999, width:"100%", height:"100%"}}>
            <div style={{position:"absolute", top:"50%", right:"50%"}}>
              <CircularProgress />
            </div>
          </div>
          }
        {modalKind === 5 ?
        <React.Fragment>
          <div className={classes.confirmModalTitle}><span style={{color:"#f25f5d"}}>예약진행</span> 하시겠습니까?
            <img src="/static/modal_x.png"
              alt="logo"
              className={classes.confirmModalClose}
              onClick={handleCloseConfirmModal}/>
          </div>
          <div className={classes.confirmModalContentWrapper}>
            <div style={{position:"relative",}}>
              <div style={{position:"absolute",left:0, top:0, }}>·</div>
              <div style={{marginLeft:6, display:"flex",}}>
                <div style={{float:"", width:80, textOverflow:"elipsis", whiteSpace:"nowrap", overflowX:"hidden" }}>{getReservationDatas.name}</div>
                <span style={{color:"#d0d1d5", margin:"0 5px"}}>|</span>
                <div style={{float:"", }}>{getReservationDatas.phone}</div>
                <span style={{color:"#d0d1d5", margin:"0 5px"}}>|</span>
                <div style={{float:"", }}>인원수 : {getReservationDatas.rsv_person_cnt}</div>
              </div>
            </div>
            <div style={{position:"relative", marginTop:5}}><div style={{position:"absolute",left:0, top:0, }}>·</div><div style={{marginLeft:6,}}>{getReservationDatas.car_name}</div></div>
            <div style={{position:"relative", marginTop:5}}>
              <div style={{position:"absolute",left:0, top:0, }}>·</div>
              <div style={{marginLeft:6}}>
                <div style={{position:"relative"}}>
                  <img
                    src="/static/mapicon/drt_busstation.png"
                    alt=""
                    style={{width:23, height:23, position:"absolute", left:0, top:0 }}
                  />
                  <div style={{marginLeft:28}}>
                    <div style={{display:"flex", }}>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dep_station_name}</div>
                      <span style={{margin:"0 3px"}}>|</span>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dep_station_no}</div>
                    </div>
                    <div>승차<span>{getReservationDatas.rsv_dep_time.substring(8,10)+":"+getReservationDatas.rsv_dep_time.substring(10,12)}</span></div>
                  </div>
                  <img
                    src="/static/mapicon/down_arrow.png"
                    style={{width:6, height:11, position:"absolute", left:8, bottom:-5}}
                  />
                </div>

                <div style={{position:"relative", marginTop:10, }}>
                  <img
                    src="/static/mapicon/drt_busstation.png"
                    alt=""
                    style={{width:23, height:23, position:"absolute", left:0, top:0 }}
                  />
                  <div style={{marginLeft:28}}>
                    <div style={{display:"flex", }}>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dest_station_name}</div>
                      <span style={{margin:"0 3px"}}>|</span>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dest_station_no}</div>
                    </div>
                    <div>하차<span>{getReservationDatas.rsv_dest_time.substring(8,10)+":"+getReservationDatas.rsv_dest_time.substring(10,12)}</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.confirmModalContentImgWrapper}>
              <img
                src="/static/popup_cancel.png"
                alt="cancel"
                onClick={handleCloseConfirmModal}
                className={classes.confirmModalContentImg}
              />
              <img
                src="/static/popup2.png"
                alt="confirm"
                onClick={handleSendReqDatas}
                className={classes.confirmModalContentImg}
              />
            </div>
          </div>
          </React.Fragment>
          : modalKind === 6 ?
          <React.Fragment>
          <div className={classes.confirmModalTitle}><span style={{color:"#f25f5d"}}>예약진행</span> 완료되었습니다.
            <img src="/static/modal_x.png"
              alt="logo"
              className={classes.confirmModalClose}
              onClick={handleSuccess}/>
          </div>
          <div className={classes.confirmModalContentWrapper}>
            <div style={{position:"relative",}}>
              <div style={{position:"absolute",left:0, top:0, }}>·</div>
              <div style={{marginLeft:6, display:"flex",}}>
                <div style={{float:"left", width:80, textOverflow:"elipsis", whiteSpace:"nowrap", overflowX:"hidden"}}>{getReservationDatas.name}</div>
                <span style={{color:"#d0d1d5", margin:"0 5px"}}>|</span>
                <div style={{float:"left", }}>{getReservationDatas.phone}</div>
                <span style={{color:"#d0d1d5", margin:"0 5px"}}>|</span>
                <div style={{float:"left", }}>{getReservationDatas.rsv_person_cnt}</div>
              </div>
            </div>
            <div style={{position:"relative", marginTop:5}}><div style={{position:"absolute",left:0, top:0, }}>·</div><div style={{marginLeft:6,}}>{getReservationDatas.car_name}</div></div>
            <div style={{position:"relative", marginTop:5}}>
              <div style={{position:"absolute",left:0, top:0, }}>·</div>
              <div style={{marginLeft:6}}>
                <div style={{position:"relative"}}>
                  <img
                    src="/static/mapicon/drt_busstation.png"
                    alt=""
                    style={{width:23, height:23, position:"absolute", left:0, top:0 }}
                  />
                  <div style={{marginLeft:28}}>
                    <div style={{display:"flex", }}>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dep_station_name}</div>
                      <span style={{margin:"0 3px"}}>|</span>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dep_station_no}</div>
                    </div>
                    <div>승차<span>{getReservationDatas.rsv_dep_time.substring(8,10)+":"+getReservationDatas.rsv_dep_time.substring(10,12)}</span></div>
                  </div>
                  <img
                    src="/static/mapicon/down_arrow.png"
                    style={{width:6, height:11, position:"absolute", left:8, bottom:-5}}
                  />
                </div>

                <div style={{position:"relative", marginTop:10, }}>
                  <img
                    src="/static/mapicon/drt_busstation.png"
                    alt=""
                    style={{width:23, height:23, position:"absolute", left:0, top:0 }}
                  />
                  <div style={{marginLeft:28}}>
                    <div style={{display:"flex", }}>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dest_station_name}</div>
                      <span style={{margin:"0 3px"}}>|</span>
                      <div style={{float:"left", }}>{getReservationDatas.rsv_dest_station_no}</div>
                    </div>
                    <div>하차<span>{getReservationDatas.rsv_dest_time.substring(8,10)+":"+getReservationDatas.rsv_dest_time.substring(10,12)}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={classes.confirmModalContentImgWrapper}>
              <img
                src="/static/popup2.png"
                alt="confirm"
                onClick={handleSuccess}
                className={classes.confirmModalContentImg}
                style={{marginLeft:70}}
              />
            </div>
            </div>
            </React.Fragment>
            :<div></div>
        }
        </div>
      </Fade>
    </Modal>
  </React.Fragment>
  );
}

Reservation.getInitialProps = async props => {
  const { store, isServer } = props;
  store.dispatch(loadMapData());
  store.dispatch(loadBusData());
  store.dispatch(loadDriverData());
  store.dispatch(loadMemberSearchPhoneData());
  store.dispatch(loadRsvNumberData());
  store.dispatch(loadRouteStationData());
  store.dispatch(saveConsultantState());
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
  }
  return { isServer };
};
const mapStateToProps = state => {
  return {
    drtstation: state.navermap.drtstation.data,
    searchMember: state.member.searchMember,
    rsvPersonData: state.rsvlist.rsvNoData,
    memberInfo: state.member,
  };
};

const mapDispatchToProps = dispatch => ({
  mapLoad: () => dispatch(loadMapData()),
  carLoad: () => dispatch(loadBusData()),
  driverLoad: (num) => dispatch(loadDriverData(num)),
  riderPhoneSearch: (memberPhone) => dispatch(loadMemberSearchPhoneData(memberPhone)),
  dispatchPersonLoad: (rsvNo) => dispatch(loadRsvNumberData(rsvNo)),
  routeStationLoad: () => dispatch(loadRouteStationData()),
  consultantState: (cs_state) => dispatch(saveConsultantState(cs_state)),
  selectDepStationInfos: (depStationInfos) => dispatch(selectDepStationData(depStationInfos)),
  selectDestStationInfos: (destStationInfos) => dispatch(selectDestStationData(destStationInfos)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reservation);