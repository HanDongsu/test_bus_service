export const actionTypes = {
  LOAD_BUSDATA: "LOAD_BUSDATA",
  LOAD_BUSDATAFIND: "LOAD_BUSDATAFIND",
  LOAD_BUSDATA_SUCCESS: "LOAD_BUSDATA_SUCCESS",
  LOAD_BUSDATA_ERROR: "LOAD_BUSDATA_ERROR",
  LOAD_CARNUMRSVDATEDATA: "LOAD_CARNUMRSVDATEDATA",
  LOAD_CARNUMRSVDATEDATA_SUCCESS: "LOAD_CARNUMRSVDATEDATA_SUCCESS",
  LOAD_CARNUMRSVDATEDATA_ERROR: "LOAD_CARNUMRSVDATEDATA_ERROR"
};

export function loadBusData() {
  return { type: actionTypes.LOAD_BUSDATA };
}

export function loadBusDataFind(num,condition,query) {
  return { type: actionTypes.LOAD_BUSDATAFIND,
    num,
    condition,
    query
  };
}

export function loadBusDataSuccess(carList) {
  return {
    type: actionTypes.LOAD_BUSDATA_SUCCESS,
    carList
  };
}

export function loadBusDataError(error) {
  return {
    type: actionTypes.LOAD_BUSDATA_ERROR,
    error
  };
}

export function loadCarNumRSVDateData(carNum, rsvDate) {
  return {
    type: actionTypes.LOAD_CARNUMRSVDATEDATA,
    carNum,
    rsvDate
  };
}

export function loadCarNumRSVDateDataSuccess(carRsvLists) {
  return {
    type: actionTypes.LOAD_CARNUMRSVDATEDATA_SUCCESS,
    carRsvLists
  };
}

export function loadCarNumRSVDateDataError(error) {
  return {
    type: actionTypes.LOAD_CARNUMRSVDATEDATA_ERROR,
    error
  };
}
