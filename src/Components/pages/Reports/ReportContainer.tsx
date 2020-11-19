import React, { useLayoutEffect } from 'react';
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Switch, Route } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';
import WithReport from './withReport';
import ActualWork from './ActualWork/ActualWork';
import { ReportNameType, setDefaultValuesForReport, generateReport, setDefaultValuesForReportType, generateReportType, changeStatePropType, changeStateProp } from '../../../redux/reducers/reports-reducer';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    setDefaultValuesForReport: setDefaultValuesForReportType,
    generateReport: generateReportType,
    changeStateProp: changeStatePropType
}

type PathParamsType = {
    reportName: ReportNameType
}

type PropsType = MapPropsType & DispatchPropsType & RouteComponentProps<PathParamsType>;

const ReportContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        props.setDefaultValuesForReport(props.match.params.reportName);
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    return <WithReport generateReport={props.generateReport} reportName={props.reportName} reportResult={props.reportResult}>
        <Switch>
            <Route exact path='/reports/ActualWork'
                render={() => <ActualWork dateStart={props.dateStart} dateEnd={props.dateEnd} changeStateProp={props.changeStateProp} />} />
        </Switch>
    </WithReport>
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        ...state.Reports
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { generateReport, setDefaultValuesForReport, changeStateProp }), withRouter)(ReportContainer);