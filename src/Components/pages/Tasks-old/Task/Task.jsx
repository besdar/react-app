import React from 'react';
import { Button } from "primereact/button";

import Spec from './Spec';
import Header from './header';

import './Task.css';
import TaskMain from './TaskMain';
import Additional from './Additional';

const Task = (props) => {

    if (!props.Task.loaded) {
        return <div style={{ width: "100%", height: window.innerHeight + 'px', display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* <ProgressSpinner /> */}
            <img src={window.location.origin + '/assets/loader.gif'}></img>
        </div>
    }

    if (props.NowMessage != '') {
        props.GrowlMetod.show({ life: 5000, severity: 'error', summary: 'Ошибка', detail: props.NowMessage });
        props.setCurrentState('NowMessage', '');
    }

    function showTab() {
        if (props.Task.nowTab == 'Main') {
            return <React.Fragment>
                <TaskMain Task={props.Task} setTaskProp={props.setTaskProp} TaskMetadata={props.TaskMetadata} pushButton={props.pushButton} />
                <div className="p-grid">
                    <Spec setTaskSpec={props.setTaskSpec} Task={props.Task} />
                </div>
            </React.Fragment>
        }
    else if (props.Task.nowTab == 'Additional') { return <Additional setTaskProp={props.setTaskProp} Task={props.Task} /> }
    }

    return (<React.Fragment>
        <Header Task={props.Task} setNewAttachement={props.setNewAttachement} pushButton={props.pushButton} />
        <div className="p-grid">
            <div className="navigationButt" >
                <Button style={{marginRight: '10px'}} icon="pi pi-palette" label="Дополнительная" onClick={() => props.setTaskProp('nowTab', 'Additional')} />
                <Button icon="pi pi-star" label="Главная" onClick={() => props.setTaskProp('nowTab', 'Main')} />
            </div>
            <div className="p-col">{showTab()}</div>
        </div>
    </React.Fragment>)
}

export default Task;