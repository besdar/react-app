import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { connectedBidsItem, sendBidReplyType } from '../../../../redux/reducers/bid-reducer';
import { setBidPropType } from '../../../../redux/reducers/bid-reducer';

const rowExpansionTemplate = (el: connectedBidsItem) => {
    return (<div className="p-grid-col">{el.childrens.map((elem, index) => (<div className="p-grid">
        <div style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
        }} className={"p-col-1"}>{index + 1}</div>
        <div className="p-col">{elem}</div>
    </div>))}</div>)
}

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
    connectedBids: Array<connectedBidsItem>,
    expandedRows: Array<any> | undefined,
    setBidProp: setBidPropType,
    sendBidReply: sendBidReplyType
}

const BidConnected: React.FC<PropsType> = (props) => {
    return <DataTable header="Связанные заявки" value={props.connectedBids} expandedRows={props.expandedRows} onRowToggle={(e) => props.setBidProp('expandedRows', e.data)}
        rowExpansionTemplate={rowExpansionTemplate} dataKey="number">
        {showAdditionalColumn()}
    </DataTable>;
}

export default React.memo(BidConnected);