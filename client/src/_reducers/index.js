import { combineReducers } from "redux";
import user from './user_reducer';

const rootReducer = combineReducers({//reducer 를 하나로 합쳐주는 작업
    user
})

export default rootReducer;