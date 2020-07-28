import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { connectedTasksItem } from '../../../../redux/reducers/task-reducer';
import { setTaskPropType } from '../../../../redux/reducers/task-reducer';

// const rowExpansionTemplate = (el: connectedTasksItem) => {
//     return (<div className="p-grid-col">{el.childrens.map((elem, index) => (<div className="p-grid">
//         <div style={{
//             alignItems: 'center',
//             display: 'flex',
//             justifyContent: 'center'
//         }} className={"p-col-1"}>{index + 1}</div>
//         <div className="p-col">{elem}</div>
//     </div>))}</div>)
// }

const showAdditionalColumn = () => {
    let columns = [];
    if (window.innerWidth > 1030) {
        columns = [
            { field: '', header: '', expander: true },
            { field: 'number', header: 'Номер', expander: false },
            { field: 'name', header: 'Наименование', expander: false },
            { field: 'project', header: 'Проект', expander: false },
            { field: 'author', header: 'Автор', expander: false },
            { field: 'time', header: 'Продолжительность', expander: false },
            { field: 'type', header: 'Тип', expander: false },
            { field: 'basement', header: 'Основание', expander: false },
            { field: 'status', header: 'Статус', expander: false }
        ];
    }
    else {
        columns = [
            { field: '', header: '', expander: true },
            { field: 'number', header: 'Номер', expander: false },
            { field: 'name', header: 'Наименование', expander: false },
            { field: 'project', header: 'Проект', expander: false },
            { field: 'status', header: 'Статус', expander: false }
        ];
    }
    return columns.map((el, index) => {
        if (el.expander) { return <Column key={index} expander={true} style={{ width: '3em' }} /> }
        else { return <Column key={index} field={el.field} header={el.header} /> }
    })
}

type PropsType = {
    connectedTasks: Array<connectedTasksItem>,
    expandedRows: Array<any> | undefined,
    setTaskProp: setTaskPropType
}

const TaskConnected: React.FC<PropsType> = (props) => {
    return <DataTable header="Связанные заявки" value={props.connectedTasks} expandedRows={props.expandedRows} onRowToggle={(e) => props.setTaskProp('expandedRows', e.data)}
         dataKey="number">
        {showAdditionalColumn()}
    </DataTable>;
}

export default React.memo(TaskConnected);