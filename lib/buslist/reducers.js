import { actionTypes } from './actions'

export const initialState = {
  data: null,
  carList: false,
  error: false,
  carNum: null,
  rsvDate: null,
  carRsvLists: false,
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_BUSDATA_SUCCESS:
      return {
        ...state,
        ...{ carList: action.carList }
      }

    case actionTypes.LOAD_BUSDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }
    
    case actionTypes.LOAD_CARNUMRSVDATEDATA:
      return {
        ...state,
        ...{ carNum: action.carNum,
             rsvDate: action.rsvDate,
             error: action.error
         }
      }
    case actionTypes.LOAD_CARNUMRSVDATEDATA_SUCCESS:
      return {
        ...state,
        ...{ carRsvLists: action.carRsvLists,
         }
      }

    case actionTypes.LOAD_CARNUMRSVDATEDATA_ERROR:
      return {
        ...state,
        ...{ error: action.error }
      }

    default:
      return state
  }
}

export default reducer
