import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { FileUpload } from 'primereact/fileupload';
import { ToggleButton } from 'primereact/togglebutton';
import './Bid.css';

const Bid = (props) => {

    if (!props.Bid.loaded) {
        return <div style={{ width: "100%", height: window.innerHeight + 'px', display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* <ProgressSpinner /> */}
            <img src={location.origin + '/assets/loader.gif'}></img>
        </div>
    }

    if (props.NowMessage != '') {
        props.GrowlMetod.show({ life: 5000, severity: 'error', summary: 'Ошибка', detail: props.NowMessage });
        props.setCurrentState('NowMessage', '');
    }

    function showSpec() {
        return <React.Fragment>
            {props.Bid.specifications.map((el, index) => {
                return <div key={index} className="p-col">
                    <span>{index + 1}</span><InputTextarea style={{ width: window.innerWidth/2 - 30 + 'px' }} id={index} value={el} onChange={(e) => { props.setBidSpec(e.target.id, e.target.value) }} autoResize />
                </div>
            })}
        </React.Fragment>
    }

    function showUserStory() {
        return <React.Fragment>
            {props.Bid.userStory.map((el, index) => {
                return <div key={index} className="p-col">
                    <span>{index + 1}</span><InputTextarea style={{ width: window.innerWidth/2 - 30 + 'px' }} id={index} value={el} onChange={(e) => { props.setUserStory(e.target.id, e.target.value) }} autoResize />
                </div>
            })}
        </React.Fragment>
    }

    return (<React.Fragment>
        <div className="p-grid">
            <div className="p-col">
                <h1 style={{ margin: "0px" }}>Заявка №{props.Bid.number}</h1>
            </div>
            <div className="p-col head_buttons" style={{ textAlign: "right" }}>
                <div id="file_upload" style={{ display: "inline-flex" }}>
                    <FileUpload mode="basic" name="upload" maxFileSize={500000} auto={true} customUpload={true} uploadHandler={function (event) {
                        let reader = new FileReader();
                        reader.onload = (function (theFile) { return function (el) { props.setNewAttachement({ data: el.target.result, filename: theFile }) }; })(event.files[0].name);
                        reader.readAsDataURL(event.files.pop());
                        document.getElementById("file_upload").firstElementChild.lastElementChild.style.display = 'inline'; //its work of primereact, but why do they think i need it to do!??
                    }} />
                    <sup className="badge">{props.Bid.attachement_count}</sup>
                </div>
                <Button style={{ display: "inline-flex" }} icon="pi pi-save" onClick={() => props.pushButton('Сохранить')} /> {/* сохранить */}
                <Link style={{ display: "inline-flex" }} to='/bids'><Button icon="pi pi-arrow-left" /></Link>  {/* назад */}
            </div>
        </div>


        <div className="p-grid">
            <div className="p-col">
                <div className="p-grid-col">
                    <div className="p-col">
                        <label htmlFor="name">Наименование: </label>
                        <InputText type="text" id="name" value={props.Bid.name} onChange={(e) => props.setBidProp('name', e.target.value)} />
                    </div>
                    <div className="p-col">
                        <label htmlFor="author">Заказчик: </label>
                        <InputText type="text" id="author" value={props.Bid.author} readOnly />
                    </div>
                    <div className="p-col">
                        <label htmlFor="duration">Продолжительность: </label>
                        <InputText type="duration" id="duration" value={props.Bid.duration} onChange={(e) => props.setBidProp('duration', e.target.value)} />
                    </div>
                    <div className="p-col">
                        <label htmlFor="status">Статус: </label>
                        <Dropdown type="text" type="status" id="status" value={props.Bid.status} options={props.BidMetadata.statusSelectItems} onChange={(e) => props.setBidProp('status', e.value)} />
                    </div>
                </div>
            </div>
            <div className="p-col">
                <div className="p-grid-col">
                    <div className="p-col">
                        <label htmlFor="project">Проект: </label>
                        <Dropdown type="text" id="project" value={props.Bid.project} options={props.BidMetadata.projectSelectItems} onChange={(e) => props.setBidProp('project', e.value)} />
                    </div>
                    <div className="p-col">
                        <label htmlFor="priority">Приоритет: </label>
                        <Dropdown type="text" id="priority" value={props.Bid.priority} options={props.BidMetadata.prioritySelectItems} onChange={(e) => props.setBidProp('priority', e.target.value)} />
                    </div>
                    <div className="p-col">
                        <label htmlFor="type">Тип: </label>
                        <Dropdown type="text" id="type" value={props.Bid.type} options={props.BidMetadata.typeSelectItems} onChange={(e) => props.setBidProp('type', e.target.value)} />
                    </div>
                    <div className="p-col">
                        <label htmlFor="mode">Вид задачи: </label>
                        <Dropdown type="text" id="mode" value={props.Bid.mode} options={props.BidMetadata.modeSelectItems} onChange={(e) => props.setBidProp('mode', e.target.value)} />
                    </div>
                    <div className="p-col">
                        <label htmlFor="analisysStatus">Статус анализа: </label>
                        <Dropdown type="text" id="analisysStatus" value={props.Bid.analisys_status} options={props.BidMetadata.statusSelectItems} onChange={(e) => props.setBidProp('analisysStatus', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="p-col">
                <div className="p-grid-col">
                    <div className="p-col">
                        <ToggleButton checked={props.Bid.paid_off} onChange={(e) => props.setBidProp('paid_off', e.value)} onLabel="Рассчитались" offLabel="Не рассчитались" />
                    </div>
                    <div className="p-col">
                        <Button className="status_buttons" label="Запрос на утверждение" icon="pi pi-check" onClick={() => props.pushButton('ЗапросНаУтверждение')} />
                        <Button className="status_buttons" label="Утверждено" icon="pi pi-check" onClick={() => props.pushButton('Утверждено')} />
                        <Button className="status_buttons" label="Принято" icon="pi pi-star" onClick={() => props.pushButton('ПринятьЗаказчиком')} />
                    </div>
                </div>
            </div>
        </div>
        <div className="p-grid">
            <div className="p-grid-col p-col">
                <div className="p-col">
                    <Button icon="pi pi-plus" onClick={() => props.setUserStory()} /> {/* добавить требование */}
                    <span>Требования к задаче</span>
                </div>
                {showUserStory()}
            </div>
            <div className="p-grid-col p-col">
                <div className="p-col">
                    <Button icon="pi pi-plus" onClick={() => props.setBidSpec()} /> {/* добавить требование */}
                    <span>Техническое задание</span>
                </div>
                {showSpec()}
            </div>
        </div>
    </React.Fragment>)
}

export default Bid;