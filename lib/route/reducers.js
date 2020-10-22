import { actionTypes } from './actions'

export const initialState = {
  data: false,
  error: false,
  routeNum: false,
  routeStationList: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_ROUTEDATA_SUCCESS:
      return {
        ...state,
        ...{ data: action.data }
      }

    case actionTypes.LOAD_ROUTEDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }
    
    case actionTypes.LOAD_ROUTESTATIONLISTDATA:
      return {
        ...state,
        ...{ routeNum: action.routeNum,
             error: action.error
         }
      }
    case actionTypes.LOAD_ROUTESTATIONLISTDATA_SUCCESS:
      return {
        ...state,
        ...{ data: action.data,
         }
      }

    case actionTypes.LOAD_ROUTESTATIONLISTDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    default:
      return state
  }
}

export default reducer
