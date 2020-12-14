import React from 'react';
import './Tasks.css';
import TreeNode from 'primereact/components/treenode/TreeNode';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';
import Loader from '../../common/Loader/Loader';
import DynamicServerList from '../../common/DynamicList/DynamicServerList';
import { TasksAPI } from '../../../api/common-api';

// этот тестовый модуль для вызова DynamicList на базе данных Tasks

let cols = [
    { dataKey: 'Наименование', label: 'Наименование' },
    { dataKey: 'Код', label: 'Номер' }
];

type PropsType = {
    tasksList: Array<TreeNode>,
    AllowedItems: Array<MenuItem>
}

const Tasks: React.FC<PropsType> = (props) => {

    if (!props.tasksList.length) { return <Loader nameOfProcess="загружаем список задач" /> }

    let ResultRowArray = [] as Array<{ [keys: string]: string | number }>;
    props.tasksList.forEach((elem) => {
        ResultRowArray = [...ResultRowArray, ...elem.children.map((element) => element.data)];
    });

    return <DynamicServerList componentHeight={800} potion={50} fetchData={async (page: number) => {
        const result = await TasksAPI.getSomeDataList('Справочник.Задачи', ['Наименование', 'Код'], [], ['Код'], page, 50);
        if (typeof result === 'string') { alert(result); return Promise.resolve([] as Array<{ [keys: string]: string | number }>) }
        else return Promise.resolve(result);
    }} columns={cols} />
}

export default Tasks;