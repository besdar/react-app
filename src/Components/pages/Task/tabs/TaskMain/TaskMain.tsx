import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import { TaskType, TaskMetadataType, setTaskPropType, pushTaskButtonType, getTaskDataType, setTaskSpecType, sourceType } from '../../../../../redux/reducers/task-reducer';
import { InputNumber } from 'primereact/inputnumber';
import { ToggleButton } from 'primereact/togglebutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type PropsType = {
    Task: TaskType,
    setTaskProp: setTaskPropType,
    TaskMetadata: TaskMetadataType,
    setTaskSpec: setTaskSpecType,
    pushTaskButton: pushTaskButtonType,
    getTaskData: getTaskDataType,
}

const SourceLink = (props: { source: sourceType, getTaskData: getTaskDataType }) => {
    let linkComponent = null;
    if (props.source.type === "Задачи") {
        linkComponent = <Link to={"/tasks/" + props.source.number}>{props.source.value}</Link>;
    } else if (props.source.type === "Заявки") {
        linkComponent = <Link to={"/bids/" + props.source.number}>{props.source.value}</Link>;
    }

    if (props.source.value && linkComponent) {
        return <div className="p-col">
            <label htmlFor="source">Основание: </label>
            {linkComponent}
        </div>
    } else { return null }
}

const TaskMain: React.FC<PropsType> = (props) => {

    return <React.Fragment>
        <div className="p-grid">
            <div className="p-col">
                <label htmlFor="name">Наименование: </label>
                <InputText type="text" id="name" value={props.Task.name} onChange={(e) => props.setTaskProp('name', (e.target as HTMLInputElement).value)} />
            </div>
            <SourceLink source={props.Task.source} getTaskData={props.getTaskData} />
        </div>
        <div className="p-grid">
            <div className="p-grid-col p-col" style={{ paddingLeft: 0 }}>
                <div className="p-col">
                    <label htmlFor="number">Номер: </label>
                    <InputText id="number" value={props.Task.number} disabled={true} />
                </div>
                <div className="p-col">
                    <label htmlFor="project">Проект: </label>
                    <Dropdown id="project" value={props.Task.project} options={props.TaskMetadata.projectSelectItems} onChange={(e) => { props.setTaskProp('project', e.target.value) }} />
                </div>
                <div className="p-col">
                    <label htmlFor="mode">Вид задачи: </label>
                    <Dropdown id="mode" value={props.Task.mode} options={props.TaskMetadata.modeSelectItems} onChange={(e) => props.setTaskProp('mode', e.target.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="type">Тип: </label>
                    <Dropdown id="type" value={props.Task.type} options={props.TaskMetadata.typeSelectItems} onChange={(e) => props.setTaskProp('type', e.target.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="date">Дата создания: </label>
                    <InputText disabled type="text" id="date" value={props.Task.date} />
                </div>
                <div className="p-col">
                    <label htmlFor="maintainer">Исполнитель: </label>
                    <Dropdown filter={true} filterMatchMode="startsWith" id="maintainer" value={props.Task.maintainer} options={props.TaskMetadata.userSelectItems} onChange={(e) => props.setTaskProp('maintainer', e.target.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="specificationWriter">Технический писатель: </label>
                    <Dropdown filter={true} filterMatchMode="startsWith" id="specificationWriter" value={props.Task.specificationWriter} options={props.TaskMetadata.userSelectItems} onChange={(e) => props.setTaskProp('specificationWriter', e.target.value)} />
                </div>
                <div className="p-col">
                    <span>Тестирование: </span>
                    <ToggleButton checked={props.Task.isNeedTest} onChange={(e) => props.setTaskProp('isNeedTest', e.value)} onLabel="Тестировать" offLabel="Не тестировать" />
                </div>
            </div>
            <div className="p-grid-col p-col" style={{ paddingRight: 0 }}>
                <div className="p-col">
                    <label htmlFor="status">Статус: </label>
                    <InputText disabled type="text" id="status" value={props.Task.status} />
                </div>
                <div className="p-col">
                    <label htmlFor="customer">Заказчик: </label>
                    <Dropdown filter={true} filterMatchMode="startsWith" id="customer" disabled={props.Task.VisibilityAvailability.unavailable.find((element) => (element === 'Заказчик')) !== undefined} value={props.Task.customer} options={props.TaskMetadata.customerSelectItems} onChange={(e) => props.setTaskProp('customer', e.target.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="priority">Приоритет: </label>
                    <Dropdown id="priority" value={props.Task.priority} options={props.TaskMetadata.prioritySelectItems} onChange={(e) => props.setTaskProp('priority', e.target.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="author">Автор: </label>
                    <InputText disabled type="text" id="author" value={props.Task.author} />
                </div>
                <div className="p-col">
                    <label htmlFor="duration">Продолжительность: </label>
                    <InputNumber type="text" id="duration" value={props.Task.duration} onChange={(e) => props.setTaskProp('duration', e.value)} />
                    <label htmlFor="duration">Трудозатраты: </label>
                    <InputNumber type="text" id="weight" value={props.Task.weight} onChange={(e) => props.setTaskProp('weight', e.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="maintainer">Архитектор: </label>
                    <Dropdown filter={true} filterMatchMode="startsWith" id="designer" value={props.Task.designer} options={props.TaskMetadata.userSelectItems} onChange={(e) => props.setTaskProp('designer', e.target.value)} />
                </div>
                <div className="p-col">
                    <label htmlFor="tester">Тестировщик: </label>
                    <Dropdown filter={true} filterMatchMode="startsWith" id="tester" value={props.Task.designer} options={props.TaskMetadata.userSelectItems} onChange={(e) => props.setTaskProp('tester', e.target.value)} />
                </div>
            </div>
        </div>
        <DataTable className="p-col" value={props.Task.linkedPeople}>
            <Column field="value" header={"Наблюдатели"} />
            <Column field="link" header={"Email"} />
        </DataTable>
    </React.Fragment >
}

export default React.memo(TaskMain);