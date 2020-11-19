import { Button } from "@material-ui/core";
import React from "react";
import { generateReportType, ReportNameType } from "../../../redux/reducers/reports-reducer";

type PropsType = {
    reportName: ReportNameType,
    generateReport: generateReportType,
    reportResult: string
}

const WithReport: React.FC<PropsType> = (props) => {
    return <React.Fragment>
        <h1>{props.reportName}</h1>
        <Button style={{marginBottom: 20}} variant="contained" onClick={props.generateReport} >Сформировать</Button>
        <div style={{marginBottom: 20}} className="reportFilters">{props.children}</div>
        {props.reportResult && <div style={{ height: window.innerHeight - 300 }} dangerouslySetInnerHTML={{__html: '<iframe style="width: 100%; height: 100%; border: none" src="data:text/html;charset=utf-8,' + props.reportResult + '"></iframe>'}}></div>}
    </React.Fragment>
}

export default WithReport;