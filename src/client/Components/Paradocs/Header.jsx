import React from 'react';
import { Button } from "primereact/button";

const Header = (props) => {

    return (<div style={{ display: "flex" }}>
        <h1 style={{ marginTop: "0px", marginRight: "5px" }}>Paradocs.</h1>
        <Button icon="pi pi-save" onClick={e => {
            // в теории эта кнопка должна взять состояние текстов из стейта и отправить в базу 1С с сервера, 
            // но для этого на сервак ноды нужно постоянно передавать изменения текста (передавать только маленький измененный кусочек) 
            // и это правильно с точки зрения FLUX (методология реакта). Сейчас этого не делается и методология нарушается 
            // так как на начальном этапе реализовывать функционал обработки дельты (измененного текста) нет, нет пока причины выделять на это время.
            let ArrayOfElements = document.getElementsByClassName("p-editor-container");
            let ArrayOfEditors = [];
            Array.from(ArrayOfElements).forEach((Element) => {
                ArrayOfEditors.push({ number: Element.id, text: Element.firstElementChild.nextElementSibling.firstElementChild.innerHTML });
            });
            if (ArrayOfEditors.length > 0) {
                props.SaveCurrentEditors(ArrayOfEditors, props.uid);
                props.DialogOnExit(false);
                alert("Сохранено!");
            }
        }} style={{ height: "fit-content" }} />
    </div>);
}

export default Header;