import { actionTypes } from "./actions";
import produce from "immer";

export const initialState = {
  contents: false,
  content: false,
  error: false,
  loading: false
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_CONTENTS:
      return produce(state, draft => {
        draft.contents = false;
        draft.error = false;
        draft.loading = true;
      });
    case actionTypes.LOAD_CONTENTS_SUCCESS:
      return produce(state, draft => {
        draft.contents = action.data;
        draft.error = false;
        draft.loading = false;
      });
    case actionTypes.LOAD_CONTENTS_ERROR:
      return produce(state, draft => {
        draft.data = action.data;
        draft.error = false;
        draft.loading = false;
      });
      case actionTypes.LOAD_CONTENT:
      return produce(state, draft => {
        draft.content = false;
        draft.error = false;
        draft.loading = true;
      });
    case actionTypes.LOAD_CONTENT_SUCCESS:
      return produce(state, draft => {
        draft.content = action.data;
        draft.error = false;
        draft.loading = false;
      });
    case actionTypes.LOAD_CONTENT_ERROR:
      return produce(state, draft => {
        draft.data = action.data;
        draft.error = false;
        draft.loading = false;
      });
    default:
      return state;
  }
};

export default contentReducer;
