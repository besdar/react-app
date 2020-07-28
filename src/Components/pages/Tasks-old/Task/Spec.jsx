import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";

const Spec = (props) => {

    let totalWeightOfSpec = 0;
    props.Task.specifications.map((el) => { totalWeightOfSpec = totalWeightOfSpec + parseInt(el.weight) });

    if (props.Task.VisibilityAvailability.invisible.find((element) => (element == "ТехническоеЗадание")) != undefined) { return <div></div> }
    else {
        return <div className="p-col">
            <div className="p-col">
                <Button icon="pi pi-plus" onClick={() => props.setTaskSpec()} /> {/* добавить требование */}
                <span>Техническое задание ({totalWeightOfSpec})</span>
            </div>
            {props.Task.specifications.map((el, index) => {
                return <div key={index} className="p-col">
                    <div className="p-grid">
                        <div className="p-col">
                            <div className="p-gtid-col" style={{ textAlign: "center" }}>
                                <div className="p-col" style={{ padding: "0px", margin: 'auto' }}>
                                    {index + 1}
                                </div>
                                <div className="p-col" style={{ padding: "0px", marginTop: ".5em" }}>
                                    <input id={index} style={{ width: "25px", textAlign: "center" }} value={el.weight} onChange={(e) => { props.setTaskSpec(e.target.id, e.target.value, 'weight') }}></input>
                                </div>
                            </div>
                        </div>
                        <div className="p-col">
                            <InputTextarea style={{ width: window.innerWidth / 3 + 'px' }} id={index} value={el.value} onChange={(e) => { props.setTaskSpec(e.target.id, e.target.value, 'value') }} autoResize />
                        </div>
                    </div>
                </div>
            })}
        </div >
    }
}

export default Spec;