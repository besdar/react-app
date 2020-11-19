import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

import Header from './header';

import './Task.css';
import TaskMain from './tabs/TaskMain/TaskMain';

import Loader from '../../common/Loader/Loader';
import { TaskType, TaskMetadataType, ErrorType, setNewTaskDataType, getTaskDataType, setCurrentTaskStateType, setTaskPropType, setTaskSpecType, pushTaskButtonType, setNewTaskAttachementType, setSpecificationContextType } from '../../../redux/reducers/task-reducer';

import { TabView, TabPanel } from 'primereact/tabview';
import { FaBusinessTime, FaComments } from 'react-icons/fa';
import { IoIosAttach } from 'react-icons/io';
import { GoLink } from 'react-icons/go';
import TaskSpecification from './tabs/TaskSpecification/TaskSpecification';
import AttachementTable from '../../libriary/AttachementTable/AttachementTable';
import DiscussionChat from '../../libriary/DiscussionChat/DiscussionChat';
import { sendBidReplyType } from '../../../redux/reducers/bid-reducer';
import ConnectedBidsTable from '../Bid/tabs/ConnectedBidsTable';

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
    setSpecificationContext: setSpecificationContextType,
    sendBidReply: sendBidReplyType
}

const Task: React.FC<PropsType> = (props) => {

    let toast = useRef<any>(null);

    if (!props.Task.loaded) { return <Loader nameOfProcess="загружаем данные задачи" /> }

    if (props.NowMessage.detail) {
        toast.current.show(props.NowMessage);
        props.setCurrentTaskState('NowMessage', { ...props.NowMessage, detail: '' });
    }

    const DiscussionTabs = [
        <TabPanel key={1} header={<React.Fragment><FaBusinessTime /><span>Основное</span></React.Fragment>}>
            <TaskMain getTaskData={props.getTaskData} Task={props.Task} setTaskSpec={props.setTaskSpec} setTaskProp={props.setTaskProp} TaskMetadata={props.TaskMetadata} pushTaskButton={props.pushTaskButton} />
        </TabPanel>,
        <TabPanel key={2} header={<React.Fragment><GoLink /><span>Связанные</span></React.Fragment>}>
            <ConnectedBidsTable expandedRows={props.Task.expandedRows} setBidProp={props.setTaskProp} connectedBids={props.Task.connectedTasks} />
        </TabPanel>,
        <TabPanel key={3} header={<React.Fragment><IoIosAttach /><span>Вложения</span></React.Fragment>}>
            <AttachementTable attachement_links={props.Task.attachement_links} setNewAttachement={props.setNewTaskAttachement} />
        </TabPanel>,
        <TabPanel key={4} header={<React.Fragment><IoIosAttach /><span>Техзадание</span></React.Fragment>}>
            <TaskSpecification
                nowUser={props.TaskMetadata.nowUser}
                setTaskProp={props.setTaskProp}
                setSpecificationContext={props.setSpecificationContext}
                Task={props.Task}
                setTaskSpec={props.setTaskSpec} />
        </TabPanel>
    ];
    if (props.Task.source.type === 'Заявки') {
        DiscussionTabs.push(<TabPanel key={5} header={<React.Fragment><FaComments /><span>Обсуждения</span></React.Fragment>}>
            <DiscussionChat data={props.Task.discussionData} showAllMessagesButton={true} sendReply={props.sendBidReply} />
        </TabPanel>);
    }

    return (<div className="task">
        <Toast ref={toast} />
        <Header Task={props.Task} pushTaskButton={props.pushTaskButton} />
        <TabView activeIndex={!props.Task.number ? 0 : 3}>
            {DiscussionTabs}
        </TabView>
    </div>)
};

export default React.memo(Task);