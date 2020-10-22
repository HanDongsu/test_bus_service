export const actionTypes = {
  LOAD_CONSULTANT: "LOAD_CONSULTANT",
  LOAD_CONSULTANT_SUCCESS: "LOAD_CONSULTANT_SUCCESS",
  LOAD_CONSULTANT_ERROR: "LOAD_CONSULTANT_ERROR",
  LOAD_CONSULTANTONE: "LOAD_CONSULTANTONE",
  LOAD_CONSULTANTONE_SUCCESS: "LOAD_CONSULTANTONE_SUCCESS",
  LOAD_CONSULTANTONE_ERROR: "LOAD_CONSULTANTONE_ERROR",
  SAVE_CONSULTANT_STATE: "SAVE_CONSULTANT_STATE",
};

export function loadConsultant(num, condition, query) {
  return { type: actionTypes.LOAD_CONSULTANT,
      num,
      condition,
      query
  };
}

export function loadConsultantSuccess(data) {
  return {
    type: actionTypes.LOAD_CONSULTANT_SUCCESS,
    data
  };
}

export function loadConsultantError(error) {
  return {
    type: actionTypes.LOAD_CONSULTANT_ERROR,
    error
  };
}

export function loadConsultantOne(num) {
  return { type: actionTypes.LOAD_CONSULTANTONE,
    num 
  };
}

export function loadConsultantOneSuccess(logindata) {
  return {
    type: actionTypes.LOAD_CONSULTANTONE_SUCCESS,
    logindata
  };
}

export function loadConsultantOneError(error) {
  return {
    type: actionTypes.LOAD_CONSULTANTONE_ERROR,
    error
  };
}

export function saveConsultantState(cs_state) {
  return { type: actionTypes.SAVE_CONSULTANT_STATE,
    cs_state 
  };
}