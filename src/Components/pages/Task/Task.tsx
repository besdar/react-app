import React, { useRef } from 'react';
import { Growl } from 'primereact/growl';

import Header from './header';

import './Task.css';
import TaskMain from './tabs/TaskMain/TaskMain';

import Loader from '../../common/Loader/Loader';
import { TaskType, TaskMetadataType, attachementItemType, ErrorType, setNewTaskDataType, getTaskDataType, setCurrentTaskStateType, setTaskPropType, setTaskSpecType, pushTaskButtonType, setNewTaskAttachementType } from '../../../redux/reducers/task-reducer';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { TabView, TabPanel } from 'primereact/tabview';
import { FaBusinessTime } from 'react-icons/fa';
import { IoIosAttach } from 'react-icons/io';
import TaskConnected from './tabs/TaskConnected';
import { GoLink } from 'react-icons/go';

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
    setNewTaskAttachement: setNewTaskAttachementType

}

const linkTemplate = (el: attachementItemType) => (<a rel="noopener noreferrer" target="_blank" href={el.link}>{el.value}</a>)

function uploadFile(event: any, setNewTaskAttachement: (attachement: attachementItemType, attachement_link: attachementItemType) => void) {
    let reader = new FileReader();
    // @ts-ignore - cannot define types of it now
    reader.onload = (function (theFile) { return function (el) { setNewTaskAttachement({ data: el.target.result, filename: theFile.name }, { link: theFile.url, value: theFile.name }) }; })({ name: event.files[0].name, url: event.files[0].objectURL });
    reader.readAsDataURL(event.files.pop());
    // @ts-ignore - error 'object possibly be null'
    document.getElementById("file_upload").firstElementChild.lastElementChild.style.display = 'inline'; //its work of primereact, but why do they think i need it to do!??
}

const Task: React.FC<PropsType> = (props) => {

    let growl = useRef<any>(null);

    if (!props.Task.loaded) { return <Loader nameOfProcess="загружаем данные задачи" /> }

    if (props.NowMessage.detail !== '') {
        // @ts-ignore - i don't know how to define 'GrowlMetod' type
        growl.current.show(props.NowMessage);
        props.setCurrentTaskState('NowMessage', { ...props.NowMessage, detail: '' });
    }

    let attachementHeader = <React.Fragment><h3>Вложения</h3><div id="file_upload">
        <FileUpload chooseLabel='Выбрать файл' mode="basic" name="upload" maxFileSize={500000} auto={true} customUpload={true} uploadHandler={(e: any) => uploadFile(e, props.setNewTaskAttachement)} />
        <sup className="badge">{props.Task.attachement_links.length}</sup>
    </div></React.Fragment>;

    return (<div className="task">
        <Growl ref={growl} />
        <Header Task={props.Task} pushTaskButton={props.pushTaskButton} />
        <TabView>
            <TabPanel header={<React.Fragment><FaBusinessTime /><span>Основное</span></React.Fragment>}>
                <TaskMain getTaskData={props.getTaskData} Task={props.Task} setTaskSpec={props.setTaskSpec} setTaskProp={props.setTaskProp} TaskMetadata={props.TaskMetadata} pushTaskButton={props.pushTaskButton} />
            </TabPanel>
            <TabPanel header={<React.Fragment><GoLink /><span>Связанные</span></React.Fragment>}>
                <TaskConnected connectedTasks={props.Task.connectedTasks} expandedRows={props.Task.expandedRows} setTaskProp={props.setTaskProp} />
            </TabPanel>
            <TabPanel header={<React.Fragment><IoIosAttach /><span>Вложения</span></React.Fragment>}>
                <DataTable value={props.Task.attachement_links}>
                    <Column header={attachementHeader} body={linkTemplate} />
                </DataTable>
            </TabPanel>
        </TabView>
    </div>)
};

export default React.memo(Task);