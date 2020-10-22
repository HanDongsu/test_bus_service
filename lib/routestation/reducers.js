import { actionTypes } from './actions'

export const initialState = {
  data: null,
  error: false,
  routeStations: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    //  ============ Route Stations Data ============  //
    case actionTypes.LOAD_ROUTESTATIONDATA_SUCCESS:
      return {
        ...state,
        ...{ allList: action.data,
         }
      }

    case actionTypes.LOAD_ROUTESTATIONDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    default:
      return state
  }
}

export default reducer
