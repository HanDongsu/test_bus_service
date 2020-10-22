import { actionTypes } from './actions'

export const initialState = {
  data: false,
  error: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_RIDERDATA_SUCCESS:
      return {
        ...state,
        ...{ data: action.data }
      }

    case actionTypes.LOAD_RIDERDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    default:
      return state
  }
}

export default reducer