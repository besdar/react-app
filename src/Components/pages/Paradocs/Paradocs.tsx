import React from 'react';
import { Tree } from 'primereact/tree';
// import { ProgressSpinner } from 'primereact/progressspinner';
import { Editors } from './Editors/Editor';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import style from './Paradocs.module.css';

import Header from './Header';
import Loader from '../../common/Loader/Loader';
import { ParadocsEditorType, getParadocsEditorsType, DialogOnExitType, setEditorStateType, SaveEditorsOnClickType, SaveCurrentEditorType, setEditorEditableStateType } from '../../../redux/reducers/paradocs-reducer';
import TreeNode from 'primereact/components/treenode/TreeNode';

type PropsType = {
    items: Array<TreeNode>,
    getParadocsEditors: getParadocsEditorsType,
    showPopup: boolean,
    editors: Array<ParadocsEditorType>,
    setEditorState: setEditorStateType,
    SaveCurrentEditor: SaveCurrentEditorType
    setEditorEditableState: setEditorEditableStateType
} & DialogFooterPropsType;

type DialogFooterPropsType = {
    DialogOnExit: DialogOnExitType,
    uid: string,
    SaveEditorsOnClick: SaveEditorsOnClickType
}

const DialogFooter = (props: DialogFooterPropsType) => <React.Fragment>
    <Button label="Да" icon="pi pi-check" onClick={() => props.SaveEditorsOnClick()} />
    <Button label="Нет" icon="pi pi-times" onClick={() => props.DialogOnExit()} />
</React.Fragment>;

const Paradocs: React.FC<PropsType> = (props) => {
    if (!props.items.length) { return <Loader nameOfProcess="загружаем меню парадокс" /> }

    return <div className={style.paradocsBodyContainer}>
        <Dialog className={style.paradocsDialog} header="Измененный текст не сохранен" footer={DialogFooter} visible={props.showPopup} modal onHide={() => props.DialogOnExit()}>
            Сохранить измененный текст?
            </Dialog>
        <div className={style.paradocsNavigationPanelContainer} style={{ maxHeight: window.innerHeight - 10 }}>
            <Header SaveEditorsOnClick={props.SaveEditorsOnClick} />
            <Tree
                className={style.paradocsNavigationTree}
                value={props.items}
                selectionMode="single"
                onSelectionChange={function (e) {
                    // @ts-ignore - do not use 'this'
                    if (!props.editorModified) { props.getParadocsEditors(this.node.data.id); }
                    else { props.DialogOnExit(); }
                }} />
        </div>
        <div className={style.paradocsEditorsContainer} style={{ maxHeight: window.innerHeight - 10 }}>
            <Editors
                setEditorEditableState={props.setEditorEditableState}
                DialogOnExit={props.DialogOnExit}
                editors={props.editors}
                uid={props.uid}
                setEditorState={props.setEditorState}
                SaveCurrentEditor={props.SaveCurrentEditor} />
        </div>
    </div>
}

export default Paradocs;