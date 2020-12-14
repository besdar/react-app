import React, { useLayoutEffect } from 'react';
import Bid from './Bid';
import { connect } from "react-redux";
import { setCurrentBidState, setBidProp, setBidSpec, pushBidButton, toggleBidSpec, getBidData, setNewBidData, setNewBidAttachement, sendBidReply, showBidDiscussionDialog, createNewBidBaseOnThisBid, sendBidDiscussionForUSLine, setNewBidDataType, getBidDataType, setCurrentBidStateType, setBidPropType, setBidSpecType, pushBidButtonType, setNewBidAttachementType, sendBidReplyType, showBidDiscussionDialogType, sendBidDiscussionForUSLineType, createNewBidBaseOnThisBidType, toggleBidSpecType } from "../../../redux/reducers/bid-reducer";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { compose } from "redux";
import {AppStateType} from '../../../redux/store/redux-store';
import queryString from 'query-string';

// function resize() {
//     let elements = document.getElementsByClassName('p-inputtextarea') as HTMLCollectionOf<HTMLElement>;
//     Array.from(elements).forEach((el: HTMLElement) => {
//         el.style.height = el.scrollHeight + 'px';
//         el.style.overflow = 'hidden';
//     });
// }

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
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
    toggleBidSpec: toggleBidSpecType
}

type PathParamsType = {
    bidNumber: string
}

type PropsType = MapPropsType & DispatchPropsType & RouteComponentProps<PathParamsType>;

const BidContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        if (!isNaN(parseInt(props.match.params.bidNumber))) {props.getBidData(props.match.params.bidNumber)}
        else {props.setNewBidData()}
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    //componentDidUpdate() {
        // if (props.fistInit === true) {
        //     window.setTimeout(resize, 0.1); //бага веба, нужно разобраться почему scrollHeight браузером при первом открытии вычисляется неверно
            //props.setCurrentBidState('fistInit', false);
        // }  
    //}

    return <Bid Bid={props.Bid}
                BidMetadata={props.BidMetadata}
                setBidProp={props.setBidProp}
                setBidSpec={props.setBidSpec}
                pushBidButton={props.pushBidButton}
                setCurrentBidState={props.setCurrentBidState}
                NowMessage={props.NowMessage}
                setNewBidAttachement={props.setNewBidAttachement}
                sendBidReply={props.sendBidReply}
                showBidDiscussionDialog={props.showBidDiscussionDialog}
                getBidData={props.getBidData}
                createNewBidBaseOnThisBid={props.createNewBidBaseOnThisBid}
                sendBidDiscussionForUSLine={props.sendBidDiscussionForUSLine}
                setNewBidData={props.setNewBidData}
                toggleBidSpec={props.toggleBidSpec}
                queryParams={queryString.parse(props.location.search)} />
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        Bid: state.BidPage.Bid,
        BidMetadata: state.BidPage.BidMetadata,
        NowMessage: state.BidPage.NowMessage,
        fistInit: state.BidPage.Bid.fistInit
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, {setCurrentBidState, toggleBidSpec, setBidProp, setBidSpec, pushBidButton, getBidData, setNewBidData, setNewBidAttachement, sendBidReply, showBidDiscussionDialog, createNewBidBaseOnThisBid, sendBidDiscussionForUSLine}), withRouter)(BidContainer);