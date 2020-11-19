import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

import Header from './header';

import './Bid.css';
import BidMain from './tabs/BidMain/BidMain';

import Loader from '../../common/Loader/Loader';
import { BidType, BidMetadataType, ErrorType, setNewBidDataType, getBidDataType, setCurrentBidStateType, setBidPropType, setBidSpecType, pushBidButtonType, setNewBidAttachementType, sendBidReplyType, showBidDiscussionDialogType, sendBidDiscussionForUSLineType, createNewBidBaseOnThisBidType } from '../../../redux/reducers/bid-reducer';

import DiscussionChat from '../../libriary/DiscussionChat/DiscussionChat';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import BidConnected from './tabs/ConnectedBidsTable';
import { TabView, TabPanel } from 'primereact/tabview';
import { FaBusinessTime, FaComments } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GoLink } from 'react-icons/go';
import { IoIosAttach } from 'react-icons/io';
import { ParsedQuery } from 'query-string';
import AttachementTable from '../../libriary/AttachementTable/AttachementTable';

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
    sendBidDiscussionForUSLine: sendBidDiscussionForUSLineType,
    queryParams: ParsedQuery
}

const Bid: React.FC<PropsType> = (props) => {

    let toast = useRef<any>(null);

    if (!props.Bid.loaded) { return <Loader nameOfProcess="загружаем данные сделки" /> }

    if (props.NowMessage.detail) {
        toast.current.show(props.NowMessage);
        props.setCurrentBidState('NowMessage', { ...props.NowMessage, detail: '' });
    }

    return (<div className="bid">
        <Toast ref={toast} />
        <Header createNewBidBaseOnThisBid={props.createNewBidBaseOnThisBid} Bid={props.Bid} pushBidButton={props.pushBidButton} />
        <TabView activeIndex={props.queryParams.openTab === 'Discussion' ? 1 : 0}>
            <TabPanel header={<React.Fragment><FaBusinessTime /><span>Основное</span></React.Fragment>}>
                <BidMain sendBidDiscussionForUSLine={props.sendBidDiscussionForUSLine} getBidData={props.getBidData} showBidDiscussionDialog={props.showBidDiscussionDialog} Bid={props.Bid} setBidSpec={props.setBidSpec} setBidProp={props.setBidProp} BidMetadata={props.BidMetadata} pushBidButton={props.pushBidButton} />
            </TabPanel>
            <TabPanel header={<React.Fragment><FaComments /><span>Обсуждения</span></React.Fragment>}>
                <div className='p-col'>
                    <DiscussionChat
                        showAllMessagesButton={true}
                        data={props.Bid.discussionData}
                        sendReply={props.sendBidReply} />
                </div>
            </TabPanel>
            <TabPanel header={<React.Fragment><IoIosAttach /><span>Вложения</span></React.Fragment>}>
                <AttachementTable attachement_links={props.Bid.attachement_links} setNewAttachement={props.setNewBidAttachement} />
            </TabPanel>
            <TabPanel header={<React.Fragment><GoLink /><span>Связанные</span></React.Fragment>}>
                <BidConnected connectedBids={props.Bid.connectedBids} expandedRows={props.Bid.expandedRows} setBidProp={props.setBidProp} />
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