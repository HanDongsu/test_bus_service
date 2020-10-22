import { actionTypes } from './actions'

export const initialState = {
  data: false,
  error: false,
  rsvNo: false,
  rsvNoData: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_RSVLISTDATA_SUCCESS:
      return {
        ...state,
        ...{ data: action.data }
      }

    case actionTypes.LOAD_RSVLISTDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    case actionTypes.LOAD_RSV_NUMBER_DATA_SUCCESS:
      return {
        ...state,
        ...{ rsvNoData: action.rsvNoData }
      }

    case actionTypes.LOAD_RSVLISTDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    default:
      return state
  }
}

export default reducer