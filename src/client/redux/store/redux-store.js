import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import { reducer as formReducer } from 'redux-form'
import appReducer from "../reducers/app-reducer";
import ParadocsReducer from "../reducers/paradocs-reducer";
import BidsReducer from "../reducers/bids-reducer";

let reducers = combineReducers({
    ParadocsPage: ParadocsReducer,
    BidsPage: BidsReducer,
    form: formReducer,
    app: appReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));
window.__store__ = store;

export default store;
