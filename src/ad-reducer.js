/*

This is the main reusable logic for whole app. Another logic file must be provided
and use this class in many ways.

*/

import AdValidation from "./ad-validation";
import AdLocal from "./ad-localization";
import { serialize } from "./ad-utils";
import axios from "axios";

export const SET_ARRAY_DATA = "core/setArrayData";
export const ADD_ARRAY_DATA = "core/addArrayData";
export const SET_VALUE = "core/setValue";
export const PUSH = "core/push";
export const REMOVE_VALUE = "core/removeValue";
export const SET_KEY_VALUE = "core/setKeyValue";
export const SET_ARRAY_ELEMENT = "core/setArrayElement";
export const SORT_ARRAY_BY_FIELD = "core/sortArrayByField";
export const SET_DEEP_KEY_VALUE = "core/setDeepKeyValue";

let submitters, API_BASE_URL;

export const init = (_submitters, apiBaseUrl) => {
  submitters = _submitters;
  API_BASE_URL = apiBaseUrl;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_VALUE:
      var newState = { ...state };
      newState[action.key] = action.value;
      return newState;
    case REMOVE_VALUE:
      var newState = { ...state };
      var arr = [];
      for (var i = 0; i < newState[action.field].length; i++) {
        if (newState[action.field][i] !== action.data) {
          arr.push(newState[action.field][i]);
        }
      }
      newState[action.field] = arr;
      return newState;
    case SET_ARRAY_DATA:
      var newState = { ...state };
      var arr = [];
      for (var k in action.data) {
        if (action.data[k] != null) {
          var item = Object.assign({}, action.data[k], {
            key: k
          });
          arr.push(item);
        }
      }
      newState[action.field] = arr;
      return newState;
    case ADD_ARRAY_DATA:
      var newState = { ...state };
      var arr = [];
      for (var k in action.data) {
        var item = Object.assign({}, action.data[k], {
          key: k
        });
        arr.push(item);
      }
      newState[action.field] = newState[action.field].concat(arr);
      return newState;
    case PUSH:
      var newState = { ...state };
      newState[action.field] = [...newState[action.field], action.data];
      return newState;
    case SET_KEY_VALUE:
      var newState = { ...state };
      newState[action.field] = Object.assign(
        {},
        newState[action.field] ? newState[action.field] : {},
        {}
      );
      newState[action.field][action.key] = action.value;
      return newState;
    case SET_DEEP_KEY_VALUE:
      var newState = { ...state };
      var newChild = newState[action.parentKey][action.childKey]
        ? { ...newState[action.parentKey][action.childKey] }
        : {};
      newChild[action.key] = action.value;
      newState[action.parentKey] = { ...newState[action.parentKey] };
      newState[action.parentKey][action.childKey] = newChild;
      return newState;
    case SET_ARRAY_ELEMENT:
      var newState = { ...state };
      var arr = [...newState[action.field]];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].key == action.key) {
          arr[i] = { ...action.value };
        }
      }
      newState[action.field] = arr;
      return newState;
    case SORT_ARRAY_BY_FIELD:
      var newState = { ...state };
      if (action.key == null) {
        if (action.isReversed) {
          newState[action.field].reverse();
        } else {
          newState[action.field].sort();
        }
      } else if (action.isReversed) {
        newState[action.field].sort(function(a, b) {
          if (a[action.key] > b[action.key]) return -1;
          else if (b[action.key] > a[action.key]) return 1;
          else return 0;
        });
      } else {
        newState[action.field].sort(function(a, b) {
          if (a[action.key] > b[action.key]) return 1;
          else if (b[action.key] > a[action.key]) return -1;
          else return 0;
        });
      }
      return newState;
    default:
      return state;
  }
};

// ACTIONS
export function sortArrayByField(field, key, isReversed = false) {
  return {
    type: SORT_ARRAY_BY_FIELD,
    field: field,
    key: key,
    isReversed: isReversed
  };
}

export function setArrayElement(field, key, value) {
  return {
    type: SET_ARRAY_ELEMENT,
    field: field,
    key: key,
    value: value
  };
}

export function setArrayData(field, data) {
  return {
    type: SET_ARRAY_DATA,
    field: field,
    data: data
  };
}

export function addArrayData(field, data) {
  return {
    type: ADD_ARRAY_DATA,
    field: field,
    data: data
  };
}

export function setValue(key, value) {
  return {
    type: SET_VALUE,
    key: key,
    value: value
  };
}

export function push(field, data) {
  return {
    type: PUSH,
    field: field,
    data: data
  };
}

export function removeValue(field, data) {
  return {
    type: REMOVE_VALUE,
    field: field,
    data: data
  };
}

export function setKeyValue(field, key, value) {
  return {
    type: SET_KEY_VALUE,
    field: field,
    key: key,
    value: value
  };
}

export function setDeepKeyValue(parent, child, key, value) {
  return {
    type: SET_DEEP_KEY_VALUE,
    parentKey: parent,
    childKey: child,
    key: key,
    value: value
  };
}

export const nullAction = () => {
  return function(dispatch) {};
};

export const simpleAction = realAction => {
  return function(dispatch) {
    realAction(dispatch);
  };
};
/* Asyn */

export const formSubmit = (formName, fields, navigate) => {
  return function(dispatch, getState) {
    let st = getState();

    if (st.fields.validation) {
      for (let k in fields) {
        if (st.fields.validation[k] && st.fields.validation[k] !== true) {
          dispatchError(
            dispatch,
            AdValidation.buildValidationString(st.fields.validation[k])
          );
          return;
        }
      }
    }

    let fieldsParsed = {};
    for (let k in fields) {
      fieldsParsed[k.split(".")[1]] = fields[k];
    }

    dispatch(setKeyValue("formState", formName, "loading"));
    dispatch(submitters[formName](fieldsParsed, navigate));

    // setTimeout(function() {
    //   for (let k in fields) {
    //     dispatch(setKeyValue("fields", k, ""));
    //   }
    // }, 5000);
  };
};

