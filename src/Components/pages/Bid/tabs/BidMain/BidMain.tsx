import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { ToggleButton } from 'primereact/togglebutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { BidType, BidMetadataType, setBidPropType, sendBidDiscussionForUSLineType, pushBidButtonType, showBidDiscussionDialogType, getBidDataType, setBidSpecType } from '../../../../../redux/reducers/bid-reducer';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputNumber } from 'primereact/inputnumber';
import Spec from './Spec';
import { Dialog } from 'primereact/dialog';

type PropsType = {
    Bid: BidType,
    setBidProp: setBidPropType,
    BidMetadata: BidMetadataType,
    setBidSpec: setBidSpecType,
    pushBidButton: pushBidButtonType,
    showBidDiscussionDialog: showBidDiscussionDialogType,
    getBidData: getBidDataType,
    sendBidDiscussionForUSLine: sendBidDiscussionForUSLineType
}

const BidMain: React.FC<PropsType> = (props) => {

    let accordion = <Accordion>
        <AccordionTab header="Требования">
            <Spec available={props.Bid.VisibilityAvailability.unavailable.find((element) => (element === "Задание")) === undefined} showBidDiscussionDialog={props.showBidDiscussionDialog} setBidSpec={props.setBidSpec} tableName={'userStory'} dataTable={props.Bid.userStory} />
        </AccordionTab>
    </Accordion>;
    if (props.Bid.VisibilityAvailability.invisible.find((element) => (element === "ТехническоеЗадание")) === undefined) {
        accordion = <Accordion>
            <AccordionTab header="Требования">
                <Spec available={true} showBidDiscussionDialog={props.showBidDiscussionDialog} setBidSpec={props.setBidSpec} tableName={'userStory'} dataTable={props.Bid.userStory} />
            </AccordionTab>
            <AccordionTab header="Техническое задание"><Spec available={true} showBidDiscussionDialog={props.showBidDiscussionDialog} setBidSpec={props.setBidSpec} tableName={'specifications'} dataTable={props.Bid.specifications} /></AccordionTab>
        </Accordion>
    }

    return (
        <React.Fragment>
            <div className="p-grid">
                <div className="p-col">
                    <label htmlFor="name">Наименование: </label>
                    <InputText type="text" id="name" value={props.Bid.name} onChange={(e) =>
                        // @ts-ignore - error: Property 'value' does not exist on type 'EventTarget'
                        props.setBidProp('name', e.target.value)} />
                </div>
                {props.Bid.source.value !== '' && <div className="p-col">
                    <label htmlFor="source">Основание: </label>
                    <Link to={"/bids/" + props.Bid.source.number} onClick={() => props.getBidData(props.Bid.source.number)}>{" " + props.Bid.source.value}</Link>
                </div>}
            </div>
            <div className="p-grid">
                <div className="p-col" style={{ paddingLeft: 0 }}>
                    <div className="p-grid-col">
                        <div className="p-col">
                            <label htmlFor="number">Номер: </label>
                            <InputText id="number" value={props.Bid.number} disabled={true} />
                        </div>
                        <div className="p-col">
                            <label htmlFor="project">Проект: </label>
                            <Dropdown id="project" value={props.Bid.project} options={props.BidMetadata.projectSelectItems} onChange={(e) => { props.setBidProp('project', e.target.value) }} />
                        </div>
                        <div className="p-col">
                            <label htmlFor="priority">Приоритет: </label>
                            <Dropdown id="priority" value={props.Bid.priority} options={props.BidMetadata.prioritySelectItems} onChange={(e) => props.setBidProp('priority', e.target.value)} />
                        </div>
                        <div className="p-col">
                            <label htmlFor="customer">Заказчик: </label>
                            <Dropdown filter={true} filterMatchMode="startsWith" id="customer" disabled={props.Bid.VisibilityAvailability.unavailable.find((element) => (element === 'Заказчик')) !== undefined} value={props.Bid.customer} options={props.BidMetadata.customerSelectItems} onChange={(e) => props.setBidProp('customer', e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="p-col">
                    <div className="p-grid-col">
                        <div className="p-col">
                            <label htmlFor="date">Дата создания: </label>
                            <InputText disabled type="text" id="date" value={props.Bid.date} />
                        </div>
                        <div className="p-col">
                            <label htmlFor="duration">Продолжительность: </label>
                            <InputNumber type="text" id="duration" value={props.Bid.duration} onChange={(e) =>
                                // @ts-ignore - error: Property 'value' does not exist on type 'EventTarget'
                                props.setBidProp('duration', e.value)} />
                        </div>
                        <div className="p-col">
                            <label htmlFor="mode">Вид задачи: </label>
                            <Dropdown id="mode" value={props.Bid.mode} options={props.BidMetadata.modeSelectItems} onChange={(e) => props.setBidProp('mode', e.target.value)} />
                        </div>
                        <div className="p-col">
                            <label htmlFor="author">Автор: </label>
                            <InputText disabled type="text" id="author" value={props.Bid.author} />
                        </div>
                    </div>
                </div>
                <div className="p-col" style={{ paddingRight: 0 }}>
                    <div className="p-grid-col">
                        <div className="p-grid p-col">
                            <div className="p-col">
                                <label htmlFor="status">Статус: </label>
                                <InputText disabled type="text" id="status" value={props.Bid.status} />
                            </div>
                            {props.Bid.VisibilityAvailability.invisible.find((element) => (element === "Рассчитались")) === undefined && <div className="p-col" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <ToggleButton checked={props.Bid.paid_off} onChange={(e) => props.setBidProp('paid_off', e.value)} onLabel="Рассчитались" offLabel="Не рассчитались" />
                            </div>}
                        </div>
                        <div className="p-col">
                            {props.Bid.VisibilityAvailability.invisible.find((element) => (element === "ЗапросНаУтверждение")) === undefined && <Button className="status_buttons" label="Запрос на утверждение" icon="pi pi-check" onClick={() => props.pushBidButton('ЗапросНаУтверждение')} />}
                            {props.Bid.VisibilityAvailability.invisible.find((element) => (element === "Утверждено")) === undefined && <Button className="status_buttons" label="Утверждено" icon="pi pi-check" onClick={() => props.pushBidButton('Утверждено')} />}
                            {props.Bid.VisibilityAvailability.invisible.find((element) => (element === "ПринятьЗаказчиком")) === undefined && <Button className="status_buttons" label="Принято" icon="pi pi-star" onClick={() => props.pushBidButton('ПринятьЗаказчиком')} />}
                        </div>

                        <div className="p-col">
                            <label htmlFor="type">Тип: </label>
                            <Dropdown id="type" value={props.Bid.type} options={props.BidMetadata.typeSelectItems} onChange={(e) => props.setBidProp('type', e.target.value)} />
                        </div>

                        {props.Bid.VisibilityAvailability.invisible.find((element) => (element === "СтатусАнализа")) === undefined && <div className="p-col">
                            <label htmlFor="analisysStatus">Статус анализа: </label>
                            <Dropdown id="analisysStatus" value={props.Bid.analisysStatus} options={props.BidMetadata.statusSelectItems} onChange={(e) => props.setBidProp('analisysStatus', e.target.value)} />
                        </div>}
                        {getSolving(props.Bid.VisibilityAvailability, props.Bid.solving, props.setBidProp)}
                    </div>
                </div>
            </div>
            <h3>Задание</h3>
            {accordion}
            {props.Bid.userStory.length && <Dialog style={{maxWidth: '600px'}} header="Обсуждение (создание)" visible={props.Bid.DialogDiscussionData.isVisible} 
                onHide={() => {props.setBidProp('DialogDiscussionData', {...props.Bid.DialogDiscussionData, isVisible: false})}} 
                footer={<Button icon='pi pi-check' onClick={props.sendBidDiscussionForUSLine} label="OK" />}>
                <div>{props.Bid.userStory[props.Bid.DialogDiscussionData.index].value}</div>
                <InputTextarea value={props.Bid.DialogDiscussionData.DiscussionData.value} onChange={(el) => {props.setBidProp('DialogDiscussionData', {...props.Bid.DialogDiscussionData, DiscussionData: {...props.Bid.DialogDiscussionData.DiscussionData, value: (el.target as HTMLTextAreaElement).value}})}} />
            </Dialog>}
        </React.Fragment>)
}

const getSolving = (VisibilityAvailability: {invisible: Array<string>, unavailable: Array<string>}, solving: string, setBidProp: setBidPropType) => {
    if (VisibilityAvailability.invisible.find((element: string) => (element === "Решение")) !== undefined) { return <div></div> }
    else {
        const readOnly = (VisibilityAvailability.unavailable.find((element: string) => (element === "Основание")) !== undefined);

        return <div className="p-col">
            <span>Решение ошибки: </span>
            <InputTextarea readOnly={readOnly} value={solving} onChange={(e) => {
                // @ts-ignore - error: Property 'value' does not exist on type 'EventTarget'
                setBidProp('solving', e.target.value)
            }} autoResize />
        </div>
    }
}

export default React.memo(BidMain);