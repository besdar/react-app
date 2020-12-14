import { Button } from "@material-ui/core";
import React from "react";
import { generateReportType, ReportNameType } from "../../../redux/reducers/reports-reducer";
import './WithReport.css';

type PropsType = {
    reportName: ReportNameType,
    generateReport: generateReportType,
    reportResult: string
}

const WithReport: React.FC<PropsType> = (props) => {
    return <React.Fragment>
        <h1>{props.reportName}</h1>
        <Button className='reportGenerateButton' variant="contained" onClick={props.generateReport} >Сформировать</Button>
        <div className="reportFilters">{props.children}</div>
        {props.reportResult && <div style={{ height: window.innerHeight - 300 }}>
            <iframe title='Результат отчета' className='reportResultHTML' src={'data:text/html;charset=utf-8,' + props.reportResult}></iframe>
        </div>}
    </React.Fragment>
}

export default WithReport;