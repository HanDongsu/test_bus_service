export const actionTypes = {
  LOAD_CONTENTS: "LOAD_CONTENTS",
  LOAD_CONTENTS_SUCCESS: "LOAD_CONTENTS_SUCCESS",
  LOAD_CONTENTS_ERROR: "LOAD_CONTENTS_ERROR",
  LOAD_CONTENT: "LOAD_CONTENT",
  LOAD_CONTENT_SUCCESS: "LOAD_CONTENT_SUCCESS",
  LOAD_CONTENT_ERROR: "LOAD_CONTENT_ERROR"
};

export function loadContents(page, pageSize, searchKey, searchVal) {
  return {
    type: actionTypes.LOAD_CONTENTS,
    page,
    pageSize,
    searchKey,
    searchVal
  };
}

export function loadContentsSuccess(data) {
  return {
    type: actionTypes.LOAD_CONTENTS_SUCCESS,
    data
  };
}

export function loadContentsError(error) {
  return {
    type: actionTypes.LOAD_CONTENTS_ERROR,
    error
  };
}

export function loadContent(contentsId) {

  return {
    type: actionTypes.LOAD_CONTENT,
    contentsId
  };
}

export function loadContentsuccess(data) {
  return {
    type: actionTypes.LOAD_CONTENT_SUCCESS,
    data
  };
}

export function loadContentError(error) {
  return {
    type: actionTypes.LOAD_CONTENT_ERROR,
    error
  };
}
