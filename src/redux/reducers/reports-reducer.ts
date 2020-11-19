import { ReportsAPI } from "../../api/reports-api";
import { BaseThunkType, InferActionsTypes, ReturnObjectValuesType } from '../store/redux-store';
import { FormAction } from 'redux-form/lib/actions';

const initialState = {
    reportName: 'ActualWork' as ReportNameType,
    reportResult: '',
    dateStart: new Date(),
    dateEnd: new Date((new Date()).getTime() + 86400000)
};

export type ReportNameType = 'ActualWork';
type ReportInitialStateKeysType = keyof ReportInitialStateType;

const reportsReducer = (state = initialState, action: ActionsType): ReportInitialStateType => {
    switch (action.type) {
        case 'INIT_STATE':
            return {
                ...action.newState
            }
        case 'SET_REPORT_RESULT':
            return {
                ...state,
                reportResult: action.reportResult
            }
        case 'SET_STATE_PROP':
            return {
                ...state,
                [action.key]: action.value
            }
        default:
            return state;
    }
}

const actions = {
    initializeState: (newState: ReportInitialStateType) => ({ type: 'INIT_STATE', newState: newState } as const),
    setResult: (reportResult: string) => ({ type: 'SET_REPORT_RESULT', reportResult: reportResult } as const),
    setStateProp: (key: ReportInitialStateKeysType, value: ReturnObjectValuesType<ReportInitialStateType>) => ({ type: 'SET_STATE_PROP', key: key, value: value } as const),
}

export const setDefaultValuesForReport = (reportName: ReportNameType): ThunkType => async (dispatch, getState) => {
    //const nowState = getState().Reports;
    if (reportName === 'ActualWork') {
        dispatch(actions.setStateProp('reportName', reportName));
    } // else if () {}
}

export const generateReport = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().Reports;
    const response = await ReportsAPI.getReport({ ...nowState, reportName: nowState.reportName });
    if (typeof response === 'string') {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { window.location.href = 'login' }
        else { alert(response) }
    } else {
        dispatch(actions.setResult(response.reportResult));
    }
}

export const changeStateProp = (key: ReportInitialStateKeysType, value: ReturnObjectValuesType<ReportInitialStateType>): ThunkType => async (dispatch) => {dispatch(actions.setStateProp(key, value))}

export default reportsReducer;

export type ReportInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

// thunk types //
export type setDefaultValuesForReportType = typeof setDefaultValuesForReport;
export type generateReportType = typeof generateReport;
export type changeStatePropType = typeof changeStateProp;
