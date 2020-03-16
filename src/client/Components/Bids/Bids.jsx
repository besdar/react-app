import React from 'react';
import { TreeTable } from 'primereact/treetable';
// import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ScrollPanel } from 'primereact/scrollpanel';

import { Input } from '../react-chat-elements-master'
import { MessageList } from '../react-chat-elements-master';

import './Bids.css';
import { NavLink } from 'react-router-dom';

import Header from './header.jsx';

const Bids = (props) => {

    if (!props.bidsList.length) {
        return <div style={{ width: "100%", height: window.innerHeight + 'px', display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* <ProgressSpinner /> */}
            <img src={location.origin + '/assets/loader.gif'}></img>
        </div>
    }

    let cols = [];
    if (props.styleDisplayOfMessages == "none" && window.innerWidth > 1350) {
        cols = [
            { field: 'number', header: 'Номер', expander: true },
            { field: 'label', header: 'Наименование', expander: false },
            { field: 'status', header: 'Статус', expander: false },
            { field: 'time', header: 'Продолжительность', expander: false },
            { field: 'type', header: 'Тип', expander: false },
            { field: 'customer', header: 'Заказчик', expander: false },
            { field: 'priority', header: 'Приоритет', expander: false },
            { field: 'project', header: 'Проект', expander: false }
        ];
    }
    else {
        cols = [
            { field: 'number', header: 'Номер', expander: true },
            { field: 'label', header: 'Наименование', expander: false },
            { field: 'type', header: 'Тип', expander: false },
            { field: 'project', header: 'Проект', expander: false }
        ];
    }

    let CreateABidsTreeTable = cols.map((col, i) => {
        if (col.field == 'number') {
            return <Column key={col.field} field={col.field} expander={col.expander} header={col.header} body={(node) => {
                if (isNaN(node.data.number)) { return node.data.number }
                else { return <NavLink to={'/bids/' + node.data.number}>{node.data.number}</NavLink> }
            }} />
        }
        else { return <Column key={col.field} field={col.field} expander={col.expander} header={col.header} /> }
    });

    return (<React.Fragment>
        <Header
            setCurrentState={props.setCurrentState}
            styleDisplayOfMessages={props.styleDisplayOfMessages}
            messagesList={props.messagesList} />
        <div className={window.innerWidth > 1030 ? "p-grid" : "p-grid p-dir-col"}>
            <div className="p-col">
                <TreeTable value={props.bidsList} autoLayout={true}>
                    {CreateABidsTreeTable}
                </TreeTable>
            </div>
            <div className="p-col" style={{ display: props.styleDisplayOfMessages }}>
                <TreeTable value={props.messagesList} autoLayout={true} >
                    {/* в теории тут в вэлью можно запихнуть стили (цвет например) и применять для каждой строки совй стиль 
                            (например красить в цвет проекта строку) */}
                    <Column style={{ width: "40px" }} expander></Column>
                    <Column field="id" body={messageTemplate} header="Обсуждения" ></Column>
                </TreeTable>
            </div>
        </div>
    </React.Fragment>)
}

//"id,number,label,status,time,type,customer,priority,project"
function messageTemplate(node) {
    if (node.data.is_it_child) {
        return <div className="p-grid">
            <div className="p-col">
                <ScrollPanel style={{ maxHeight: "250px" }}>
                    <div className="mssg-box">
                        <MessageList dataSource={node.data.childs} />
                        <Input //необходимо реализовать функцию onChange по заветам FLUX
                            placeholder="Введите текст здесь..."
                            multiline={true}
                            rightButtons={
                                <Button label='Отправить' id={node.data.id} onClick={function name(element) {
                                    let text = element.currentTarget.parentElement.parentElement.firstElementChild.value;
                                    props.sendReply(element.currentTarget.id, text);
                                    // element.currentTarget.parentElement.parentElement.firstElementChild.value = "";
                                }} />
                            } />
                    </div>
                </ScrollPanel>
            </div>
        </div>
    }
    else {
        let parent = () => (<div></div>);
        if (JSON.stringify(node.data.parent) != "{}") {
            parent = () => (<div style={{ color: "lightgrey" }}><div className="p-grid">
                <div className="p-col">
                    {node.data.parent.message}
                </div>
            </div><div className="p-grid">
                    <div className="p-col-4">
                        <b>{node.data.parent.date}</b>
                    </div>
                    <div className="p-col">
                        <b>{node.data.parent.author}</b>
                    </div>
                </div></div>);
        };
        return <React.Fragment>
            <div className="p-grid">
                <div className="p-col">
                    <b>{node.data.label}</b>
                </div>
            </div>
            {parent()}
            <div className="p-grid">
                <div className="p-col">
                    {node.data.message}
                </div>
            </div>
            <div className="p-grid">
                <div className="p-col-4">
                    <b>{node.data.date}</b>
                </div>
                <div className="p-col">
                    <b>{node.data.author}</b>
                </div>
                {/* {reply(node.data.is_it_child, node.data.id)} */}
            </div>
        </React.Fragment>
    }
}

export default Bids;