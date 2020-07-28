import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function linkTemplate(el) { return <a target="_blank" href={el.link}>{el.value}</a> }
function rowExpansionTemplate(el) { return (<div className="p-grid-col">{el.childrens.map((elem, index) => (<div className="p-grid">
    <div style={{alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'}} className={"p-col-1"}>{index + 1}</div>
<div className="p-col">{elem}</div>
</div>))}</div>) }
function showAdditionalColumn() {
    let columns = [];
    if (window.innerWidth > 1030) {
        columns = [
            {field: '', header: '', expander: true},
            {field: 'number', header: 'Номер', expander: false},
            {field: 'name', header: 'Наименование', expander: false},
            {field: 'project', header: 'Проект', expander: false},
            {field: 'author', header: 'Автор', expander: false},
            {field: 'time', header: 'Продолжительность', expander: false},
            {field: 'type', header: 'Тип', expander: false},
            {field: 'basement', header: 'Основание', expander: false},
            {field: 'status', header: 'Статус', expander: false}
        ];
    }
    else { 
        columns = [
            {field: '', header: '', expander: true},
            {field: 'number', header: 'Номер', expander: false},
            {field: 'name', header: 'Наименование', expander: false},
            {field: 'project', header: 'Проект', expander: false},
            {field: 'status', header: 'Статус', expander: false}
        ];
    }
    return columns.map((el, index) => {
        if (el.expander) {return <Column key={index} expander={true} style={{width: '3em'}} />}
        else {return <Column key={index} field={el.field} header={el.header} />}
    })
}

const Additional = (props) => {
    return (<React.Fragment>
        <DiscussionChat data={props.Task.discussionData} nowReplyMessageId={props.Task.nowReplyMessageId} onResponseMessageClick={(e) => { props.setTaskProp('nowReplyMessageId', e.target.id) }} />
        <div className="p-grid-col">
            <div className="p-col">
                <DataTable value={props.Task.attachement_links}>
                    <Column header={"Вложения"} body={linkTemplate} />
                </DataTable>
            </div>
            <div className="p-col">
                <DataTable header="Связанные задачи" value={props.Task.connectedTasks} expandedRows={props.Task.expandedRows} onRowToggle={(e) => props.setTaskProp('expandedRows', e.data)}
                            rowExpansionTemplate={rowExpansionTemplate} dataKey="number">
                    {showAdditionalColumn()}
                </DataTable>
            </div>
            <div className="p-col">
                <DataTable value={props.Task.linkedPeople}>
                    <Column header={"Наблюдатели"} body={linkTemplate} />
                </DataTable>
            </div>
        </div>
    </React.Fragment>);
}

export default Additional;