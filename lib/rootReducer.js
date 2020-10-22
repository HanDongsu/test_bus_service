import { combineReducers } from "redux";

import sample from "./sample/reducers";
import buslist from "./buslist/reducers";
import auth from "./auth/reducers";
import content from "./content/reducers";
import driver from "./driver/reducers";
import consultant from "./consultant/reducers";
import member from "./member/reducers";
import navermap from "./navermap/reducers";
import drive from "./drive/reducers";
import rsvlist from "./rsvlist/reducers";
import route from "./route/reducers";
import station from "./station/reducers";
import routestation from "./routestation/reducers";
import rider from "./rider/reducers";
import voc from "./voc/reducers";
import board from "./board/reducers";

export default combineReducers({
  sample,
  buslist,
  auth,
  content,
  driver,
  consultant,
  member,
  navermap,
  drive,
  rsvlist,
  route,
  station,
  routestation,
  rider,
  voc,
  board,
});
