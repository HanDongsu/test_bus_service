import React, { useEffect ,useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import request from "../lib/request";
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";
import { loadDriverData } from "../lib/driver/actions";

const useStyles = makeStyles(theme => ({
  '@global': {
    '.MuiDialog-paperWidthFalse': {
      height:669,
    },
    '.MuiPaper-rounded': {
      borderRadius: 0,
    },
  },
  dialogTitle: {
    display: "flex",
    justifyContent: 'center',
    alignItems: "center",
    fontSize:30,
  },
  dialogContent: {
    minWidth: 850,
    maxWidth: '100%',
    height: 480,
  },
  borderCont: {
    borderBottom: '1px solid #dee0e8',
    borderLeft: '1px solid #dee0e8',
    borderRight: '1px solid #dee0e8',
  },
  allCenter:{
    display: "flex",
    justifyContent: 'center',
    alignItems: "center",
  },
  bigText:{
    fontSize: 16,
    color: '#212121',
  },
  inputMenu: {
    width: 220,
    height: 34,
    marginLeft: 15,
    border: 'solid 1px #d0d1d5',
    paddingLeft: 9,
    fontSize: 13,
  },
  modalButton:{
    marginTop: 20,
    width: 145,
    height: 48,
    backgroundColor: '#ffffff',
    border: 'solid 1px #d0d1d5',
    display: "flex",
    color: '#212121',
    fontSize: 16,
    lineHeight: 2,
    justifyContent: 'center',
    alignItems: "center",
    transform: 'perspective(100px) translateZ(0px)', // 가상의 100의 공간을 뒤에 만들고 현재 z = -100위치 
    transition: 'transform 200ms linear', // fade 효과
    '&:hover': {
      cursor: 'pointer',
      color: '#6fc9ef',
      transform: 'perspective(100px) translateZ(2px)', // 가상의 100의 공간을 만들고, hover를 하면 5px만큼 튀어나와보이는 착시
    },
  },
  modalButtonNone:{
    backgroundColor: '#d0d1d5',
    marginTop: 20,
    width: 145,
    height: 48,
    display: "flex",
    color: '#fefefe',
    fontSize: 16,
    lineHeight: 2,
    justifyContent: 'center',
    alignItems: "center",
  },
  popupClose:{
    position: 'absolute',
    top: 14,
    right:14,
    cursor: 'pointer',
  },
  // 커스텀 셀렉트 박스 만들기 
  selectBox: {
    width: 100,
    height: 34,
    border: "1px solid #d0d1d5", // 테두리
    backgroundColor: "#ffffff",
    background: "url(/static/selectbox.png)",  /* 화살표 모양의 이미지 */
    backgroundPosition: '90% 50%',
    backgroundSize: '8% 20%',
    backgroundRepeat: 'no-repeat',
    appearance: 'none',  // 화살표 삭제
    borderRadius: 0, // 둥근 테두리 제거
    paddingLeft: 9,
    marginLeft: 15,
    marginRight: 10,
    fontSize: 13,
    color: '#8d939b',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  
  // 모달창 디자인
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: 290,
    height: 148,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    '&:focus': {
      outline: 'none',
    }
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
  modalContentImg: {
    marginRight: 10,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  buplicateButton: {
    width: 103,
    height: 34,
    backgroundColor:'#223152',
    color:'#fefefe',
    fontSize: 13,
    lineHeight: 2,
    justifyContent: 'center',
    alignItems: "center",
    display: "flex",
    '&:hover': {
      cursor: 'pointer',
    },
  },


}));

const DriverModal = (openstate) => {
  const classes = useStyles();
  
  const [driverNo, setDriverNo] = useState('');

  const [driverEmail, setDriverEmail] = useState('');
  const [driverGender, setDriverGender] = useState('');
  const [driverId, setDriverId] = useState('');
  const [driverGb, setDriverGb] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverTeam, setDriverTeam] = useState('');
  const [driverToken, setDriverToken] = useState('');

  const [duplicateCheck, setDuplicateCheck] = useState(false); // 중복 검사 클릭 유/무
  const [duplicateId, setDuplicateId] = useState(false); // 실제 아이디 중복 체크 유/무
  const [isKorean, setIsKorean] = useState(true); // 아이디 한글 유/무

  const [openModal, setOpenModal] = useState(false);
  const [modifyMode, setModifyMode] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);


  // 모달 팝업 열고 닫을때 실행 
  useEffect(() => {
    openstate.driverLoad('');
      if(openstate.driverNo){
        openstate.driverLoad(openstate.driverNo);
      }
    }, [openstate.driverNo]);

  // 모달 팝업 열고 닫을때 실행 
  useEffect(() => {
    console.log('승무사원 단건 정보');
    console.log(openstate.driverOne.data);
    if(openstate.driverOne.data){
      setDriverNo(openstate.driverOne.data.driver_no);
      setDriverEmail(openstate.driverOne.data.employ_email);
      setDriverGender(openstate.driverOne.data.employ_gender);
      setDriverId(openstate.driverOne.data.employ_id);
      setDriverGb(openstate.driverOne.data.employ_member_gb);
      setDriverName(openstate.driverOne.data.employ_nm);
      setDriverPhone(openstate.driverOne.data.employ_phone);
      setDriverPassword(openstate.driverOne.data.employ_pw);
      setDriverLicense(openstate.driverOne.data.driver_license);
      setDriverTeam(openstate.driverOne.data.driver_team);
      setDriverToken(openstate.driverOne.data.driver_token);
    }
  }, [openstate.driverOne.data, modifyMode]);


  const handleClose = () => {
    openstate.setDriverOpen(false);
    openstate.setDriverNo(false);
    setModifyMode(false);
    setDriverNo('');
    setDriverEmail('');
    setDriverGender('');
    setDriverId('');
    setDriverGb('');
    setDriverName('');
    setDriverPhone('');
    setDriverPassword('');
    setDriverLicense('');
    setDriverTeam('');
  };
  const handleCloseModal = e => {
    setOpenModal(false);
  };
  const handleCloseModify = () => {
    setModifyMode(false);
  };

  const handleDriverModify = () => {
    setModifyMode(true);
  };

  const handleDriverName = e => {
    setDriverName(e.target.value);
  };
  const handleDriverId = e => {
    setDriverId(e.target.value);
    setDuplicateCheck(false); // 입력 될 때, 중복검사 false 로 바꿈
    setDuplicateId(false); // 입력 될 때, 중복검사 false 로 바꿈
    setIsKorean(true); // 입력 될 때, 한글검사 false 로 바꿈
  };

  const handleDriverPassword = e => {
    setDriverPassword(e.target.value);
  };

  const handleDriverPhone = e => {
    var e = e.target.value;
    var tel = "";
    var number = e.replace(/[^0-9]/g, "");
    if(number.length < 4) {
        tel += number;
        setDriverPhone(tel);
    } else if(number.length < 7) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3);
        setDriverPhone(tel);
    } else if(number.length < 11 ) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3, 3);
        tel += "-";
        tel += number.substr(6);
        setDriverPhone(tel);
    } else if(number.replace(/\-/g,'').length < 12) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3, 4);
        tel += "-";
        tel += number.substr(7);
        setDriverPhone(tel);
    }
  };
  const handleDriverGender = e => {
    setDriverGender(e.target.value);
  };
  const handleDriverLicense = e => {
    setDriverLicense(e.target.value);
  };
  const handleDriverEmail = e => {
    setDriverEmail(e.target.value);
  };

  const handleModalDelete = () => {
    setOpenModal(true);
  };

  const handleDuplicateId = async () => {
    if (loadingSave) {
      return false;
    }
    try {
      var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      setLoadingSave(true);
      const options = {
        method: "POST",
      };
      console.log(driverId);
      const result = await request(`/api/v1/driver/chkid?driver_id=${driverId}`, options);
      if(result) {
        if(result.data.data == null) {
          if(check.test(driverId)) {
            // 한글있을때
            setIsKorean(false);
            setDuplicateId(false);
          } else {
            setIsKorean(true);
            setDuplicateId(true);
          }
          setDuplicateCheck(true);
        } else {
          setDuplicateId(false);
          setDuplicateCheck(true);
          setIsKorean(false);
        }
      }
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    return true;
  }

  const handleDriverDelete = async () => {
    if (loadingSave) {
      return false;
    }
    try { 
      setLoadingSave(true);
      const options = {
        method: "PUT",
      };
      const result = await request(`/api/v1/driver/${driverNo}/delete`, options);
      console.log("]-----]  result [-----[ ", result);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    handleClose();
    handleCloseModal();
    openstate.driverLoad('');
    return true;
  };
  const handleDriverModifySave = async () => {
    if (loadingSave) {
      return false;
    }
    try { 
      setLoadingSave(true);
      const options = {
        method: "PUT",
        data: {
          driver_license: driverLicense ? driverLicense : '',
          driver_team: driverTeam ? driverTeam : 'TEAMA',
          driver_token: driverToken ? driverToken : '',
          employ_birth: '',
          employ_email: driverEmail ? driverEmail : '',
          employ_gender: driverGender,
          employ_id: driverId,
          employ_member_gb: driverGb ? driverGb : 'DRIVER',
          employ_nm: driverName,
          employ_phone: driverPhone,
          employ_pw: driverPassword,
        },
      };
      const result = await request(`/api/v1/driver/${driverNo}/update`, options);
      console.log("]-----]  result [-----[ ", result);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    handleClose();
    openstate.driverLoad('');
    return true;
  };

  const handleDriverSave = async () => {
    if (loadingSave) {
      return false;
    }
    try { 
      setLoadingSave(true);
      const options = {
        method: "POST",
        data: {
          driver_license: driverLicense ? driverLicense : '',
          driver_team: driverTeam ? driverTeam : 'TEAMA',
          driver_token: driverToken ? driverToken : '',
          employ_birth: '',
          employ_email: driverEmail ? driverEmail : '',
          employ_gender: driverGender,
          employ_id: driverId,
          employ_member_gb: driverGb ? driverGb : 'DRIVER',
          employ_nm: driverName,
          employ_phone: driverPhone,
          employ_pw: driverPassword,
        },
      };
      const result = await request(`/api/v1/driver`, options);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    handleClose();
    openstate.driverLoad('');
    return true;
  };

  return (
    <div>
      <Dialog open={openstate.driverOpen} onClose={handleClose} 
            maxWidth={false}
            disableBackdropClick >
          {loadingSave && 
            <div style={{position:"absolute", left: "50%",right: "50%",marginTop: "15%", zIndex: 100, }}>
            <CircularProgress />
            </div>
          }

        <DialogTitle disableTypography={true} className={classes.dialogTitle} >
        {modifyMode && openstate.driverNo ?
          "승무사원 정보 수정" : !openstate.driverNo ?
          "승무사원 등록" : "승무사원 정보" 
        }
           
        </DialogTitle>
        <img src="static/popup-close.svg" alt="VOC닫기" className={classes.popupClose} onClick={handleClose}/>

        <DialogContent >
          {/* 전체 그리드 */}
          <Grid className={classes.dialogContent}>

            {/* 컨테이너 1 */}
            <Grid container className={classes.borderCont} style={{borderTop:'1px solid #dee0e8'}} >
              <Grid style={{width:150, height:54,alignContent:'start', backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>승무사원명
                <span style={{color:'#d62b28'}}>*</span></Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.driverNo || modifyMode) ?
                <input type="text" onChange={handleDriverName} value={driverName} maxLength="20" className={classes.inputMenu} placeholder='' maxLength="30"/>
                : <input type="text" disabled value={driverName} maxLength="20" className={classes.inputMenu} placeholder='' maxLength="30"/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 2 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>승무사원ID
                  <span style={{color:'#d62b28'}}>*</span>
              </Grid>
              <Grid className={classes.allCenter}>
              {!openstate.driverNo ?
              <React.Fragment>
                <input type="text" onChange={handleDriverId} value={driverId} maxLength="15" className={classes.inputMenu} placeholder=''/>
                <div onClick={handleDuplicateId} className={classes.buplicateButton} >중복 확인</div>
                {driverId && driverId.length >3 && duplicateCheck  && duplicateId && isKorean ?
                  <span style={{marginLeft:10, color:"#4fa0cb", fontSize:12,}}>사용 가능한 아이디 입니다.</span>
                : driverId && driverId.length > 3 && duplicateCheck && !duplicateId && !isKorean ?
                  <span style={{marginLeft:10, color:"#d62b28", fontSize:12,}}>사용할 수 없는 아이디입니다.</span>
                : driverId && driverId.length > 3 && !duplicateCheck ?
                  <span style={{marginLeft:10, color:"#d62b28", fontSize:12,}}>중복 확인을 해주세요.</span>
                :
                  <span style={{marginLeft:10, color:"#d62b28", fontSize:12,}}>4 ~ 15글자로 입력해주세요(한글 불가).</span>
                }
              </React.Fragment>
                : <input type="text" disabled value={driverId} maxLength="15" className={classes.inputMenu} placeholder=''/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 4 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>비밀번호
                  <span style={{color:'#d62b28'}}>*</span></Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.driverNo || modifyMode) ?
              <React.Fragment>
                <input type="password" onChange={handleDriverPassword} value={driverPassword} maxLength="20" className={classes.inputMenu} placeholder=''/>
                {driverPassword && driverPassword.length > 3 ?
                ''
                :
                <span style={{marginLeft:10, color:"#d62b28", fontSize:12,}}>4 ~ 15글자로 입력해주세요.</span>
                }
              </React.Fragment>
                : <input type="password" disabled value={driverPassword} maxLength="20" className={classes.inputMenu} placeholder=''/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 5 마지막 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>전화번호 
                  <span style={{color:'#d62b28'}}>*</span></Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.driverNo || modifyMode) ?
                <input type="text" onChange={handleDriverPhone} value={driverPhone} maxLength="20" className={classes.inputMenu} placeholder=''/>
                : <input type="text" disabled value={driverPhone} maxLength="20" className={classes.inputMenu} placeholder=''/>
              }
              </Grid>
            </Grid>

            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>성별
                  <span style={{color:'#d62b28'}}>*</span></Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.driverNo || modifyMode) ?
                <select className={classes.selectBox} onChange={handleDriverGender} value={driverGender}>
                  <option value="">선택</option>
                  <option value="MALE">남</option>
                  <option value="FEMALE">여</option>
                </select>
                : <select className={classes.selectBox} value={driverGender} disabled>
                    <option value="ETC">선택</option>
                    <option value="MALE">남</option>
                    <option value="FEMALE">여</option>
                  </select>
              }
              </Grid>
            </Grid>

            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>운전면허 등록번호 </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.driverNo || modifyMode) ?
                <input type="text" onChange={handleDriverLicense} value={driverLicense} maxLength="20" className={classes.inputMenu} placeholder=''/>
                : <input type="text" disabled value={driverLicense} maxLength="20" className={classes.inputMenu} placeholder=''/>
              }
              </Grid>
            </Grid>

            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>이메일</Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.driverNo || modifyMode) ?
                <input type="text" onChange={handleDriverEmail} value={driverEmail} maxLength="20" className={classes.inputMenu} placeholder=''/>
                : <input type="text" disabled value={driverEmail} maxLength="20" className={classes.inputMenu} placeholder=''/>
              }
              </Grid>
            </Grid>

          </Grid>

          {/* 하단 버튼  */}
          {modifyMode && openstate.driverNo ?
          <Grid container style={{justifyContent: 'center',height:80, marginTop: 15}} >
            <div className={classes.modalButton} onClick={handleCloseModify}>이전</div>
            <div onClick={handleDriverModifySave} style={{backgroundColor:'#223152',color:'#fefefe',marginLeft:10}} className={classes.modalButton} >완료</div>
          </Grid>
          :!openstate.driverNo ?
          <Grid container style={{justifyContent: 'center',height:80, marginTop: 15}} >
            <div className={classes.modalButton}  onClick={handleClose}>취소</div>
            {(driverName && driverId && driverPassword && driverPhone && driverGender && duplicateCheck && duplicateId && driverPhone.length > 11 && driverPassword.length > 3) ?
              <div onClick={handleDriverSave} style={{backgroundColor:'#223152',color:'#fefefe',marginLeft:10}} className={classes.modalButton} >등록</div>
            :
              <div className={classes.modalButtonNone} style={{marginLeft:10}} >등록</div>
            }
          </Grid> 
            :
          <Grid container style={{justifyContent: 'center',height:80, marginTop: 15}} >
              <div className={classes.modalButton} onClick={handleModalDelete}>삭제</div>
              <div className={classes.modalButton}  style={{marginLeft:10}} onClick={handleClose}>취소</div>
              <div onClick={handleDriverModify} style={{backgroundColor:'#223152',color:'#fefefe',marginLeft:10}} className={classes.modalButton} >수정</div>
          </Grid>
          }
        </DialogContent>
      </Dialog>

      <Modal 
        disableEnforceFocus   // 오토포커스 테두리 삭제
        disableAutoFocus
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
      }}>
      <Fade in={openModal}>
        <div className={classes.modalBox}>
          <div className={classes.modalTitle}>승무사원삭제
            <img src="/static/modal_x.png"
              alt="logo"
              className={classes.modalClose}
              onClick={handleCloseModal}
            />
          </div>
          <div style={{margin:30, marginTop:20}}>
            <div style={{fontSize: 13, marginBottom: 13}}>· 해당 승무사원을 삭제 하시겠습니까?</div >
            <div style={{marginLeft: 25,marginTop: 20}}>
              <img
                src="/static/popup_cancel.png"
                alt="logo"
                onClick={handleCloseModal}
                className={classes.modalContentImg}
              />
              <img
                src="/static/popup_delete.png"
                alt="logo"
                onClick={handleDriverDelete}
                className={classes.modalContentImg}
              />
          </div>
        </div>
        </div>
      </Fade>
    </Modal>

    </div>
  );
}

const mapStateToProps = state => {
  return {
    driverOne: state.driver.driverList,
  };
};

const mapDispatchToProps = dispatch => ({
  driverLoad: (num) => dispatch(loadDriverData(num)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverModal);