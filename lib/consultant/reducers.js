import { actionTypes } from './actions'

export const initialState = {
  data: false,
  logindata: false,
  error: false,
  cs_state: 0,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_CONSULTANT_SUCCESS:
      return {
        ...state,
        ...{ data: action.data }
      }

    case actionTypes.LOAD_CONSULTANT_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    case actionTypes.LOAD_CONSULTANTONE_SUCCESS:
      return {
        ...state,
        ...{ logindata: action.logindata }
      }

    case actionTypes.LOAD_CONSULTANTONE_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    case actionTypes.SAVE_CONSULTANT_STATE:
      return {
        ...state,
        ...{
          cs_state: action.cs_state,
          error: action.error
        }
      }

    default:
      return state
  }
}

export default reducer
