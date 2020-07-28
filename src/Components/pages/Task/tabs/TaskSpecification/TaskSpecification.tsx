import React, { useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { TaskSpecType, setTaskSpecType } from '../../../../../redux/reducers/task-reducer';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Spec.css';
import { ContextMenu } from 'primereact/contextmenu';

type PropsType = {
    setTaskSpec: setTaskSpecType,
    tableName: 'specifications' | 'userStory',
    dataTable: Array<TaskSpecType>,
    available: boolean
}

const Spec: React.FC<PropsType> = (props) => {
    let cm = useRef<any>(null);

    const DataTableHeader = <div className="p-col commandPallete">
        <Button icon="pi pi-plus" onClick={() => props.setTaskSpec(props.tableName)} /> {/* добавить требование */}
    </div>;

    const textEditor = (prop: any) => (<InputTextarea disabled={!props.available} rows={5} style={{ width: window.innerWidth / 3 + 'px' }} id={prop.rowData.number} value={prop.rowData.value} onChange={(e) => {
        // @ts-ignore - error: 'id' does not exist on type 'EventTarget'
        props.setTaskSpec(props.tableName, e.target.id, e.target.value, 'value')
    }} autoResize />);

    return <React.Fragment>
        {/* <ContextMenu ref={cm} model={}></ContextMenu> */}
        <DataTable header={DataTableHeader} value={props.dataTable}>
            <Column field="number" header="#" style={{ width: '5%' }} />
            <Column field="isReady" header="" style={{ width: '5%' }} />
            <Column field="value" header="Описание задачи" editor={textEditor} />
            <Column field="testStatus" header="" style={{ width: '20%' }} />
        </DataTable>
    </React.Fragment>
}

const testStatusTemplate = (rowData: any, setTaskSpec: setTaskSpecType, ref: React.MutableRefObject<any>) => {
    if (rowData.status === null) {return <div><span>Тестирование не проводилось</span></div>}
    else if (rowData.status) {return <div><span>Требуются доработки</span></div>}
    else {return <div><span>Успешно</span></div>}
}

export default React.memo(Spec);