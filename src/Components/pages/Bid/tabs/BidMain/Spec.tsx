import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { BidSpecType, BidSpecUsersType, showBidDiscussionDialogType, setBidSpecType } from '../../../../../redux/reducers/bid-reducer';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Spec.css';

type PropsType = {
    setBidSpec: setBidSpecType,
    tableName: 'specifications' | 'userStory',
    dataTable: Array<BidSpecType | BidSpecUsersType>,
    showBidDiscussionDialog: showBidDiscussionDialogType,
    available: boolean
}

const Spec: React.FC<PropsType> = (props) => {

    const DataTableHeader = <div className="p-col commandPallete">
        <Button icon="pi pi-plus" onClick={() => props.setBidSpec(props.tableName)} /> {/* добавить требование */}
    </div>;

    const textEditor = (prop: any) => (<InputTextarea disabled={!props.available} rows={5} style={{ width: window.innerWidth / 3 + 'px' }} id={prop.rowData.number} value={prop.rowData.value} onChange={(e) => {
        // @ts-ignore - error: 'id' does not exist on type 'EventTarget'
        props.setBidSpec(props.tableName, e.target.id, e.target.value, 'value')
    }} autoResize />);

    const discussionsButtons = (prop: any) => (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 'min-content' }}>
            <sup className='badge'>{prop.discussionData.count}</sup>
            <Button disabled={!props.available} icon='pi pi-comments' data-itemID={prop.number} onClick={(element) => { props.showBidDiscussionDialog(parseInt(element.currentTarget.dataset.itemid as string)) }} />
        </div>
    </div>);

    return <DataTable header={DataTableHeader} value={props.dataTable}>
        <Column field="number" header="#" body={(rowData: any) => numberTemplate(rowData, props.tableName, props.setBidSpec)} style={{ width: '5%' }} />
        <Column field="value" header={"Текст " + (props.tableName === 'specifications' ? "техзадания" : 'задания')} editor={textEditor} />
        {props.tableName === 'userStory' && <Column field="discussionData" header="#" body={discussionsButtons} style={{ width: '5%' }} />}
    </DataTable>
}

const numberTemplate = (rowData: any, tableName: 'specifications' | 'userStory', setBidSpec: setBidSpecType) => {
    if (tableName === 'specifications') {
        return <div className="numberWeightCell">
            <div>{rowData.number}</div>
            <input id={'' + rowData.number} style={{ width: "30px", textAlign: "center" }} value={rowData.weight} onChange={(e) => { setBidSpec(tableName, e.target.id, e.target.value, 'weight') }}></input>
        </div>
    } else { return <div style={{ textAlign: 'center' }}>{rowData.number}</div> }
}

export default React.memo(Spec);