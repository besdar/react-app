import React, { useRef } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";

import './Tasks.css';
import { NavLink } from 'react-router-dom';

import Header from './TasksHeader';
import Loader from '../../common/Loader/Loader';
import TreeNode from 'primereact/components/treenode/TreeNode';
import {ContextMenu} from 'primereact/contextmenu';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';

type PropsType = {
    tasksList: Array<TreeNode>,
    AllowedItems: Array<MenuItem>
}

const Tasks: React.FC<PropsType> = (props) => {

    let dt = useRef<any>(null);
    let cm = useRef<any>(null);

    if (!props.tasksList.length) { return <Loader nameOfProcess="загружаем список задач" /> }

    let cols = [];
    if (window.innerWidth > 1350) {
        cols = [
            { field: 'label', header: 'Наименование', width: ''},
            { field: 'number', header: 'Номер', width: '8%'},
            { field: 'maintainer', header: 'Исполнитель', width: ''},
            { field: 'author', header: 'Автор', width: ''},
            { field: 'customer', header: 'Заказчик', width: ''},
            { field: 'project', header: 'Проект', width: '10%'}
        ];
    }
    else {
        cols = [
            { field: 'label', header: 'Наименование', width: ''},
            { field: 'number', header: 'Номер', width: ''},
            { field: 'maintainer', header: 'Исполнитель', width: ''},
            { field: 'project', header: 'Проект', width: '10%'}
        ];
    }

    let CreateATasksTreeTable = cols.map((col) => {
        if (col.field === 'number') {
            return <Column key={col.field} style={{width: col.width}} field={col.field} header={col.header} body={(node: TreeNode) => {
                if (isNaN(node.data.number)) { return node.data.number }
                else { return <NavLink to={'/tasks/' + node.data.number}>{node.data.number}</NavLink> }
            }} />
        } else if (col.field === 'label') {return <Column expander key={col.field} field={col.field} header={col.header} />}
        else { return <Column key={col.field} style={{width: col.width}} field={col.field} header={col.header} /> }
    });

    return <React.Fragment>
        <ContextMenu model={props.AllowedItems} ref={cm}></ContextMenu>
        <Header />
        <div className={window.innerWidth > 1030 ? "p-grid" : "p-grid p-dir-col-rev"}>
            <div className="p-col">
                <TreeTable ref={dt} value={props.tasksList} autoLayout>
                    {CreateATasksTreeTable}
                </TreeTable>
            </div>
        </div>
    </React.Fragment>
}

export default Tasks;