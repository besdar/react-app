import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { ToggleButton } from 'primereact/togglebutton';
import { InputTextarea } from 'primereact/inputtextarea';

const TaskMain = (props) => {

    function getSolving() {
        if (props.Task.VisibilityAvailability.invisible.find((element) => (element == "Основание")) != undefined) { return <div></div> }
        else {
            let readOnly = (props.Task.VisibilityAvailability.unavailable.find((element) => (element == "Основание")) != undefined);
            return <InputTextarea readOnly={readOnly} value={props.Task.solving} onChange={(e) => props.setTaskProp('solving', e.target.value)} autoResize />
        }
    }

    return(<div className="p-grid">
    <div className="p-col">
        <div className="p-grid-col">
            <div className="p-col">
                <label htmlFor="name">Наименование: </label>
                <InputText type="text" id="name" value={props.Task.name} onChange={(e) => props.setTaskProp('name', e.target.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="author">Заказчик: </label>
                <InputText type="text" id="author" value={props.Task.author} readOnly />
            </div>
            <div className="p-col">
                <label htmlFor="duration">Продолжительность: </label>
                <InputText type="text" id="duration" value={props.Task.duration} onChange={(e) => props.setTaskProp('duration', e.target.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="status">Статус: </label>
                <Dropdown type="text" type="status" id="status" value={props.Task.status} options={props.TaskMetadata.statusSelectItems} onChange={(e) => props.setTaskProp('status', e.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="source">Основание: </label>
                <Link to={"/tasks/" + props.Task.source.number}>{props.Task.source.value}</Link>
            </div>
        </div>
    </div>
    <div className="p-col">
        <div className="p-grid-col">
            <div className="p-col">
                <label htmlFor="project">Проект: </label>
                <Dropdown type="text" id="project" value={props.Task.project} options={props.TaskMetadata.projectSelectItems} onChange={(e) => props.setTaskProp('project', e.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="priority">Приоритет: </label>
                <Dropdown type="text" id="priority" value={props.Task.priority} options={props.TaskMetadata.prioritySelectItems} onChange={(e) => props.setTaskProp('priority', e.target.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="type">Тип: </label>
                <Dropdown type="text" id="type" value={props.Task.type} options={props.TaskMetadata.typeSelectItems} onChange={(e) => props.setTaskProp('type', e.target.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="mode">Вид задачи: </label>
                <Dropdown type="text" id="mode" value={props.Task.mode} options={props.TaskMetadata.modeSelectItems} onChange={(e) => props.setTaskProp('mode', e.target.value)} />
            </div>
            <div className="p-col">
                <label htmlFor="analisysStatus">Статус анализа: </label>
                <Dropdown type="text" id="analisysStatus" value={props.Task.analisysStatus} options={props.TaskMetadata.statusSelectItems} onChange={(e) => props.setTaskProp('analisysStatus', e.target.value)} />
            </div>
        </div>
    </div>
    <div className="p-col">
        <div className="p-grid-col">
            <div className="p-col">
                <ToggleButton checked={props.Task.paid_off} onChange={(e) => props.setTaskProp('paid_off', e.value)} onLabel="Рассчитались" offLabel="Не рассчитались" />
            </div>
            <div className="p-col">
                <Button className="status_buttons" label="Запрос на утверждение" icon="pi pi-check" onClick={() => props.pushButton('ЗапросНаУтверждение')} />
                <Button className="status_buttons" label="Утверждено" icon="pi pi-check" onClick={() => props.pushButton('Утверждено')} />
                <Button className="status_buttons" label="Принято" icon="pi pi-star" onClick={() => props.pushButton('ПринятьЗаказчиком')} />
            </div>
            {getSolving()}
        </div>
    </div>
</div>)
}

export default TaskMain;