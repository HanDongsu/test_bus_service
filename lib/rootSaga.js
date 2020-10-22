import { all } from "redux-saga/effects";
import sampleSaga from "./sample/sagas";
import buslistSaga from "./buslist/sagas";
import authSaga from "./auth/sagas";
import contentSaga from "./content/sagas";
import driverSaga from "./driver/sagas";
import consultant from "./consultant/sagas";
import memberSaga from "./member/sagas";
import navermapSaga from "./navermap/sagas";
import driveSaga from "./drive/sagas";
import rsvlistSaga from "./rsvlist/sagas";
import routeSaga from "./route/sagas";
import stationSaga from "./station/sagas";
import routestationSaga from "./routestation/sagas";
import riderSaga from "./rider/sagas";
import vocSaga from "./voc/sagas";
import boardSaga from "./board/sagas";

const mergedSagas = [].concat(
  sampleSaga,
  buslistSaga,
  authSaga,
  contentSaga,
  driverSaga,
  consultant,
  memberSaga,
  navermapSaga,
  driveSaga,
  rsvlistSaga,
  routeSaga,
  stationSaga,
  routestationSaga,
  riderSaga,
  vocSaga,
  boardSaga,
);

function* rootSaga() {
  yield all(mergedSagas);
}

export default rootSaga;
