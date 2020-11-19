import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { BidSpecType, BidSpecUsersType, showBidDiscussionDialogType, setBidSpecType, BidTableNameType } from '../../../../../redux/reducers/bid-reducer';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Spec.css';

type PropsType = {
    setBidSpec: setBidSpecType,
    tableName: BidTableNameType,
    dataTable: Array<BidSpecType | BidSpecUsersType>,
    showBidDiscussionDialog: showBidDiscussionDialogType,
    available: boolean
}

const Spec: React.FC<PropsType> = (props) => {

    return <DataTable header={<DataTableHeader available={props.available} setBidSpec={props.setBidSpec} tableName={props.tableName} />} value={props.dataTable}>
        <Column field="number" header="#" body={(rowData: BidSpecType | BidSpecUsersType) => numberTemplate(rowData, props.tableName, props.setBidSpec)} style={{ width: '5%' }} />
        <Column field="value" header={"Текст " + (props.tableName === 'specifications' ? "техзадания" : 'задания')} body={(prop: BidSpecUsersType) => textEditor(prop, props.available, props.setBidSpec, props.tableName)} />
        {props.tableName === 'userStory' && <Column field="discussionData" header="#" body={(prop: BidSpecUsersType) => discussionsButtons(prop, props.showBidDiscussionDialog)} style={{ width: '5%' }} />}
    </DataTable>
}

const DataTableHeader = (props: {setBidSpec: setBidSpecType, tableName: BidTableNameType, available: boolean}) => <div className="p-col commandPallete">
    <Button disabled={!props.available} icon="pi pi-plus" onClick={() => props.setBidSpec(props.tableName)} /> {/* добавить требование */}
</div>;

const textEditor = (prop: any, available: boolean, setBidSpec: setBidSpecType, tableName: BidTableNameType) => <InputTextarea disabled={!available} rows={5} style={{ width: window.innerWidth / 3 + 'px' }}
    id={prop.rowData.number} value={prop.rowData.value} onChange={(e) => setBidSpec(tableName, (e.target as HTMLTextAreaElement).id, (e.target as HTMLTextAreaElement).value, 'value')}
    autoResize />;

const discussionsButtons = (prop: BidSpecUsersType, showBidDiscussionDialog: showBidDiscussionDialogType) => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'relative', width: 'min-content' }}>
        <sup className='badge'>{prop.discussionData.count}</sup>
        <Button icon='pi pi-comments' data-itemID={prop.number} onClick={(element) => { showBidDiscussionDialog(parseInt(element.currentTarget.dataset.itemid as string)) }} />
    </div>
</div>;

const numberTemplate = (rowData: BidSpecType | BidSpecUsersType, tableName: BidTableNameType, setBidSpec: setBidSpecType) => {
    if (tableName === 'specifications') {
        return <div className="numberWeightCell">
            <div>{rowData.number}</div>
            <input id={'' + rowData.number} style={{ width: "30px", textAlign: "center" }} value={rowData.weight} onChange={(e) => { setBidSpec(tableName, e.target.id, e.target.value, 'weight') }}></input>
        </div>
    } else { return <div style={{ textAlign: 'center' }}>{rowData.number}</div> }
}

export default React.memo(Spec);