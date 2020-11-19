import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import React from 'react';
import { FaFileDownload } from 'react-icons/fa';
import './AttachementTable.css';

export type attachementItemType = {
    link: string,
    value: string,
    preview: string
}

const linkTemplate = (el: attachementItemType, iframeRef: React.RefObject<HTMLIFrameElement>) => {
    return <div className="attachement_file_row">
        <span onClick={() => {iframeRef.current?.setAttribute('src', el.preview)}}>{el.value}</span>
        <span onClick={() => window.open(el.link)}><FaFileDownload title="Скачать" /></span>
    </div>
}


const uploadFile = (event: any, setNewAttachement: setNewAttachementType) => {
    let reader = new FileReader();
    // @ts-ignore - cannot define types of it now
    reader.onload = (function (theFile) { return function (el) { setNewAttachement({ data: el.target.result, filename: theFile.name }, { link: theFile.url, value: theFile.name, preview: theFile.url }) }; })({ name: event.files[0].name, url: event.files[0].objectURL });
    reader.readAsDataURL(event.files.pop());
    // @ts-ignore - error 'object possibly be null'
    document.getElementById("file_upload").firstElementChild.lastElementChild.style.display = 'inline'; //its work of primereact, but why do they think i need it to do!??
}

type setNewAttachementType = (attachement: attachementItemType, attachement_link: attachementItemType) => void

type PropsType = {
    attachement_links: Array<attachementItemType>,
    setNewAttachement: setNewAttachementType
}

const AttachementHeader = (props: {attachement_links_length: number, setNewAttachement: setNewAttachementType}) => <React.Fragment>
    <h3>Вложения</h3>
    <div id="file_upload">
        <FileUpload chooseLabel='Выбрать файл' mode="basic" name="upload" maxFileSize={500000} auto={true} customUpload={true} uploadHandler={(e: any) => uploadFile(e, props.setNewAttachement)} />
        <sup className="badge">{props.attachement_links_length}</sup>
    </div>
</React.Fragment>;

const AttachementTable: React.FC<PropsType> = (props) => {
    let iframeRef = React.createRef<HTMLIFrameElement>();
    
    return <React.Fragment>
    <DataTable value={props.attachement_links}>
        <Column header={<AttachementHeader attachement_links_length={props.attachement_links.length} setNewAttachement={props.setNewAttachement} />} body={(el: attachementItemType) => linkTemplate(el, iframeRef)} />
    </DataTable>
    <iframe id="attachement_preview_iframe" title='Предпросмотр вложения' ref={iframeRef} src=""></iframe>
    </React.Fragment>
}

export default React.memo(AttachementTable);