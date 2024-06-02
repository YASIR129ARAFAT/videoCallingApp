import { combineReducers } from "redux";
import callStatusReducer from "./callStatusReducer.js";
import streamsReducer from "./streamsReducer.js";

const rootReducer = combineReducers({
    callStatus: callStatusReducer,
    streams: streamsReducer,
})

export default rootReducer