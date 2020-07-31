import React, { useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { TaskSpecType, setTaskSpecType, commentsItemType, specificationType, setSpecificationContextType } from '../../../../../redux/reducers/task-reducer';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './TaskSpecification.css';
import { ContextMenu } from 'primereact/contextmenu';
import { RiStopCircleLine } from 'react-icons/ri';
import { FcCancel, FcOk } from 'react-icons/fc';
import { Checkbox } from 'primereact/checkbox';
import { ToggleButton } from 'primereact/togglebutton';

type PropsType = {
    setTaskSpec: setTaskSpecType,
    specification: specificationType,
    available: boolean,
    setSpecificationContext: setSpecificationContextType
}

const Spec: React.FC<PropsType> = (props) => {
    let cm = useRef<any>(null);

    const items = [
        {
            label: 'Тестирование не проводилось',
            icon: 'pi pi-circle-off',
            command: () => { props.setTaskSpec((props.specification.selectedLineNumber + 1).toString(), 'testStatus', 0) }
        },
        {
            label: 'Требуются доработки',
            icon: 'pi pi-times-circle',
            command: () => { props.setTaskSpec((props.specification.selectedLineNumber + 1).toString(), 'testStatus', 2) }
        },
        {
            label: 'Успешно',
            icon: 'pi pi-check-circle',
            command: () => { props.setTaskSpec((props.specification.selectedLineNumber + 1).toString(), 'testStatus', 1) }
        }
    ];

    return <React.Fragment>
        <ContextMenu ref={cm} model={items}></ContextMenu>
        <div className="p-grid">
            <div className='p-col-9 tableContainer'>
                <DataTable scrollable={true} scrollHeight={window.innerHeight - 500 + 'px'} className="p-col" header={<SpecificationHeader setTaskSpec={props.setTaskSpec} />} value={props.specification.specifications}>
                    <Column field="number" header="#" style={{ width: '5%' }} body={(rowData: TaskSpecType) => <div onClick={() => props.setSpecificationContext('selectedLineNumber', rowData.number - 1)} className="center_cell">{rowData.number}</div>} />
                    <Column field="isReady" header="" style={{ width: '5%' }} body={(rowData: TaskSpecType) => checkboxIsTaskPointReady(rowData, props.setTaskSpec)} />
                    <Column field="value" header="Описание задачи" editor={textEditor} />
                    <Column field="testStatus" header="" style={{ width: '20%' }} body={(rowData: any) => testStatusTemplate(rowData, cm, props.setSpecificationContext)} />
                </DataTable>
                <div className='p-col'>
                    <InputTextarea style={{ height: '100%' }} onChange={(e) => { }} />
                </div>
                <div className='p-col'>
                    <label htmlFor="isSaveForDatabase">Не сохранять в базе знаний: </label>
                    <Checkbox inputId='isSaveForDatabase' />
                </div>
                <div className='p-col'>
                    <InputTextarea style={{ height: '100%' }} />
                </div>
            </div>
            <div className='p-col-3 tableContainer'>
                <DataTable scrollable={true} scrollHeight={window.innerHeight - 500 + 'px'} className="p-col"
                    header={<CommentsHeader setSpecificationContext={props.setSpecificationContext} setTaskSpec={props.setTaskSpec} specification={props.specification} />}
                    value={props.specification.specifications[props.specification.selectedLineNumber].comments} filters={props.specification.commentFilters}>
                    <Column field="value" header={<div><span>Дата, автор</span><span>Текст</span></div>} body={(rowData: commentsItemType) => CommentLineTemplate(rowData)} />
                </DataTable>
                <div className='p-col'>
                    <InputTextarea style={{ height: '100%' }} />
                </div>
            </div>
        </div>
    </React.Fragment>
}

const checkboxIsTaskPointReady = (rowData: TaskSpecType, setTaskSpec: setTaskSpecType) => <div className="center_cell">
    <Checkbox value={rowData.isReady} checked={rowData.isReady} onChange={(elem) => { setTaskSpec(rowData.number.toString(), 'isReady', elem.checked) }} />
</div>

const SpecificationHeader = (props: { setTaskSpec: setTaskSpecType }) => <div className="p-col commandPallete">
    <Button icon="pi pi-plus" onClick={() => { props.setTaskSpec() }} /> {/* добавить требование */}
</div>;

const CommentsHeader = (props: { setTaskSpec: setTaskSpecType, specification: specificationType, setSpecificationContext: setSpecificationContextType }) => <div className="p-col commandPallete">
    <Button icon="pi pi-plus"
        onClick={() => props.setTaskSpec((props.specification.selectedLineNumber + 1).toString(),
                'comments',
                [...props.specification.specifications[props.specification.selectedLineNumber].comments,
                { isActive: true, value: '' }])
        } />
    <ToggleButton onLabel="Все комментарии" offLabel="Только актуальные" checked={JSON.stringify(props.specification.commentFilters) !== '{}'} onChange={(e) => props.setSpecificationContext('commentFilters', e.value ? { isActive: true } : {})} />
</div>;

const textEditor = (props: { prop: any, available: boolean, setTaskSpec: setTaskSpecType }) => <InputTextarea
    disabled={!props.available} rows={5} style={{ width: window.innerWidth / 3 + 'px' }} id={props.prop.rowData.number}
    value={props.prop.rowData.value} onChange={(e) => props.setTaskSpec((e.target as HTMLTextAreaElement).id, 'value', (e.target as HTMLTextAreaElement).value)} autoResize />;

const CommentLineTemplate = (rowData: commentsItemType) => <div>
    <span>{rowData.header}</span>
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
    }
    else if (rowData.testStatus === 1) {
        return <div className="testStatusCell"
            onClick={(e) => {
                setSpecificationContext('selectedLineNumber', rowData.number - 1);
                ref.current.show(e)
            }}>
            <FcOk />
            <span>Успешно</span>
        </div>
    }
    else {
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