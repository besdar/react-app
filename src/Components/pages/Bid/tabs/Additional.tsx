import React from 'react';
// import DiscussionChat from '../../DiscussionChat/DiscussionChat';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { BidType, attachementItemType, connectedBidsItem } from '../../../redux/reducers/bid-reducer';

// function linkTemplate(el: attachementItemType) { return <a rel="noopener noreferrer" target="_blank" href={el.link}>{el.value}</a> }
// function rowExpansionTemplate(el: connectedBidsItem) {
//     return (<div className="p-grid-col">{el.childrens.map((elem, index) => (<div className="p-grid">
//         <div style={{
//             alignItems: 'center',
//             display: 'flex',
//             justifyContent: 'center'
//         }} className={"p-col-1"}>{index + 1}</div>
//         <div className="p-col">{elem}</div>
//     </div>))}</div>)
// }
// function showAdditionalColumn() {
//     let columns = [];
//     if (window.innerWidth > 1030) {
//         columns = [
//             { field: '', header: '', expander: true },
//             { field: 'number', header: 'Номер', expander: false },
//             { field: 'name', header: 'Наименование', expander: false },
//             { field: 'project', header: 'Проект', expander: false },
//             { field: 'author', header: 'Автор', expander: false },
//             { field: 'time', header: 'Продолжительность', expander: false },
//             { field: 'type', header: 'Тип', expander: false },
//             { field: 'basement', header: 'Основание', expander: false },
//             { field: 'status', header: 'Статус', expander: false }
//         ];
//     }
//     else {
//         columns = [
//             { field: '', header: '', expander: true },
//             { field: 'number', header: 'Номер', expander: false },
//             { field: 'name', header: 'Наименование', expander: false },
//             { field: 'project', header: 'Проект', expander: false },
//             { field: 'status', header: 'Статус', expander: false }
//         ];
//     }
//     return columns.map((el, index) => {
//         if (el.expander) { return <Column key={index} expander={true} style={{ width: '3em' }} /> }
//         else { return <Column key={index} field={el.field} header={el.header} /> }
//     })
// }

// type PropsType = {
//     Bid: BidType,
//     setBidProp: (property: string, value: any) => void,
//     sendBidReply: (id: string, text: string) => void,
//     setNewBidAttachement: (attachement: attachementItemType, attachement_link: attachementItemType) => void)
// }

// const Additional: React.FC<PropsType> = React.memo((props) => {

    

//     return (<React.Fragment>
//         {props.Bid.discussionData.childs.length !== 0 && <DiscussionChat
//             maxHeight='none'
//             data={props.Bid.discussionData}
//             nowReplyMessageId={props.Bid.nowReplyMessageId}
//             // @ts-ignore - error: property 'target' does not exist on type HTMLElement
//             onResponseMessageClick={(e) => { props.setBidProp('nowReplyMessageId', e.target.id) }}
//             sendBidReply={props.sendBidReply} />}
//         <div className="p-grid-col">
//             <div className="p-col">
//                 <DataTable value={props.Bid.attachement_links}>
//                     <Column header={"Вложения"} body={linkTemplate} />
//                 </DataTable>
//             </div>
//             <div className="p-col">
//                 <DataTable header="Связанные заявки" value={props.Bid.connectedBids} expandedRows={props.Bid.expandedRows} onRowToggle={(e) => props.setBidProp('expandedRows', e.data)}
//                     rowExpansionTemplate={rowExpansionTemplate} dataKey="number">
//                     {showAdditionalColumn()}
//                 </DataTable>
//             </div>
//             <div className="p-col">
//                 <DataTable value={props.Bid.linkedPeople}>
//                     <Column header={"Наблюдатели"} body={linkTemplate} />
//                 </DataTable>
//             </div>
//         </div>
//     </React.Fragment>);
// })

// export default Additional;