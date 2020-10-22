import { actionTypes } from './actions'

export const initialState = {
  data: false,
  error: false,
  st_nm: false,
  find_st_nm: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_STATION_SUCCESS:
      return {
        ...state,
        ...{ data: action.data }
      }

    case actionTypes.LOAD_STATION_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }
    
//  ============ Find Statin Name ============  //
    case actionTypes.LOAD_FIND_STATION_NAME:
      return {
        ...state,
        ...{ st_nm: action.st_nm }
      }
    case actionTypes.LOAD_FIND_STATION_NAME_SUCCESS:
      return {
        ...state,
        ...{ find_st_nm: action.find_st_nm }
      }

    case actionTypes.LOAD_FIND_STATION_NAME_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }


    default:
      return state
  }
}

export default reducer
