import { actionTypes } from './actions'
import produce from "immer";

export const initialState = {
  data: false,
  memberPhone: false,
  memberInfo: false,
  memberNum: false,
  curStation: false,
  error: false,
  riderInfoSave: false,
  saveDatas: false,
  call2callNum: false,
  call2callName: false,
}

function contentReducer (state = initialState, action) {
  switch (action.type) {
//  ============ Member ============  //
    case actionTypes.LOAD_MEMBERDATA:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });

    case actionTypes.LOAD_MEMBERDATA_SUCCESS:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });

    case actionTypes.LOAD_MEMBERDATA_ERROR:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });
//  ============ MemberSearchPhone ============  //
    case actionTypes.LOAD_MEMBER_SEARCH_PHONE_DATA:
      return produce(state, draft => {
        draft.memberPhone = action.memberPhone;
        draft.error = false;
      });

    case actionTypes.LOAD_MEMBER_SEARCH_PHONE_SUCCESS:
      return produce(state, draft => {
        draft.memberInfo = action.memberInfo;
        draft.error = false;
      });

    case actionTypes.LOAD_MEMBER_SEARCH_PHONE_ERROR:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });
//  ============ MemberSearchCurStation ============  //
    case actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_DATA:
      return produce(state, draft => {
        draft.memberNum = action.memberNum;
        draft.error = false;
      });

    case actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_SUCCESS:
      return produce(state, draft => {
        draft.curStation = action.curStation
        draft.error = false;
      });

    case actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_ERROR:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });

//  ============ Save Member Datas ============  //
    case actionTypes.SAVE_CALLED_RIDER_INFO_DATA:
      return produce(state, draft => {
        draft.riderInfoSave = action.riderInfoSave;
        draft.error = false;
      });

    case actionTypes.SAVE_CALLED_RIDER_INFO_DATA_SUCCESS:
      return produce(state, draft => {
        draft.saveDatas = action.saveDatas
        draft.error = false;
      });

    case actionTypes.SAVE_CALLED_RIDER_INFO_DATA_ERROR:
      return produce(state, draft => {
        draft.data = false;
        draft.error = false;
      });

//  ============ Call 2 Call 전화 걸기 ============  //
    case actionTypes.LOAD_CALL_2_CALL_EVENT_DATA:
      return produce(state, draft => {
        draft.call2callNum = action.call2callNum;
        draft.call2callName = action.call2callName;
        draft.error = false;
      });

    default:
      return state
  }
}

export default contentReducer