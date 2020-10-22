import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { loadData } from "../lib/sample/actions";
import { withAuthSync } from "../utils/auth";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0)
  }
}));
const Sample = ({ sampleLoad, sample }) => {
  const classes = useStyles();
  console.log(sample);
  // console.log(isServer);

  useEffect(() => {
    if (!sample) {
      sampleLoad();
    }
  }, []);

  return (
    <div className={classes.root}>
      sample
      {sample && <div>{sample.title}</div>}
    </div>
  );
};

Sample.getInitialProps = async props => {
  // console.log(props);
  const { store, isServer } = props;
  // console.log("Nav isServer token==[ ", token);
  // store.dispatch(loadData());
  console.log("Sample isServer===", isServer);
  if (isServer) {
    /** 로그인이 필요한 페이지는 서버사이드 렌더링을 하지 않는다 */
    store.dispatch(loadData());
  }
  return { isServer };
};

const mapStateToProps = state => {
  return {
    sample: state.sample.data
  };
};

const mapDispatchToProps = dispatch => ({
  sampleLoad: () => dispatch(loadData())
});
// export default Sample;
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withAuthSync
)(Sample);
