import React from 'react';
import { Button } from "primereact/button";
import { TaskType, pushTaskButtonType } from '../../../redux/reducers/task-reducer';

type PropsType = {
    Task: TaskType,
    pushTaskButton: pushTaskButtonType
}

const Header: React.FC<PropsType> = (props) => {

    return <div className="p-grid">
    <div className="p-col">
        <h1 style={{ margin: "0px" }}>{props.Task.number === "" ? "Новая задача" : props.Task.name}</h1>
    </div>
    <div className="p-col-2 head_buttons">
        <Button style={{ display: "inline-flex" }} icon="pi pi-save" onClick={() => props.pushTaskButton('Сохранить')} />
    </div>
</div>
}

export default React.memo(Header);