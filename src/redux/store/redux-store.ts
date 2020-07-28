import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import ParadocsReducer from "../reducers/paradocs-reducer";
import BidsReducer from "../reducers/bids-reducer";
import BidReducer from "../reducers/bid-reducer";
import TasksReducer from "../reducers/tasks-reducer";
import TaskReducer from "../reducers/task-reducer";
import TaskboardReducer from "../reducers/taskboard-reducer";
import AuthReducer from "../reducers/auth-reducer";

let reducers = combineReducers({
    ParadocsPage: ParadocsReducer,
    BidsPage: BidsReducer,
    BidPage: BidReducer,
    // TasksPage: TasksReducer,
    TaskboardPage: TaskboardReducer,
    AuthReducer: AuthReducer,
    TasksPage: TasksReducer,
    TaskPage: TaskReducer
});

type RootReducerType = typeof reducers; // (globalstate: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType>;

export type InferActionsTypes<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never;

export type BaseThunkType<A extends Action = Action, R = Promise<void>> = ThunkAction<R, AppStateType, unknown, A>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

// @ts-ignore
window.__store__ = store;

export default store;
