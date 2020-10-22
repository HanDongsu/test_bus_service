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
import { loadRiderData } from "../lib/rider/actions";

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

}));

const RiderModal = (openstate) => {
  const classes = useStyles();
  const [riderNo, setRiderNo] = useState('');
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderBirth, setRiderBirth] = useState('');
  const [riderGender, setRiderGender] = useState('');
  const [riderEmail, setRiderEmail] = useState('');
  const [riderAddr, setRiderAddr] = useState('');
  const [riderMarketing, setRiderMarketing] = useState('');
  const [riderGb, setRiderGb] = useState('');
  const [riderToken, setRiderToken] = useState('');
  const [riderDivcuuid, setRiderDivcuuid] = useState('');
  const [birthCheck, setBirthCheck] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modifyMode, setModifyMode] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // 모달 팝업 열고 닫을때 실행 
  useEffect(() => {
    openstate.riderOneLoad('');
      if(openstate.riderNo){
        openstate.riderOneLoad(openstate.riderNo);
      }
    }, [openstate.riderNo]);

  // 모달 팝업 열고 닫을때 실행 
  useEffect(() => {
    if(openstate.riderOne.data){
      setRiderNo(openstate.riderOne.data.rider_no);
      setRiderName(openstate.riderOne.data.rider_nm);
      setRiderPhone(openstate.riderOne.data.rider_phone);
      setRiderBirth(openstate.riderOne.data.rider_birth);
      setRiderGender(openstate.riderOne.data.rider_gender);
      setRiderEmail(openstate.riderOne.data.rider_email);
      setRiderAddr(openstate.riderOne.data.rider_address);
      setRiderMarketing(openstate.riderOne.data.rider_marketing_fl);
      setRiderGb(openstate.riderOne.data.rider_gb);
      setRiderToken(openstate.riderOne.data.rider_token);
      setRiderDivcuuid(openstate.riderOne.data.rider_device_uuid);
    }
  }, [openstate.riderOne.data, modifyMode]);

  const handleClose = () => {
    openstate.setRiderOpen(false);
    openstate.setRiderNo(false);
    setModifyMode(false);
    setRiderNo('');
    setRiderName('');
    setRiderPhone('');
    setRiderBirth('');
    setRiderGender('');
    setRiderEmail('');
    setRiderAddr('');
    setRiderMarketing('');
    setRiderGb('');
    setRiderToken('');
    setRiderDivcuuid('');
  };
  const handleCloseModal = e => {
    setOpenModal(false);
  };
  const handleCloseModify = () => {
    setModifyMode(false);
  }

  const handleRiderModify = () => {
    setModifyMode(true);
  };

  const handleRiderName = e => {
    setRiderName(e.target.value);
  };

  const handleRiderPhone = e => {
    var e = event.target.value;
    var tel = "";
    var number = e.replace(/[^0-9]/g, "");
    if(number.length < 4) {
        tel += number;
        setRiderPhone(tel);
    } else if(number.length < 7) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3);
        setRiderPhone(tel);
    } else if(number.length < 11 ) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3, 3);
        tel += "-";
        tel += number.substr(6);
        setRiderPhone(tel);
    } else if(number.replace(/\-/g,'').length < 12) {
        tel += number.substr(0, 3);
        tel += "-";
        tel += number.substr(3, 4);
        tel += "-";
        tel += number.substr(7);
        setRiderPhone(tel);
    }
  };

  const handleRiderBirth = e => {
    setRiderBirth(e.target.value);
    if(e.target.value.length == 0 || e.target.value.length == 8) {
      setBirthCheck(true);
    } else {
      setBirthCheck(false);
    }
  };

  const handleRiderGender = e => {
    setRiderGender(e.target.value);
  }

  const handleRiderEmail = e => {
    setRiderEmail(e.target.value);
  }

  const handleRiderAddress = e => {
    setRiderAddr(e.target.value);
  }

  const handleRiderMarketing = e => {
    setRiderMarketing(e.target.value);
  }

  const handleModalDelete = () => {
    setOpenModal(true);
  };

  {/* 승객 삭제 */}
  const handleRiderDelete = async () => {
    if (loadingSave) {
      return false;
    }
    try { 
      setLoadingSave(true);
      const options = {
        method: "PUT",
      };
      const result = await request(`/api/v1/rider/${riderNo}/delete`, options);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    handleClose();
    handleCloseModal();
    openstate.riderOneLoad('');
    return true;
  };

  {/* 승객 정보 수정 */}
  const handleRiderModifySave = async () => {
    if (loadingSave) {
      return false;
    }
    try { 
      setLoadingSave(true);
      const options = {
        method: "PUT",
        data: {
          rider_address: riderAddr ? riderAddr : 'ETC',
          rider_birth: riderBirth ? riderBirth : '',
          rider_device_uuid: riderDivcuuid ? riderDivcuuid : '',
          rider_email: riderEmail ? riderEmail : '',
          rider_gb: riderGb,
          rider_gender: riderGender ? riderGender : 'ETC',
          rider_marketing_fl: riderMarketing? riderMarketing : 'NO',
          rider_nm: riderName,
          rider_phone: riderPhone,
          rider_token: riderToken ? riderToken : '',
        },
      };
      
      const result = await request(`/api/v1/rider/${riderNo}/update`, options);
      console.log("]-----]  result [-----[ ", result);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    handleClose();
    openstate.riderOneLoad('');
    return true;
  };

  {/* 승객 등록 */}
  const handleRiderSave = async () => {
    if (loadingSave) {
      return false;
    }
    try { 
      setLoadingSave(true);
      const options = {
        method: "POST",
        data: {
          rider_address: riderAddr? riderAddr : 'ETC',
          rider_birth: riderBirth? riderBirth : '',
          rider_device_uuid: '',
          rider_email: riderEmail? riderEmail : '',
          rider_gb: 'PHONE',
          rider_gender: riderGender? riderGender : 'ETC',
          rider_marketing_fl: riderMarketing? riderMarketing : 'NO',
          rider_nm: riderName? riderName : '',
          rider_phone: riderPhone? riderPhone : '',
          rider_token: '',
        },
      };

      const result = await request(`/api/v1/rider`, options);
      console.log("]-----]  result [-----[ ", result);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
      setLoadingSave(false);
    }
    handleClose();
    openstate.riderOneLoad('');
    return true;
  };

  return (
    <div>
      <Dialog open={openstate.riderOpen} onClose={handleClose} 
            maxWidth={false}
            disableBackdropClick >
          {loadingSave && 
            <div style={{position:"absolute", left: "50%",right: "50%",marginTop: "15%", zIndex: 100, }}>
            <CircularProgress />
            </div>
          }

        <DialogTitle disableTypography={true} className={classes.dialogTitle} >
        {modifyMode && openstate.riderNo ?
          "고객 정보 수정" : !openstate.riderNo ?
          "고객 등록" : "고객 정보" 
        }
           
        </DialogTitle>
        <img src="static/popup-close.svg" alt="승객닫기" className={classes.popupClose} onClick={handleClose}/>

        <DialogContent >
          {/* 전체 그리드 */}
          <Grid className={classes.dialogContent}>

            {/* 컨테이너 1 */}
            <Grid container className={classes.borderCont} style={{borderTop:'1px solid #dee0e8'}} >
              <Grid style={{width:150, height:54,alignContent:'start', backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>고객명
                <span style={{color:'#d62b28'}}>*</span></Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
                <input type="text" onChange={handleRiderName} value={riderName} maxLength="20" className={classes.inputMenu} placeholder='' maxLength="30"/>
                : <input type="text" disabled value={riderName} maxLength="20" className={classes.inputMenu} placeholder='' maxLength="30"/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 2 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>전화번호
                  <span style={{color:'#d62b28'}}>*</span>
              </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
                <input type="text" onChange={handleRiderPhone} value={riderPhone} maxLength="15" className={classes.inputMenu} placeholder='- 없이 숫자만 입력하세요'/>
                : <input type="text" disabled value={riderPhone} maxLength="15" className={classes.inputMenu} placeholder='- 없이 숫자만 입력하세요'/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 4 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>생년월일
                 </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
              <React.Fragment>
                <input type="text" onChange={handleRiderBirth} value={riderBirth} maxLength="8" className={classes.inputMenu} placeholder='Ex) 19501020'/>
                {riderBirth && riderBirth.length < 8 ?
                  <span style={{marginLeft:10, color:"#d62b28", fontSize:12,}}>8자로 입력해주시 바랍니다.(ex. 19501020)</span>
                :
                  ''
                }
              </React.Fragment>
                : <input type="text" disabled value={riderBirth} maxLength="20" className={classes.inputMenu} placeholder='Ex) 19501020'/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 5 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>성별
                 </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
                <select className={classes.selectBox} onChange={handleRiderGender} value={riderGender}>
                  <option value="ETC">선택</option>
                  <option value="MALE">남</option>
                  <option value="FEMALE">여</option>
                </select>
                : <select className={classes.selectBox} value={riderGender} disabled>
                    <option value="ETC">선택</option>
                    <option value="MALE">남</option>
                    <option value="FEMALE">여</option>
                  </select>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 6 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>이메일
              </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
                <input type="text" onChange={handleRiderEmail} value={riderEmail} maxLength="20" className={classes.inputMenu} placeholder=''/>
                : <input type="text" disabled value={riderEmail} maxLength="20" className={classes.inputMenu} placeholder=''/>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 7 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>주소 </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
                <select className={classes.selectBox} onChange={handleRiderAddress} value={riderAddr}>
                  <option value="ETC">선택</option>
                  <option value="SEJONG">세종시민</option>
                  <option value="OTHER_CITY">타 지역민</option>
                </select>
                : <select className={classes.selectBox} value={riderAddr} disabled>
                    <option value="ETC">선택</option>
                    <option value="SEJONG">세종시민</option>
                    <option value="OTHER_CITY">타 지역민</option>
                  </select>
              }
              </Grid>
            </Grid>

            {/* 컨테이너 8 */}
            <Grid container className={classes.borderCont}>
              <Grid style={{width:150, height:54, backgroundColor:'#f5f6f8'}} className={clsx(classes.bigText,classes.allCenter)}>마케팅 동의 여부 </Grid>
              <Grid className={classes.allCenter}>
              {(!openstate.riderNo || modifyMode) ?
                <select className={classes.selectBox} onChange={handleRiderMarketing} value={riderMarketing}>
                  <option value="">선택</option>
                  <option value="YES">Y</option>
                  <option value="NO">N</option>
                </select>
                : <select className={classes.selectBox} value={riderMarketing} disabled>
                    <option value="">선택</option>
                    <option value="YES">Y</option>
                    <option value="NO">N</option>
                  </select>
              }
              </Grid>
            </Grid>
          
          </Grid>

          {/* 하단 버튼  */}
          {modifyMode && openstate.riderNo ?
          <Grid container style={{justifyContent: 'center',height:80, marginTop: 15}} >
            <div className={classes.modalButton} onClick={handleCloseModify}>이전</div>
            <div onClick={handleRiderModifySave} style={{backgroundColor:'#223152',color:'#fefefe',marginLeft:10}} className={classes.modalButton} >완료</div>
          </Grid>
          : !openstate.riderNo ?

          <Grid container style={{justifyContent: 'center',height:80, marginTop: 15}} >
            <div className={classes.modalButton}  onClick={handleClose}>취소</div>
            {(riderName && riderPhone && riderPhone.length > 11 && birthCheck) ?
              <div onClick={handleRiderSave} style={{backgroundColor:'#223152',color:'#fefefe',marginLeft:10}} className={classes.modalButton} >등록</div>
            :
              <div className={classes.modalButtonNone} style={{marginLeft:10}} >등록</div>
            }
          </Grid> 
          :
          <Grid container style={{justifyContent: 'center',height:80, marginTop: 15}} >
              <div className={classes.modalButton} onClick={handleModalDelete}>삭제</div>
              <div className={classes.modalButton}  style={{marginLeft:10}} onClick={handleClose}>취소</div>
              <div onClick={handleRiderModify} style={{backgroundColor:'#223152',color:'#fefefe',marginLeft:10}} className={classes.modalButton} >수정</div>
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
          <div className={classes.modalTitle}>고객삭제
            <img src="/static/modal_x.png"
              alt="logo"
              className={classes.modalClose}
              onClick={handleCloseModal}
            />
          </div>
          <div style={{margin:30, marginTop:20}}>
            <div style={{fontSize: 14, marginBottom: 13}}>· 해당 고객을 삭제 하시겠습니까?</div >
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
                onClick={handleRiderDelete}
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
    riderOne: state.rider.data,
  };
};

const mapDispatchToProps = dispatch => ({
  riderOneLoad: (num) => dispatch(loadRiderData(num)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RiderModal);