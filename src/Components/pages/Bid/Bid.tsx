import React, { useRef } from 'react';
import { Growl } from 'primereact/growl';

import Header from './header';

import './Bid.css';
import BidMain from './tabs/BidMain/BidMain';

import Loader from '../../common/Loader/Loader';
import { BidType, BidMetadataType, attachementItemType, ErrorType, setNewBidDataType, getBidDataType, setCurrentBidStateType, setBidPropType, setBidSpecType, pushBidButtonType, setNewBidAttachementType, sendBidReplyType, showBidDiscussionDialogType, sendBidDiscussionForUSLineType, createNewBidBaseOnThisBidType } from '../../../redux/reducers/bid-reducer';

import DiscussionChat from '../../libriary/DiscussionChat/DiscussionChat';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import BidConnected from './tabs/BidConnected';
import { TabView, TabPanel } from 'primereact/tabview';
import { FaBusinessTime, FaComments } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GoLink } from 'react-icons/go';
import { IoIosAttach } from 'react-icons/io';
import { ToggleButton } from 'primereact/togglebutton';

type PropsType = {
    Bid: BidType,
    NowMessage: ErrorType,
    BidMetadata: BidMetadataType,
    setNewBidData: setNewBidDataType,
    getBidData: getBidDataType,
    setCurrentBidState: setCurrentBidStateType,
    setBidProp: setBidPropType,
    setBidSpec: setBidSpecType,
    pushBidButton: pushBidButtonType,
    setNewBidAttachement: setNewBidAttachementType,
    sendBidReply: sendBidReplyType,
    showBidDiscussionDialog: showBidDiscussionDialogType,
    createNewBidBaseOnThisBid: createNewBidBaseOnThisBidType,
    sendBidDiscussionForUSLine: sendBidDiscussionForUSLineType

}

const linkTemplate = (el: attachementItemType) => (<a rel="noopener noreferrer" target="_blank" href={el.link}>{el.value}</a>)

function uploadFile(event: any, setNewBidAttachement: (attachement: attachementItemType, attachement_link: attachementItemType) => void) {
    let reader = new FileReader();
    // @ts-ignore - cannot define types of it now
    reader.onload = (function (theFile) { return function (el) { setNewBidAttachement({ data: el.target.result, filename: theFile.name }, { link: theFile.url, value: theFile.name }) }; })({ name: event.files[0].name, url: event.files[0].objectURL });
    reader.readAsDataURL(event.files.pop());
    // @ts-ignore - error 'object possibly be null'
    document.getElementById("file_upload").firstElementChild.lastElementChild.style.display = 'inline'; //its work of primereact, but why do they think i need it to do!??
}

const Bid: React.FC<PropsType> = (props) => {

    let growl = useRef<any>(null);

    if (!props.Bid.loaded) { return <Loader nameOfProcess="загружаем данные сделки" /> }

    if (props.NowMessage.detail !== '') {
        // @ts-ignore - i don't know how to define 'GrowlMetod' type
        growl.current.show(props.NowMessage);
        props.setCurrentBidState('NowMessage', { ...props.NowMessage, detail: '' });
    }

    let attachementHeader = <React.Fragment><h3>Вложения</h3><div id="file_upload">
        <FileUpload chooseLabel='Выбрать файл' mode="basic" name="upload" maxFileSize={500000} auto={true} customUpload={true} uploadHandler={(e: any) => uploadFile(e, props.setNewBidAttachement)} />
        <sup className="badge">{props.Bid.attachement_links.length}</sup>
    </div></React.Fragment>;

    return (<div className="bid">
        <Growl ref={growl} />
        <Header createNewBidBaseOnThisBid={props.createNewBidBaseOnThisBid} Bid={props.Bid} pushBidButton={props.pushBidButton} />
        <TabView>
            <TabPanel header={<React.Fragment><FaBusinessTime /><span>Основное</span></React.Fragment>}>
                <BidMain sendBidDiscussionForUSLine={props.sendBidDiscussionForUSLine} getBidData={props.getBidData} showBidDiscussionDialog={props.showBidDiscussionDialog} Bid={props.Bid} setBidSpec={props.setBidSpec} setBidProp={props.setBidProp} BidMetadata={props.BidMetadata} pushBidButton={props.pushBidButton} />
            </TabPanel>
            <TabPanel header={<React.Fragment><FaComments /><span>Обсуждения</span></React.Fragment>}>
                <ToggleButton checked={props.Bid.showAllDiscussionMessages} onLabel='Все' offLabel='Только актуальные' onChange={() => props.setBidProp('showAllDiscussionMessages', !props.Bid.showAllDiscussionMessages)} />
                <DiscussionChat
                    showAllMessages={props.Bid.showAllDiscussionMessages}
                    maxHeight='none'
                    data={props.Bid.discussionData}
                    nowReplyMessageId={props.Bid.nowReplyMessageId}
                    // @ts-ignore - error: property 'target' does not exist on type HTMLElement
                    onResponseMessageClick={(e) => { props.setBidProp('nowReplyMessageId', e.target.id) }}
                    sendReply={props.sendBidReply} />
            </TabPanel>
            <TabPanel header={<React.Fragment><IoIosAttach /><span>Вложения</span></React.Fragment>}>
                <DataTable value={props.Bid.attachement_links}>
                    <Column header={attachementHeader} body={linkTemplate} />
                </DataTable>
            </TabPanel>
            <TabPanel header={<React.Fragment><GoLink /><span>Связанные</span></React.Fragment>}>
                <BidConnected connectedBids={props.Bid.connectedBids} expandedRows={props.Bid.expandedRows} sendBidReply={props.sendBidReply} setBidProp={props.setBidProp} />
            </TabPanel>
            <TabPanel header={<React.Fragment><FiUsers /><span>Наблюдатели</span></React.Fragment>}>
                <DataTable value={props.Bid.linkedPeople}>
                    <Column field="value" header={"Наблюдатели"} />
                    <Column field="link" header={"Email"} />
                </DataTable>
            </TabPanel>
        </TabView>
    </div>)
};

export default React.memo(Bid);