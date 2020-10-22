import { actionTypes } from './actions';
import produce from "immer";

export const initialState = {
  drtstation: false,
  error: false,
  depStationInfos: {
    data: false,
    routes: false
  },
  destStationInfos: {
    data: false,
    routes: false
  },
}

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
//  ============ Station ============  //
    case actionTypes.LOAD_MAPDATA:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });
    case actionTypes.LOAD_MAPDATA_SUCCESS:
      return produce(state, draft => {
        draft.drtstation = action.drtstation;
        draft.error = false;
      });
    case actionTypes.LOAD_MAPDATA_ERROR:
      return produce(state, draft => {
        draft.data = action.data;
        draft.error = false;
      });
//  ============ Selected Dep Station Info ============  //
    case actionTypes.SELECT_DEPSTATIONDATA:
      return produce(state, draft => {
        draft.depStationInfos.data = action.depStationInfos;
        // draft.data = false;
        draft.error = false;
      });
    case actionTypes.SELECT_DEPSTATIONDATA_SUCCESS:
      return produce(state, draft => {
        // draft.stationRoute = action.stationRoute;
        if(action.depStationInfos.data) {
          draft.depStationInfos.routes = action.depStationInfos.data.routes;
        } else {
          draft.depStationInfos.routes = false;
        }
        draft.error = false;
      });
    case actionTypes.SELECT_DEPSTATIONDATA_ERROR:
      return produce(state, draft => {
        draft.data = action.data;
        draft.error = false;
      });
//  ============ Selected Dest Station Info ============  //
    case actionTypes.SELECT_DESTSTATIONDATA:
      return produce(state, draft => {
        draft.destStationInfos.data = action.destStationInfos;
        // draft.data = false;
        draft.error = false;
      });
    case actionTypes.SELECT_DESTSTATIONDATA_SUCCESS:
      return produce(state, draft => {
        // draft.stationRoute = action.stationRoute;
        if(action.destStationInfos.data) {
          draft.destStationInfos.routes = action.destStationInfos.data.routes;
        } else {
          draft.destStationInfos.routes = false;
        }
        draft.error = false;
      });
    case actionTypes.SELECT_DESTSTATIONDATA_ERROR:
      return produce(state, draft => {
        draft.data = action.data;
        draft.error = false;
      });
    default:
      return state;
  }
};

export default contentReducer;
