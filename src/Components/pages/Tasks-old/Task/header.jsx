import React from 'react';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { FileUpload } from 'primereact/fileupload';

const Header = (props) => {
    
    return <div className="p-grid">
    <div className="p-col">
        <h1 style={{ margin: "0px" }}>Задача №{props.Task.number}</h1>
    </div>
    <div className="p-col head_buttons" style={{ textAlign: "right" }}>
        <div id="file_upload" style={{ display: "inline-flex" }}>
            <FileUpload mode="basic" name="upload" maxFileSize={500000} auto={true} customUpload={true} uploadHandler={function (event) {
                let reader = new FileReader();
                reader.onload = (function (theFile) { return function (el) { props.setNewAttachement({ data: el.target.result, filename: theFile.name }, {link: theFile.url, value: theFile.name}) }; })({name: event.files[0].name, url: event.files[0].objectURL});
                reader.readAsDataURL(event.files.pop());
                document.getElementById("file_upload").firstElementChild.lastElementChild.style.display = 'inline'; //its work of primereact, but why do they think i need it to do!??
            }} />
            <sup className="badge">{props.Task.attachement_links.length}</sup>
        </div>
        <Button style={{ display: "inline-flex" }} icon="pi pi-save" onClick={() => props.pushButton('Сохранить')} /> {/* сохранить */}
        <Link style={{ display: "inline-flex" }} to='/tasks'><Button icon="pi pi-arrow-left" /></Link>  {/* назад */}
    </div>
</div>
}

export default Header;