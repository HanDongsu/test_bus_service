import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';

import { connect } from "react-redux";
import { compose } from "recompose";
import { makeStyles } from '@material-ui/core/styles';
import { withAuthSync } from "../utils/auth";

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { loadDriverData } from "../lib/driver/actions";
// 컴포넌트 
import DriverModal from "./DriverModal";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 650,
  },
  gridContainer: {
    minWidth: 1034,
    height: 55,
    backgroundColor: '#f5f6f8',
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  // 커스텀 셀렉트 박스 만들기 
  selectBox: {
    width: 100,
    height: 30,
    border: "1px solid #d0d1d5", // 테두리
    backgroundColor: "#ffffff",
    background: "url(/static/selectbox.png)",  /* 화살표 모양의 이미지 */
    backgroundPosition: '90% 50%',
    // backgroundSize: '8% 20%', // 제거하니 오히려 더 선명해짐.
    backgroundRepeat: 'no-repeat',
    appearance: 'none',  // 화살표 삭제
    borderRadius: 0, // 둥근 테두리 제거
    paddingLeft: 9,
    marginRight: 10,

    fontSize: 13,
    color: '#8d939b',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  enrollIcon:{
    width: 221,
    height: 55,
    backgroundColor: '#223152',
    display: "flex",
    fontFamily: 'NotoSansCJKkr',
    color: '#fefefe',
    fontSize: 16,
    lineHeight: 2,
    justifyContent: 'center',
    alignItems: "center",
    '&:hover': {
      cursor: 'pointer',
    },
  },
  searchList: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  tableContainer: {
    minWidth: 1034,
    height: 480,
  },
  tableHead: {
    height: 25,
    fontSize:13,
    border:'none',
    borderRight:'1px solid #fff',
    color:"#fff",
    backgroundColor:"#7b8499",
    textAlign:"center",
    justifyContent: 'center', //가로에서 센터
    alignItems: "center", // 세로에서 센터
    '&:last-child': {
      padding:'1px 5px',
      fontSize:13,
      border:'none',
      color:'#fff',
      backgroundColor:'#7b8499',
      textAlign:'center',
    },
  },
  tableCell: {
    fontSize:13,
    height: 29,
    border:'none',
    borderRight:'1px solid #d0d1d5',
    borderBottom:'1px solid #d0d1d5',
    textAlign:'center',
    justifyContent: 'center', //가로에서 센터
    alignItems: "center", // 세로에서 센터
    '&:last-child' : {
      fontSize: 13,
      height: 29,
      border:'none',
      borderBottom:'1px solid #d0d1d5',
      display: "flex",
    },
  },
  NoSearchdata:{
    width: 250,
    height: 100,
    display: "flex",
    position:"absolute", 
    left: "45%",
    right: "50%",
    marginTop: "5%",
    fontSize: 20,
    zIndex: 100,
  },

}));

