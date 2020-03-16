import React from 'react';
import { Editor } from 'primereact/editor';

export const Editors = (props) => {
    if (!props.editors.length) {return <div></div>}

    const header = (
        <span className="ql-formats">
            <select className="ql-header" defaultValue="0">
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                <option value="0">Normal</option>
            </select>
            <select className="ql-font">
                <option></option>
                <option value="serif"></option>
                <option value="monospace"></option>
            </select>
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <select className="ql-color">
                <option value="#e60000"></option>
                <option value="#ff9900"></option>
                <option value="#ffff00"></option>
                <option value="#008a00"></option>
                <option value="#0066cc"></option>
                <option value="#9933ff"></option>
                <option value="#ffffff"></option>
                <option value="#facccc"></option>
                <option value="#ffebcc"></option>
                <option value="#ffffcc"></option>
                <option value="#cce8cc"></option>
                <option value="#cce0f5"></option>
                <option value="#ebd6ff"></option>
                <option value="#bbbbbb"></option>
                <option value="#f06666"></option>
                <option value="#ffc266"></option>
                <option value="#ffff66"></option>
                <option value="#66b966"></option>
                <option value="#66a3e0"></option>
                <option value="#c285ff"></option>
                <option value="#888888"></option>
                <option value="#a10000"></option>
                <option value="#b26b00"></option>
                <option value="#b2b200"></option>
                <option value="#006100"></option>
                <option value="#0047b2"></option>
                <option value="#6b24b2"></option>
                <option value="#444444"></option>
                <option value="#5c0000"></option>
                <option value="#663d00"></option>
                <option value="#666600"></option>
                <option value="#003700"></option>
                <option value="#002966"></option>
                <option value="#3d1466"></option>
            </select>
            <select className="ql-background">
                <option value="#000000"></option>
                <option value="#e60000"></option>
                <option value="#ff9900"></option>
                <option value="#ffff00"></option>
                <option value="#008a00"></option>
                <option value="#0066cc"></option>
                <option value="#9933ff"></option>
                <option value="#facccc"></option>
                <option value="#ffebcc"></option>
                <option value="#ffffcc"></option>
                <option value="#cce8cc"></option>
                <option value="#cce0f5"></option>
                <option value="#ebd6ff"></option>
                <option value="#bbbbbb"></option>
                <option value="#f06666"></option>
                <option value="#ffc266"></option>
                <option value="#ffff66"></option>
                <option value="#66b966"></option>
                <option value="#66a3e0"></option>
                <option value="#c285ff"></option>
                <option value="#888888"></option>
                <option value="#a10000"></option>
                <option value="#b26b00"></option>
                <option value="#b2b200"></option>
                <option value="#006100"></option>
                <option value="#0047b2"></option>
                <option value="#6b24b2"></option>
                <option value="#444444"></option>
                <option value="#5c0000"></option>
                <option value="#663d00"></option>
                <option value="#666600"></option>
                <option value="#003700"></option>
                <option value="#002966"></option>
                <option value="#3d1466"></option>
            </select>
            <span className="ql-formats">
                <button className="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
                <button className="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
                <select className="ql-align" >
                    <option></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>
            </span>
            <button className="ql-link" aria-label="Insert Link" type="button"></button>
            <button className="ql-image" aria-label="Insert Image" type="button"></button>
            <button className="ql-code-block" aria-label="Insert Code Block" type="button"></button>
            <button className="pi pi-save" aria-label="Save texts" type="button" onClick={e => {
                // в теории эта кнопка должна взять состояние текстов из стейта и отправить в базу 1С с сервера, 
                // но для этого на сервак ноды нужно постоянно передавать изменения текста (передавать только маленький измененный кусочек) 
                // и это правильно с точки зрения FLUX (методология редакта). Сейчас этого не делается и методология нарушается 
                // так как на начальном этапе реализовывать функционал обработки дельты (измененного текста) нет, нет пока причины выделять на это время.
                props.SaveCurrentEditor(e.currentTarget.parentElement.parentElement.parentElement.id, props.uid, e.currentTarget.parentElement.parentElement.nextElementSibling.firstElementChild.innerHTML);
                props.setEditorState(false, false);
            }}></button>
        </span>
    );

    let EditorsElements = props.editors.map(m => <Editor 
                                                    style={{ minHeight: "300px" }} 
                                                    value={m.text} 
                                                    headerTemplate={header} 
                                                    key={m.id} 
                                                    id={m.id.toString()}
                                                    onTextChange={e => props.setEditorState(true, false)} />);

    return (
        <React.Fragment>
            {EditorsElements}
        </React.Fragment>
    )
}

export default Editors;