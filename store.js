import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import axios from "axios";
import * as AdReducer from "./components/ad/ad-reducer";

const API_BASE_URL = "http://test.api.bydoping.net/";

const initialState = {
  formData: {},
  _formData: {},
  formState: {},
  cache: {},
  fields: {},
  formMessage: "",
  formAlert: false,
  formType: "message",
  authToken: null,
  focusedInputY: 0,
  formAnimation: false,
  loaded: false,
  inited: false,
  section: "intro"
};

export function initializeStore() {
  AdReducer.init(submitters, API_BASE_URL);
  let store = createStore(
    AdReducer.reducer,
    initialState,
    applyMiddleware(thunk)
  );

  return store;
}

const submitters = {};
