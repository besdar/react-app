import React, { useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { TaskSpecType, setTaskSpecType, commentsItemType, specificationType, setSpecificationContextType, TaskType, setTaskPropType, userItemType, toggleTaskSpecType } from '../../../../../redux/reducers/task-reducer';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './TaskSpecification.css';
import { ContextMenu } from 'primereact/contextmenu';
import { RiStopCircleLine } from 'react-icons/ri';
import { FcCancel, FcOk } from 'react-icons/fc';
import { Checkbox } from 'primereact/checkbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Dialog } from 'primereact/dialog';

type PropsType = {
    setTaskSpec: setTaskSpecType,
    Task: TaskType,
    setSpecificationContext: setSpecificationContextType,
    setTaskProp: setTaskPropType,
    toggleTaskSpec: toggleTaskSpecType,
    nowUser: userItemType
}

const Spec: React.FC<PropsType> = (props) => {
    let cm = useRef<any>(null);

    const items = [
        {
            label: 'Тестирование не проводилось',
            icon: 'pi pi-circle-off',
            command: () => { props.setTaskSpec((props.Task.specification.selectedLineNumber + 1), 'testStatus', 0) }
        },
        {
            label: 'Требуются доработки',
            icon: 'pi pi-times-circle',
            command: () => { props.setTaskSpec((props.Task.specification.selectedLineNumber + 1), 'testStatus', 2) }
        },
        {
            label: 'Успешно',
            icon: 'pi pi-check-circle',
            command: () => { props.setTaskSpec((props.Task.specification.selectedLineNumber + 1), 'testStatus', 1) }
        }
    ];

    let valueSpec: any = "";
    if (!props.Task.specification.specifications.length) { valueSpec = props.toggleTaskSpec('add') } else { valueSpec = props.Task.specification.specifications[props.Task.specification.selectedLineNumber].comments };

    return <React.Fragment>
        <ContextMenu ref={cm} model={items} />
        <Dialog modal header="Введите комментарий" visible={props.Task.specification.dialogData.visible}
            onHide={() => { props.setSpecificationContext('dialogData', { ...props.Task.specification.dialogData, visible: false }) }}
            footer={<Button label="Ok" icon="pi pi-check" onClick={() => {
                props.setTaskSpec((props.Task.specification.selectedLineNumber + 1), 'comments', [...props.Task.specification.specifications[props.Task.specification.selectedLineNumber].comments, { isActive: true, value: props.Task.specification.dialogData.newCommentText, isFrom1C: false, dateCreated: (new Date()).toJSON(), user: { id: props.nowUser.id, name: props.nowUser.name } }]);
                props.setSpecificationContext('dialogData', { visible: false, newCommentText: '' });
            }} />
            }>
            <InputTextarea autoResize value={props.Task.specification.dialogData.newCommentText} onChange={(e) => props.setSpecificationContext('dialogData', { ...props.Task.specification.dialogData, newCommentText: (e.target as HTMLTextAreaElement).value })} />
        </Dialog>
        <div className="p-grid">
            <div className='p-col-9 tableContainer'>
                <div className="p-col">
                    <DataTable scrollable scrollHeight={'400px'} value={props.Task.specification.specifications}>
                        <Column className="taskSpecificationSmallColumn" field="number" header="#" body={(rowData: TaskSpecType) => <SpecificationNumberCell toggleTaskSpec={props.toggleTaskSpec} number={rowData.number} setSpecificationContext={props.setSpecificationContext} />} />
                        <Column className="taskSpecificationSmallColumn" field="isReady" header="" body={(rowData: TaskSpecType) => checkboxIsTaskPointReady(rowData, props.setTaskSpec)} />
                        <Column field="value" header={<div className="taskDescriptionCellContainer"><span>Описание задачи</span><SpecificationHeader toggleTaskSpec={props.toggleTaskSpec} /></div>} body={(rowData: TaskSpecType) => <TextEditor number={rowData.number} value={rowData.value} setTaskSpec={props.setTaskSpec} />} />
                        <Column className="taskSpecificationMiddleColumn" field="testStatus" header="" body={(rowData: TaskSpecType) => testStatusTemplate(rowData, cm, props.setSpecificationContext)} />
                    </DataTable>
                </div>
                <div className='p-col'>
                    <label htmlFor="solving">Решение ошибки: </label>
                    <InputTextarea name='solving' value={props.Task.solving} onChange={(e) => props.setTaskProp('solving', (e.target as HTMLTextAreaElement).value)} />
                </div>
                <div className='p-col'>
                    <label htmlFor="isSaveForDatabase">Не сохранять в базе знаний: </label>
                    <Checkbox inputId='isSaveForDatabase' checked={props.Task.isSaveForDatabase} value={props.Task.isSaveForDatabase} onChange={(e) => props.setTaskProp('isSaveForDatabase', e.value)} />
                </div>
                <div className='p-col'>
                    <label htmlFor="commonComment">Комментарии общие: </label>
                    <InputTextarea name='commonComment' value={props.Task.commonComment} onChange={(e) => props.setTaskProp('commonComment', (e.target as HTMLTextAreaElement).value)} />
                </div>
            </div>
            <div className='p-col-3 tableContainer'>
                <DataTable scrollable scrollHeight={'400px'} className="p-col"
                    header={<CommentsHeader nowUser={props.nowUser} setSpecificationContext={props.setSpecificationContext} setTaskSpec={props.setTaskSpec} specification={props.Task.specification} />}
                    value={valueSpec} filters={props.Task.specification.commentFilters}>
                    <Column field="value" header={<div><span>Дата, автор</span><span>Текст</span></div>} body={(rowData: commentsItemType) => CommentLineTemplate(rowData)} />
                </DataTable>
                <div className='p-col'>
                    <label htmlFor="commentImplantation">Комментарии внедрение: </label>
                    <InputTextarea className='commentImplantation' name='commentImplantation' value={props.Task.commentImplantation} onChange={(e) => props.setTaskProp('commentImplantation', (e.target as HTMLTextAreaElement).value)} />
                </div>
            </div>
        </div>
    </React.Fragment>
}

const SpecificationNumberCell = (props: { number: number, setSpecificationContext: setSpecificationContextType, toggleTaskSpec: toggleTaskSpecType }) => <div className='specificationNumberCellContainer'>
    <div className='specificationNumberCell'>
        <div onClick={() => props.toggleTaskSpec('add', props.number - 1)} className='toggleRowButton'>+</div>
        <div onClick={() => props.setSpecificationContext('selectedLineNumber', props.number - 1)} className="specificationNumberCellNumber">{props.number}</div>
        <div onClick={() => props.toggleTaskSpec('del', props.number - 1)} className='toggleRowButton'>-</div>
    </div>
</div>

const checkboxIsTaskPointReady = (rowData: TaskSpecType, setTaskSpec: setTaskSpecType) => <div className="center_cell">
    <Checkbox value={rowData.isReady} checked={rowData.isReady != null} onChange={(elem) => { setTaskSpec(rowData.number, 'isReady', elem.checked ? new Date() : null) }} />
</div>

const SpecificationHeader = (props: { toggleTaskSpec: toggleTaskSpecType }) => <div className="p-col commandPallete">
    <Button icon="pi pi-plus" onClick={() => { props.toggleTaskSpec('add') }} /> {/* добавить требование */}
</div>;

type CommentsHeaderPropsType = {
    setTaskSpec: setTaskSpecType,
    specification: specificationType,
    setSpecificationContext: setSpecificationContextType,
    nowUser: userItemType
}

const CommentsHeader = (props: CommentsHeaderPropsType) => <div className="p-col commandPallete">
    <Button icon="pi pi-plus"
        onClick={() => props.setSpecificationContext('dialogData', { ...props.specification.dialogData, visible: true })} />
    <ToggleButton onLabel="Все комментарии" offLabel="Только актуальные" checked={JSON.stringify(props.specification.commentFilters) !== '{}'} onChange={(e) => props.setSpecificationContext('commentFilters', e.value ? { isActive: true } : { isActive: undefined })} />
</div>;

const TextEditor = (props: { value: string, setTaskSpec: setTaskSpecType, number: number }) => <InputTextarea
    rows={5} style={{ width: window.innerWidth / 3 + 'px' }} id={props.number.toString()}
    value={props.value} onChange={(e) => props.setTaskSpec(parseInt((e.target as HTMLTextAreaElement).id), 'value', (e.target as HTMLTextAreaElement).value)} autoResize />;

const CommentLineTemplate = (rowData: commentsItemType) => <div>
    <span>{new Intl.DateTimeFormat('ru', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(rowData.dateCreated)) + ', ' + rowData.user.name}</span>
    <p>{rowData.value}</p>
</div>;

const testStatusTemplate = (rowData: TaskSpecType, ref: React.MutableRefObject<any>, setSpecificationContext: setSpecificationContextType) => {
    if (rowData.testStatus === 0) {
        return <div className="testStatusCell"
            onClick={(e) => {
                setSpecificationContext('selectedLineNumber', rowData.number - 1);
                ref.current.show(e)
            }}>
            <RiStopCircleLine />
            <span>Тестирование не проводилось</span>
        </div>
    } else if (rowData.testStatus === 1) {
        return <div className="testStatusCell"
            onClick={(e) => {
                setSpecificationContext('selectedLineNumber', rowData.number - 1);
                ref.current.show(e)
            }}>
            <FcOk />
            <span>Успешно</span>
        </div>
    } else {
        return <div className="testStatusCell"
            onClick={(e) => {
                setSpecificationContext('selectedLineNumber', rowData.number - 1);
                ref.current.show(e)
            }}>
            <FcCancel />
            <span>Требуются доработки</span>
        </div>
    }
}

export default React.memo(Spec);