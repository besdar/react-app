import React from 'react';
import { DialogOnExitType, ParadocsEditorType, SaveCurrentEditorType, setEditorEditableStateType, setEditorStateType } from '../../../../redux/reducers/paradocs-reducer';
import { Editor } from 'primereact/editor';
import style from './Editor.module.css';
import { InputText } from 'primereact/inputtext';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';

type PropsType = {
    uid: string,
    editors: Array<ParadocsEditorType>,
    setEditorState: setEditorStateType,
    DialogOnExit: DialogOnExitType,
    SaveCurrentEditor: SaveCurrentEditorType,
    setEditorEditableState: setEditorEditableStateType
}

const ParadocsEditor: React.FC<ParadocsEditorComponentType> = React.memo((props) => {
    if (!!props.isEditable) {
        return <React.Fragment>
            <div className={style.headerContainer}>
                <InputText type="text" className="p-inputtext-lg p-d-block" value={props.heading} onChange={(e) => props.setEditorState(false, (e.target as HTMLInputElement).value, props.id, true)} />
                <div className={style.editButtonContainer} onClick={() => props.setEditorEditableState(props.id, false)}><AiFillEdit size='2em' title='Снять редактирование' /></div>
            </div>
        <Editor
            className={style.paradocsEditor}
            value={props.text}
            headerTemplate={<EditorHeader SaveCurrentEditor={props.SaveCurrentEditor} DialogOnExit={props.DialogOnExit} editorNumber={props.id} uid={props.uid} setEditorState={props.setEditorState} />}
            key={props.id}
            id={props.id.toString()}
            onTextChange={(e) => props.setEditorState(false, e.htmlValue as string, props.id, false)} />
    </React.Fragment>
    } else {
        return <React.Fragment>
            <div className={style.headerContainer}>
                <h3>{props.heading}</h3>
                <div className={style.editButtonContainer} onClick={() => props.setEditorEditableState(props.id, true)}><AiOutlineEdit size='2em' title='Начать редактирование' /></div>
            </div>
            <div dangerouslySetInnerHTML={{__html: props.text}}></div>
    </React.Fragment>
    }
})

export const Editors: React.FC<PropsType> = (props) => {
    if (!props.editors.length) { return null }

    return <React.Fragment>
        {props.editors.map(m => <ParadocsEditor {...m}
            setEditorState={props.setEditorState}
            setEditorEditableState={props.setEditorEditableState}
            DialogOnExit={props.DialogOnExit}
            SaveCurrentEditor={props.SaveCurrentEditor}
            uid={props.uid} />)}
    </React.Fragment>
}

type ParadocsEditorComponentType = {
    setEditorState: setEditorStateType,
    DialogOnExit: DialogOnExitType,
    SaveCurrentEditor: SaveCurrentEditorType,
    setEditorEditableState: setEditorEditableStateType,
    uid: string
} & ParadocsEditorType



type EditorHeaderPropsType = {
    setEditorState: setEditorStateType,
    uid: string,
    editorNumber: number,
    DialogOnExit: DialogOnExitType,
    SaveCurrentEditor: SaveCurrentEditorType
}

const EditorHeader = React.memo((props: EditorHeaderPropsType) => (
    <span className="ql-formats">
        <select title="Подзаголовок" className="ql-header" defaultValue="0">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="0">Normal</option>
        </select>
        <select title="Шрифт" className="ql-font">
            <option></option>
            <option value="serif"></option>
            <option value="monospace"></option>
        </select>
        <button title="Жирный" className="ql-bold" aria-label="Bold"></button>
        <button title="Курсив" className="ql-italic" aria-label="Italic"></button>
        <button title="Подчеркнутый" className="ql-underline" aria-label="Underline"></button>
        <select title="Цвет текста" className="ql-color">
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
        <select title="Цвет фона" className="ql-background">
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
            <button title="Числовой список" className="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
            <button title="Список" className="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
            <select title="Выравнивание" className="ql-align" >
                <option></option>
                <option value="center"></option>
                <option value="right"></option>
                <option value="justify"></option>
            </select>
        </span>
        <button title="Область кода" className="ql-code-block" aria-label="Insert Code Block" type="button"></button>
        <button title="Добавить ссылку" className="ql-link" aria-label="Insert Link" type="button"></button>
        {/* <button title="Вставить картинку" className="ql-image" aria-label="Insert Image" type="button"></button> */}

        <button title="Сохранить" className="pi pi-save" aria-label="Save texts" type="button" onClick={e => {
            // @ts-ignore
            let currentId = e.currentTarget.parentElement.parentElement.parentElement.id;
            props.SaveCurrentEditor(parseInt(currentId));
            props.DialogOnExit(false);
            alert("Сохранено!");
        }}></button>
    </span>
));

export default React.memo(Editors);