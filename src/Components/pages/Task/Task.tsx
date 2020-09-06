import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

import Header from './header';

import './Task.css';
import TaskMain from './tabs/TaskMain/TaskMain';

import Loader from '../../common/Loader/Loader';
import { TaskType, TaskMetadataType, attachementItemType, ErrorType, setNewTaskDataType, getTaskDataType, setCurrentTaskStateType, setTaskPropType, setTaskSpecType, pushTaskButtonType, setNewTaskAttachementType, setSpecificationContextType } from '../../../redux/reducers/task-reducer';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { TabView, TabPanel } from 'primereact/tabview';
import { FaBusinessTime } from 'react-icons/fa';
import { IoIosAttach } from 'react-icons/io';
import { GoLink } from 'react-icons/go';
import TaskSpecification from './tabs/TaskSpecification/TaskSpecification';

type PropsType = {
    Task: TaskType,
    NowMessage: ErrorType,
    TaskMetadata: TaskMetadataType,
    setNewTaskData: setNewTaskDataType,
    getTaskData: getTaskDataType,
    setCurrentTaskState: setCurrentTaskStateType,
    setTaskProp: setTaskPropType,
    setTaskSpec: setTaskSpecType,
    pushTaskButton: pushTaskButtonType,
    setNewTaskAttachement: setNewTaskAttachementType,
    setSpecificationContext: setSpecificationContextType
}

const linkTemplate = (el: attachementItemType) => (<a rel="noopener noreferrer" target="_blank" href={el.link}>{el.value}</a>)

const uploadFile = (event: any, setNewTaskAttachement: setNewTaskAttachementType) => {
    let reader = new FileReader();
    // @ts-ignore - cannot define types of it now
    reader.onload = (function (theFile) { return function (el) { setNewTaskAttachement({ data: el.target.result, filename: theFile.name }, { link: theFile.url, value: theFile.name }) }; })({ name: event.files[0].name, url: event.files[0].objectURL });
    reader.readAsDataURL(event.files.pop());
    // @ts-ignore - error 'object possibly be null'
    document.getElementById("file_upload").firstElementChild.lastElementChild.style.display = 'inline'; //its work of primereact, but why do they think i need it to do!??
}

const attachementColumnLinkTemplateHeader = (lenghtOfAttachementLinks: number, setNewTaskAttachement: setNewTaskAttachementType) => (<div id="file_upload">
        <FileUpload chooseLabel='Выбрать файл' mode="basic" name="upload" maxFileSize={500000} auto={true} customUpload={true} uploadHandler={(e: any) => uploadFile(e, setNewTaskAttachement)} />
        <sup className="badge">{lenghtOfAttachementLinks}</sup>
    </div>);

const ConnectedColumns = () => {
    let columns = [];
    if (window.innerWidth > 1030) {
        columns = [
            { field: '', header: '#' },
            { field: 'number', header: 'Номер' },
            { field: 'name', header: 'Наименование' },
            { field: 'project', header: 'Проект' },
            { field: 'author', header: 'Автор' },
            { field: 'time', header: 'Продолжительность' },
            { field: 'type', header: 'Тип' },
            { field: 'basement', header: 'Основание' },
            { field: 'status', header: 'Статус' }
        ];
    }
    else {
        columns = [
            { field: '', header: '#' },
            { field: 'number', header: 'Номер' },
            { field: 'name', header: 'Наименование' },
            { field: 'project', header: 'Проект' },
            { field: 'status', header: 'Статус' }
        ];
    }
    return columns.map((el, index) => {
            if (el.field === '') { return <Column header={el.header} key={index} expander={true} style={{ width: '3em' }} /> }
            else { return <Column key={index} field={el.field} header={el.header} /> }
        });
}

const Task: React.FC<PropsType> = (props) => {

    let toast = useRef<any>(null);

    if (!props.Task.loaded) { return <Loader nameOfProcess="загружаем данные задачи" /> }

    if (props.NowMessage.detail !== '') {
        toast.current.show(props.NowMessage);
        props.setCurrentTaskState('NowMessage', { ...props.NowMessage, detail: '' });
    }

    return (<div className="task">
        <Toast ref={toast} />
        <Header Task={props.Task} pushTaskButton={props.pushTaskButton} />
        <TabView>
            <TabPanel header={<React.Fragment><FaBusinessTime /><span>Основное</span></React.Fragment>}>
                <TaskMain getTaskData={props.getTaskData} Task={props.Task} setTaskSpec={props.setTaskSpec} setTaskProp={props.setTaskProp} TaskMetadata={props.TaskMetadata} pushTaskButton={props.pushTaskButton} />
            </TabPanel>
            <TabPanel header={<React.Fragment><GoLink /><span>Связанные</span></React.Fragment>}>
                <DataTable header="Связанные заявки" value={props.Task.connectedTasks} expandedRows={props.Task.expandedRows} onRowToggle={(e) => props.setTaskProp('expandedRows', e.data)}
                    dataKey="number">
                    {ConnectedColumns()}
                </DataTable>
            </TabPanel>
            <TabPanel header={<React.Fragment><IoIosAttach /><span>Вложения</span></React.Fragment>}>
                <DataTable value={props.Task.attachement_links} header={attachementColumnLinkTemplateHeader(props.Task.attachement_links.length, props.setNewTaskAttachement)}>
                    <Column header="Вложения" body={linkTemplate} />
                </DataTable>
            </TabPanel>
            <TabPanel header={<React.Fragment><IoIosAttach /><span>Техзадание</span></React.Fragment>}>
                <TaskSpecification nowUser={props.TaskMetadata.nowUser} setTaskProp={props.setTaskProp} setSpecificationContext={props.setSpecificationContext} available={true} Task={props.Task} setTaskSpec={props.setTaskSpec} />
            </TabPanel>
        </TabView>
    </div>)
};

export default React.memo(Task);