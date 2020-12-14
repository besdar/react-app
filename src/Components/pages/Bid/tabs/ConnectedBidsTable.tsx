import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './ConnectedBidsTable.css';

const rowExpansionTemplate = (el: connectedBidsItem) => {

    return <div className="p-grid-col">
        {el.childrens.map((elem, index) => (<div key={index} className="p-grid">
            <div key={index} className="p-col-1 connectedRowNumber">{index + 1}</div>
            <div key={index} className="p-col">{elem}</div>
        </div>))}
    </div>
}

const AdditionalColumns = () => {
    let columns = [];
    if (window.innerWidth > 1030) {
        columns = [
            { field: '', header: '#' },
            { field: 'number', header: 'Номер' },
            { field: 'name', header: 'Наименование' },
            { field: 'project', header: 'Проект' },
            { field: 'author', header: 'Автор' },
            { field: 'time', header: 'Продолжительность' },
            { field: 'type', header: 'Тип' },
            { field: 'basement', header: 'Основание' },
            { field: 'status', header: 'Статус' }
        ];
    } else {
        columns = [
            { field: '', header: '#' },
            { field: 'number', header: 'Номер' },
            { field: 'name', header: 'Наименование' },
            { field: 'project', header: 'Проект' },
            { field: 'status', header: 'Статус' }
        ];
    };
    
    return <React.Fragment>
        {columns.map((el, index) => {
            if (!el.field) { return <Column className='connectedNumberColumn' header={el.header} key={index} expander /> }
            else { return <Column key={index} field={el.field} header={el.header} /> }
        })}
    </React.Fragment>
}

export type connectedBidsItem = {
    number: string,
    name: string,
    project: string,
    author: string,
    time: string,
    type: string,
    basement: string,
    status: string,
    childrens: Array<string>
}

type PropsType = {
    connectedBids: Array<connectedBidsItem>,
    expandedRows?: Array<any>,
    setBidProp: (expandedRows: 'expandedRows', data: Array<any>) => void
}

const BidConnected: React.FC<PropsType> = (props) => {
    return <DataTable header="Связанные заявки" value={props.connectedBids} expandedRows={props.expandedRows} onRowToggle={(e) => props.setBidProp('expandedRows', e.data)}
        rowExpansionTemplate={rowExpansionTemplate} dataKey="number">
        <AdditionalColumns />
    </DataTable>;
}

export default React.memo(BidConnected);