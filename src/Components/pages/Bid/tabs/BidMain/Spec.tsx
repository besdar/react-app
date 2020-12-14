import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { BidSpecType, BidSpecUsersType, showBidDiscussionDialogType, setBidSpecType, BidTableNameType, toggleBidSpecType } from '../../../../../redux/reducers/bid-reducer';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Spec.css';

export type SpecToggleType = 'add' | 'del';

type PropsType = {
    setBidSpec: setBidSpecType,
    tableName: BidTableNameType,
    dataTable: Array<BidSpecType | BidSpecUsersType>,
    showBidDiscussionDialog: showBidDiscussionDialogType,
    available: boolean,
    toggleBidSpec: toggleBidSpecType
}

const Spec: React.FC<PropsType> = (props) => {
    return <DataTable header={<DataTableHeader toggleBidSpec={props.toggleBidSpec} available={props.available} setBidSpec={props.setBidSpec} tableName={props.tableName} />} value={props.dataTable}>
        <Column className='widthFivePercent' field="number" header="#" body={(rowData: BidSpecType | BidSpecUsersType) => <ColumnNumberBodyTemplate toggleBidSpec={props.toggleBidSpec} rowData={rowData} tableName={props.tableName} setBidSpec={props.setBidSpec} />} />
        <Column field="value" header={"Текст " + (props.tableName === 'specifications' ? "техзадания" : 'задания')} body={(prop: BidSpecUsersType) => <SpecificationTextEditor available={props.available} rowData={prop} setBidSpec={props.setBidSpec} tableName={props.tableName} />} />
        {props.tableName === 'userStory' && <Column field="discussionData" header="#" body={(prop: BidSpecUsersType) => discussionsButtons(prop, props.showBidDiscussionDialog)} className='widthFivePercent' />}
    </DataTable>
}

const DataTableHeader = (props: { setBidSpec: setBidSpecType, tableName: BidTableNameType, available: boolean, toggleBidSpec: toggleBidSpecType }) => <div className="p-col commandPallete">
    <Button disabled={!props.available} icon="pi pi-plus" onClick={() => props.toggleBidSpec(props.tableName)} /> {/* добавить требование */}
</div>;

const SpecificationTextEditor = (props: { rowData: BidSpecUsersType, available: boolean, setBidSpec: setBidSpecType, tableName: BidTableNameType }) => <InputTextarea disabled={!props.available} rows={5} style={{ width: window.innerWidth / 3 + 'px' }}
    id={'' + props.rowData.number} value={props.rowData.value} onChange={(e) => props.setBidSpec(props.tableName, parseInt((e.target as HTMLTextAreaElement).id), (e.target as HTMLTextAreaElement).value, 'value')}
    autoResize />;

const discussionsButtons = (prop: BidSpecUsersType, showBidDiscussionDialog: showBidDiscussionDialogType) => <div className='discussionsButtonsOuterContainer'>
    <div className='discussionsButtonsInnerContainer'>
        <sup className='badge'>{prop.discussionData.count}</sup>
        <Button icon='pi pi-comments' data-itemID={prop.number} onClick={(element) => { showBidDiscussionDialog(parseInt(element.currentTarget.dataset.itemid as string)) }} />
    </div>
</div>;

const ColumnNumberBodyTemplate = (props: { rowData: BidSpecType | BidSpecUsersType, tableName: BidTableNameType, setBidSpec: setBidSpecType, toggleBidSpec: toggleBidSpecType }) => {
    let numberDiv = <div className='centerTextAlign'>{props.rowData.number}</div>;
    if (props.tableName === 'specifications') {numberDiv = <div>{props.rowData.number}</div>}
    numberDiv = <div className='specificationNumberCellContainer'>
        <div className='specificationNumberCell'>
            <div onClick={() => props.toggleBidSpec(props.tableName, 'add', props.rowData.number - 1)} className='toggleRowButton'>+</div>
            {numberDiv}
            <div onClick={() => props.toggleBidSpec(props.tableName, 'del', props.rowData.number - 1)} className='toggleRowButton'>-</div>
        </div>
    </div>;

    let CellContent = numberDiv;
    if (props.tableName === 'specifications') {
        CellContent = <div className="numberWeightCell">
            {numberDiv}
            <input id={'' + props.rowData.number} value={props.rowData.weight} onChange={(e) => props.setBidSpec(props.tableName, parseInt(e.target.id), e.target.value, 'weight')}></input>
        </div>
    }
    
    return CellContent;
}

export default React.memo(Spec);