const DriverManage = (param) => {
  const classes = useStyles();
  const [driverOpen, setDriverOpen] = useState(false);
  const [driverNo, setDriverNo] = useState(false);
  const [condition, setCondition] = useState('name');
  const [query, setQuery] = useState({value: ''});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    param.driverlistLoad('');
  }, []);

  const handleDetail = (e) => {
    setDriverNo(e);
    handleDriverOpen();
  };

  const handleDriverOpen = () => {
    setDriverOpen(true);
  };
  // 검색 엔터키 
  const handleEnterkey = e => {
    if(event.keyCode==13){
      handleLoad();
    }
  };
  // 목록초기화 , 새로고침
  const handleRefresh = () => {
    setQuery({value: ''});
    setPage(0);
    param.driverlistLoad('');
  };
  // 검색항목 셀렉트박스
  const handleCondition = e => {
    setCondition(e.target.value);
  };
  const handleQuery = e => {
    setQuery({value: e.target.value});
  };
  // 검색 버튼 
  const handleLoad = () => {
    param.driverlistSearchLoad('', condition, query.value);
    setPage(0);
  };
  const handleRowperPage = e => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: 'num', label: '번호'},
    { id: 'name', label: '이름'},
    { id: 'tel', label: '연락처'},
    { id: 'gender', label: '성별'},
    { id: 'id', label: '아이디'},
    { id: 'email', label: '이메일'},
    { id: 'enrolldate', label: '등록일시'},
    { id: 'detailbtn', label: '상세'},
  ];

  function createData(num, name, tel, gender, id, email, enrolldate, detailbtn) {
    return { num, name, tel, gender, id, email, enrolldate, detailbtn};
  }
    
  const rows = [];

  if(param.driverlist){
    for(let i=0;i<param.driverlist.data.length ;i++){
      const list = param.driverlist.data[i];

      rows.push(createData(
        i+1,list.employ_nm,list.employ_phone,
        list.employ_gender == "MALE" ? "남" : "여",
        list.employ_id,
        list.employ_email,
        list.driver_reg_date_time.substr(0,4)+"."+list.driver_reg_date_time.substr(4,2)+"."+list.driver_reg_date_time.substr(6,2)+" "+list.driver_reg_date_time.substr(8,2)+":"+list.driver_reg_date_time.substr(10,2),
        list.driver_no,
        ),);
    };
  }


  return (
    <div className={classes.root}>
        <div style={{fontSize:22}}>승무사원 관리</div>

      <Grid className={classes.gridContainer}>
        <Grid>
          <select onChange={handleCondition} value={condition} style={{marginLeft: 15}} className={classes.selectBox}>
            <option defaultValue value="00">전체</option>
            <option value="name">이름</option>
            <option value="phone">연락처</option>
            <option value="email">이메일</option>
          </select>
        </Grid>
        <Grid>
          <Paper style={{minWidth:'20%',width:230, height:30, paddingTop:3, border:"1px solid #d0d1d5", display:"flex", boxShadow:'none', borderRadius:0, float:'left'}}>
            <InputBase onChange={handleQuery} onKeyUp={handleEnterkey} value={query.value} className={classes.searchList} style={{color: '#8d939b'}} placeholder="검색어를 입력하세요"/>
            <IconButton onClick={handleLoad} className={classes.iconButton} aria-label="search" style={{padding: 0, paddingRight: 3 }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid>
          <select onChange={handleRowperPage} className={classes.selectBox} style={{marginLeft: 15}}>
            <option defaultValue value='15'>15개 씩</option>
            <option value='40'>40개 씩</option>
            <option value="60">60개 씩</option>
            <option value="100">100개 씩</option>
          </select>
        </Grid>

        <Button size='small' onClick={handleRefresh}>
            <RefreshIcon/>
        </Button>

        <Grid  container item xs justify="flex-end" alignItems='center'>
          <Grid>
            <div className={classes.enrollIcon} onClick={handleDriverOpen}>승무사원 등록</div>
          </Grid>
        </Grid>

      </Grid>

      <TableContainer className={classes.tableContainer}>
        <Table
          stickyHeader 
          className={classes.table}
          aria-label="sticky table"
          size="small"
          padding="none"
        >
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id} classes={{root:classes.tableHead}}>
                  {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length < 1 && 
            <TableRow className={classes.NoSearchdata} role="checkbox" tabIndex={-1}>
                검색 데이터가 없습니다.
            </TableRow>
          }

          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                {columns.map(column => {
                  const value = row[column.id];
              return (
                  <TableCell key={row.no} classes={{root:classes.tableCell}}>
                  {column.format &&  typeof value === 'number' ?
                    column.format(value)
                    : column.id == 'detailbtn' ?
                    <img src="static/buttonicon/btn-detail.svg" onClick={() => handleDetail(row['detailbtn'])} alt="" style={{cursor: 'pointer'}} />
                    : value  // 다른조건이 없을경우 일반출력
                  }
                  </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

        <DriverModal driverNo={driverNo} setDriverNo={setDriverNo} driverOpen={driverOpen} setDriverOpen={setDriverOpen}/>
    </div>
  );

};

const mapStateToProps = state => {
  return {
    driverlist: state.driver.driverList,
  };
};

const mapDispatchToProps = dispatch => ({
  driverlistLoad: (num) => dispatch(loadDriverData(num)),
  driverlistSearchLoad: (num, condition, query) => dispatch(loadDriverData(num, condition, query)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withAuthSync
)(DriverManage);