export const directSubmit = (formName, fields = {}) => {
  return function(dispatch, getState) {
    dispatch(setKeyValue("formState", formName, "loading"));
    dispatch(submitters[formName](fields));
  };
};

export const finalizeSubmit = formName => {
  return function(dispatch) {
    dispatch(setKeyValue("formState", formName, "ready"));
  };
};

export const fetchList = (
  formName,
  path,
  args,
  map,
  filter = null,
  responsePath = ""
) => {
  return function(dispatch, getState) {
    getApi(
      path,
      args,
      dispatch,
      function(response) {
        let mappedData = mapFetchData(response.data, map, filter, responsePath);

        dispatch(setKeyValue("formData", formName, mappedData));
        dispatch(setKeyValue("_formData", formName, mappedData));

        dispatch(finalizeSubmit(formName));
      },
      getState().authToken
    );
  };
};

export const fetchItem = (
  formName,
  path,
  key,
  map,
  filter = null,
  responsePath = ""
) => {
  return function(dispatch, getState) {
    getApi(
      path,
      key ? { id: key } : {},
      dispatch,
      response => {
        let mappedData = mapFetchData(response.data, map, filter, responsePath);

        for (let k in mappedData) {
          dispatch(setKeyValue("fields", formName + "." + k, mappedData[k]));
        }

        dispatch(finalizeSubmit(formName));
      },
      getState().authToken
    );
  };
};

const getDataFromPath = (data, responsePath) => {
  let pathParts = responsePath.split("/");
  for (let i = 0; i < pathParts.length; i++) {
    data = data[pathParts[i]];
  }
  return data;
};

const mapFetchData = (inData, map, filter, responsePath) => {
  let data;

  if (responsePath !== "") {
    data = getDataFromPath(inData, responsePath);
  } else {
    data = inData;
  }

  let mappedData;
  if (data.constructor === Array) {
    mappedData = [];
    let length = data.length;

    for (let i = 0; i < length; i++) {
      let a = data[i];
      let nA = {};
      for (let k in map) {
        nA[k] = getDataFromPath(a, map[k]);
      }

      mappedData.push(nA);
    }
  } else {
    mappedData = {};

    for (let k in map) {
      mappedData[k] = getDataFromPath(data, map[k]);
    }
  }

  if (filter) mappedData = filter(mappedData);

  return mappedData;
};

export const update = (path, args, onSuccess = null) => {
  return function(dispatch, getState) {
    if (onSuccess) onSuccess("ok", dispatch);
    // postApi(
    //   path,
    //   args,
    //   dispatch,
    //   function(response) {
    //     parseApiResponse(response, onSuccess, dispatch);
    //   },
    //   getState().authToken
    // );
  };
};

export const parseApiResponse = (response, callback, dispatch) => {
  if (response.data.isSuccess === false) {
    dispatchError(dispatch, response.data.message);
  } else {
    if (callback) callback(response);
  }
};

export const getApi = (path, data, dispatch, callback, auth = false) => {
  let headers = {
    "Accept-Language": AdLocal.lang
  };

  if (auth !== false) {
    headers["Authorization"] = auth;
  }

  axios({
    method: "get",
    url: API_BASE_URL + path + "?" + serialize(data),
    headers: headers
  })
    .then(function(response) {
      parseApiResponse(response, callback, dispatch);
    })
    .catch(function(error) {
      console.error(error);
      dispatchError(dispatch, "Internet bağlantısında bir sorun oluştu");
    });
};

export const postApi = (path, data, dispatch, callback, auth = false) => {
  let headers = {
    "Content-Type": "application/json",
    "Accept-Language": AdLocal.lang
  };

  if (auth !== false) {
    headers["Authorization"] = auth;
  }

  axios({
    method: "post",
    url: API_BASE_URL + path,
    data: data,
    headers: headers
  })
    .then(function(response) {
      parseApiResponse(response, callback, dispatch);
    })
    .catch(function(error) {
      console.error(error);
      dispatchError(dispatch, "Internet bağlantısında bir sorun oluştu");
    });
};

export const dispatchError = (dispatch, errorMessage) => {
  dispatch(setValue("formAlert", true));
  dispatch(setValue("formMessage", errorMessage));
  dispatch(setValue("formType", "error"));
};

/* Filters */

export const multiFieldTextFilter = (formName, q, keys) => {
  return function(dispatch, getState) {
    if (q === "" && typeof formName === "string") {
      dispatch(
        setKeyValue("formData", formName, getState()._formData[formName])
      );
      return;
    }

    let rexInitial = new RegExp("^" + q + ".*", "ui");
    let rex = new RegExp(q + ".*", "ui");
    let keysL = keys.length;

    let filteredData =
      typeof formName === "string" ? getState()._formData[formName] : formName;

    filteredData = filteredData.filter(v => {
      for (let i = 0; i < keysL; i++) {
        let k = Object.keys(keys[i])[0];
        if (
          (keys[i][k].initial && rexInitial.exec(v[k])) ||
          (keys[i][k].initial === false && rex.exec(v[k]))
        ) {
          return true;
        }
      }
      return false;
    });

    if (typeof formName === "string") {
      dispatch(setKeyValue("formData", formName, filteredData));
    } else {
      return filteredData;
    }
  };
};
