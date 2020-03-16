import React from 'react';
import { Tree } from 'primereact/tree';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Editors } from './Editors/Editor.jsx';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import './Paradocs.css';

import Header from './Header.jsx';

const Paradocs = (props) => {
    if (!props.items.length) { return <ProgressSpinner /> }

    const footer = (
        <React.Fragment>
            <Button label="Да" icon="pi pi-check" onClick={e => {
                // в теории эта кнопка должна взять состояние текстов из стейта и отправить в базу 1С с сервера, 
                // но для этого на сервак ноды нужно постоянно передавать изменения текста (передавать только маленький измененный кусочек) 
                // и это правильно с точки зрения FLUX (методология реакта). Сейчас этого не делается и методология нарушается 
                // так как на начальном этапе реализовывать функционал обработки дельты (измененного текста) нет, нет пока причины выделять на это время.
                let ArrayOfElements = document.getElementsByClassName("p-editor-container");
                let ArrayOfEditors = [];
                Array.from(ArrayOfElements).forEach((Element) => {
                    ArrayOfEditors.push({ number: Element.id, text: Element.firstElementChild.nextElementSibling.firstElementChild.innerHTML });
                });
                props.SaveCurrentEditors(ArrayOfEditors, props.uid);
                props.DialogOnExit(false);
            }} />
            <Button label="Нет" icon="pi pi-times" onClick={e => props.DialogOnExit(false)} />
        </React.Fragment>
    );

    return (
        <div style={{ display: "flex", padding: "5px" }}>
            <Dialog header="Измененный текст не сохранен" footer={footer} visible={props.showPopup} style={{ width: "fit-content" }} modal={true} onHide={() => props.DialogOnExit(false)}>
                Сохранить измененный текст?
            </Dialog>
            <div style={{ flexBasis: "30%" }}>
                <Header
                    SaveCurrentEditors={props.SaveCurrentEditors}
                    DialogOnExit={props.DialogOnExit} />
                <Tree
                    value={props.items}
                    style={{ width: '95%' }}
                    selectionMode="single"
                    onSelectionChange={function name(event) {
                        if (!props.editorModified) {
                            props.getParadocsEditors(this.node.data.id, false);
                        }
                        else {
                            props.setEditorState(true, true);
                        }
                    }} />
            </div>
            <div style={{ flexBasis: "70%" }}>
                <Editors
                    editors={props.editors}
                    uid={props.uid}
                    SaveCurrentEditor={props.SaveCurrentEditor}
                    setEditorState={props.setEditorState} />
            </div>

        </div>
    )
}

export default Paradocs;