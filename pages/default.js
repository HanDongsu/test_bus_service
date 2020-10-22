import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from "react-redux";
import { compose } from "recompose";
import { makeStyles } from '@material-ui/core/styles';
import { withAuthSync } from "../utils/auth";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const Default = () => {
  const classes = useStyles();
  const [order, setOrder] = useState('');

  const handleRequestSort = () => {
  };
  
  // console.log("]-----] member [-----[ ", member);


  return (
    <div className={classes.root}>
        기본페이지
    </div>
  );

};

// Default.getInitialProps = async props => {
//   const { store, isServer } = props;
//   store.dispatch(loadBusData());
//   store.dispatch(loadMemberData());
//   if (isServer) {
//     /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
//   }
//   return { isServer };
// };

const mapStateToProps = state => {
  return {
    member: state.member.data,
  };
};

const mapDispatchToProps = dispatch => ({
  memberLoad: () => dispatch(loadMemberData()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withAuthSync
)(Default);