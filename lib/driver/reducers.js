import { actionTypes } from './actions'

export const initialState = {
  data: null,
  error: false,
  driverList: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_DRIVERDATA_SUCCESS:
      return {
        ...state,
        ...{ driverList: action.driverList }
      }

    case actionTypes.LOAD_DRIVERDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    default:
      return state
  }
}

export default reducer