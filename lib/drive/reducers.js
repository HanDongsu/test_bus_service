import { actionTypes } from './actions'
import produce from "immer";

export const initialState = {
  data: false,
  carNum: false,
  error: false,
  drv_list: false,
}

function contentReducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_DRIVEDATA_SUCCESS:
      return {
        ...state,
        ...{ data: action.data }
      }
    case actionTypes.LOAD_DRIVEDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    case actionTypes.LOAD_DRIVE_SEARCH_CARNUM_DATA:
      return produce(state, draft => {
        draft.carNum = action.carNum;
        draft.error = false;
      });

      case actionTypes.LOAD_DRIVE_SEARCH_CARNUM_SUCCESS:
      return produce(state, draft => {
        draft.drv_list = action.drv_list
        draft.error = false;
      });

      case actionTypes.LOAD_DRIVE_SEARCH_CARNUM_ERROR:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });

    default:
      return state
  }
}

export default contentReducer