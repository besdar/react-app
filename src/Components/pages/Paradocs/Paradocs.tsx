import React from 'react';
import { Tree } from 'primereact/tree';
// import { ProgressSpinner } from 'primereact/progressspinner';
import { Editors } from './Editors/Editor';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import './Paradocs.css';

import Header from './Header';
import Loader from '../../common/Loader/Loader';
import { Editor as EditorType, getParadocsEditorsType, DialogOnExitType, SaveCurrentEditorsType, SaveCurrentEditorType, setEditorStateType } from '../../../redux/reducers/paradocs-reducer';
import TreeNode from 'primereact/components/treenode/TreeNode';

type PropsType = {
    items: Array<TreeNode>,
    uid: string,
    getParadocsEditors: getParadocsEditorsType,
    showPopup: boolean,
    DialogOnExit: DialogOnExitType,
    SaveCurrentEditors: SaveCurrentEditorsType,
    editorModified: boolean,
    editors: Array<EditorType>,
    SaveCurrentEditor: SaveCurrentEditorType,
    setEditorState: setEditorStateType
}

type DialogFooterPropsType = {
    DialogOnExit: DialogOnExitType,
    SaveCurrentEditors: SaveCurrentEditorsType,
    uid: string
}

const SaveEditorsOnClick = (SaveCurrentEditors: SaveCurrentEditorsType, DialogOnExit: DialogOnExitType, uid: string) => {
    // в теории эта кнопка должна взять состояние текстов из стейта и отправить в базу 1С с сервера, 
    // но для этого на сервак ноды нужно постоянно передавать изменения текста (передавать только маленький измененный кусочек) 
    // и это правильно с точки зрения FLUX (методология реакта). Сейчас этого не делается и методология нарушается 
    // так как на начальном этапе реализовывать функционал обработки дельты (измененного текста) нет, нет пока причины выделять на это время.
    let ArrayOfElements = document.getElementsByClassName("p-editor-container");
    let ArrayOfEditors = [] as Array<EditorType>;

    // @ts-ignore - we need to take editors from BLL, not from real DOM
    Array.from(ArrayOfElements).forEach((Element) => { ArrayOfEditors.push({ id: parseInt(Element.id), text: Element.firstElementChild.nextElementSibling.firstElementChild.innerHTML }); });
    if (ArrayOfEditors.length > 0) {
        SaveCurrentEditors(ArrayOfEditors, uid);
        DialogOnExit();
        alert("Сохранено!");
    }
}

const DialogFooter = (props: DialogFooterPropsType) => (<React.Fragment>
    <Button label="Да" icon="pi pi-check" onClick={() => SaveEditorsOnClick(props.SaveCurrentEditors, props.DialogOnExit, props.uid)} />
    <Button label="Нет" icon="pi pi-times" onClick={() => props.DialogOnExit()} />
</React.Fragment>);

const Paradocs: React.FC<PropsType> = (props) => {
    if (!props.items.length) { return <Loader nameOfProcess="загружаем меню парадокс" /> }

    return (
        <div style={{ display: "flex", padding: "5px" }}>
            <Dialog header="Измененный текст не сохранен" footer={DialogFooter} visible={props.showPopup} style={{ width: "fit-content" }} modal={true} onHide={() => props.DialogOnExit()}>
                Сохранить измененный текст?
            </Dialog>
            <div style={{ flexBasis: "30%" }}>
                <Header
                    SaveEditorsOnClick={SaveEditorsOnClick}
                    SaveCurrentEditors={props.SaveCurrentEditors}
                    DialogOnExit={props.DialogOnExit}
                    uid={props.uid} />
                <Tree
                    value={props.items}
                    style={{ width: '95%' }}
                    selectionMode="single"
                    onSelectionChange={() => {
                        // @ts-ignore - do not use 'this'
                        if (!props.editorModified) { props.getParadocsEditors(this.node.data.id); }
                        else { props.DialogOnExit(); }
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