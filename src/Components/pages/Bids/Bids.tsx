import React, { useRef } from 'react';
import { TreeTable } from 'primereact/treetable';
// import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from "primereact/column";

import DiscussionChat from "../../libriary/DiscussionChat/DiscussionChat";

import './Bids.css';
import { NavLink } from 'react-router-dom';

import Header from './BidsHeader';
import Loader from '../../common/Loader/Loader';
import TreeNode from 'primereact/components/treenode/TreeNode';
import { projectSelectType, projectSelectTypeValue, sendBidsReplyType, setBidsCurrentStateType } from "../../../redux/reducers/bids-reducer";
import { MultiSelect } from 'primereact/multiselect';

type PropsType = {
    bidsList: Array<TreeNode>,
    styleDisplayOfMessages: "none" | "flex",
    sendBidsReply: sendBidsReplyType,
    setBidsCurrentState: setBidsCurrentStateType,
    messagesList: Array<TreeNode>,
    projectSelectItems: Array<projectSelectType>,
    selectedProjectSelectItems: Array<projectSelectTypeValue>
}

const filterProject = (value: Array<projectSelectTypeValue>, setBidsCurrentState: setBidsCurrentStateType, dt: React.MutableRefObject<any>) => {
    let filterArray = [] as Array<string>;
    value.forEach((el: projectSelectTypeValue) => { filterArray = filterArray.concat(el.filterArray) });
    dt.current.filter(filterArray, 'projectUID', 'in');
    setBidsCurrentState('selectedProjectSelectItems', value);
}

const getBidsCols = (styleDisplayOfMessages: "none" | "flex") => {
    let cols = [];
    if (styleDisplayOfMessages === "none" && window.innerWidth > 1350) {
        cols = [
            { field: 'number', header: 'Номер', expander: true },
            { field: 'label', header: 'Наименование', expander: false },
            { field: 'status', header: 'Статус', expander: false },
            { field: 'time', header: 'Продолжительность', expander: false },
            { field: 'type', header: 'Тип', expander: false },
            { field: 'customer', header: 'Заказчик', expander: false },
            { field: 'priority', header: 'Приоритет', expander: false },
            { field: 'project', header: 'Проект', expander: false },
            { field: 'projectUID', header: 'projectUID', expander: false }
        ];
    }
    else {
        cols = [
            { field: 'number', header: 'Номер', expander: true },
            { field: 'label', header: 'Наименование', expander: false },
            { field: 'type', header: 'Тип', expander: false },
            { field: 'project', header: 'Проект', expander: false },
            { field: 'projectUID', header: 'projectUID', expander: false }
        ];
    }

    return cols.map((col) => {
        if (col.field === 'number') {
            return <Column key={col.field} field={col.field} expander={col.expander} header={col.header} body={(node: TreeNode) => {
                if (isNaN(node.data.number)) { return node.data.number + '(' + node.children.length + ')' }
                else { return <NavLink className='bidsColumnLinkToBid' to={'/bids/' + node.data.number}>{node.data.number}</NavLink> }
            }} />
        }
        else { return <Column key={col.field} className={col.field === 'projectUID' ? 'bidsColumnProject' : ''} field={col.field} expander={col.expander} header={col.header} /> }
    });
}

//"id,number,label,status,time,type,customer,priority,project"
function messageTemplate(node: TreeNode, sendBidsReply: sendBidsReplyType) {
    if (node.data.is_it_child) {
        return <DiscussionChat
            showAllMessagesButton={false}
            maxHeight={'250px'}
            sendReply={sendBidsReply}
            data={node.data} />
    }
    else {
        return <React.Fragment>
            <div className="p-grid">
                <div className="p-col">
                    <a className="bidsDiscussionMessageTitle" href={'/bids/' + node.data.number + '?openTab=Discussion'}>{node.data.number + ' ' + node.data.label}</a>
                </div>
            </div>
            {JSON.stringify(node.data.parent) !== "{}" && <div className="bidsParentMessageContainer">
                <div className="p-grid">
                    <div className="p-col">
                        {node.data.parent.message}
                    </div>
                </div>
                <div className="p-grid">
                    <div className="p-col-4">
                        <b>{node.data.parent.date}</b>
                    </div>
                    <div className="p-col">
                        <b>{node.data.parent.author}</b>
                    </div>
                </div>
            </div>}
            <div className="p-grid">
                <div className="p-col">
                    {node.data.message}
                </div>
            </div>
            <div className="p-grid">
                <div className="p-col-4">
                    <b>{node.data.date}</b>
                </div>
                <div className="p-col">
                    <b>{node.data.author}</b>
                </div>
            </div>
        </React.Fragment>
    }
}

const Bids: React.FC<PropsType> = (props) => {

    let dt = useRef<any>(null);

    if (!props.bidsList.length) { return <Loader nameOfProcess="загружаем список сделок" /> }

    return <React.Fragment>
        <Header
            setBidsCurrentState={props.setBidsCurrentState}
            styleDisplayOfMessages={props.styleDisplayOfMessages}
            messagesList={props.messagesList} />
        <MultiSelect className="bidsProjectSelect" placeholder="Проекты" value={props.selectedProjectSelectItems} options={props.projectSelectItems} onChange={(e) => filterProject(e.value, props.setBidsCurrentState, dt)} />
        <div className={window.innerWidth > 1030 ? "p-grid" : "p-grid p-dir-col-rev"}>
            <div className="p-col">
                <TreeTable ref={dt} value={props.bidsList} autoLayout>
                    {getBidsCols(props.styleDisplayOfMessages)}
                </TreeTable>
            </div>
            <div className="p-col" style={{ display: props.styleDisplayOfMessages }}>
                <TreeTable value={props.messagesList} autoLayout >
                    {/* в теории тут в вэлью можно запихнуть стили (цвет например) и применять для каждой строки совй стиль 
                            (например красить в цвет проекта строку) */}
                    <Column className="bidsExpanderColumn" expander></Column>
                    <Column field="id" body={(node: TreeNode) => messageTemplate(node, props.sendBidsReply)} header="Обсуждения" ></Column>
                </TreeTable>
            </div>
        </div>
    </React.Fragment>
}

export default Bids;