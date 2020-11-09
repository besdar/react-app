import React from 'react';
import Bid from './Bid';
import { connect } from "react-redux";
import { setCurrentBidState, setBidProp, setBidSpec, pushBidButton, getBidData, setNewBidData, setNewBidAttachement, sendBidReply, showBidDiscussionDialog, createNewBidBaseOnThisBid, sendBidDiscussionForUSLine, setNewBidDataType, getBidDataType, setCurrentBidStateType, setBidPropType, setBidSpecType, pushBidButtonType, setNewBidAttachementType, sendBidReplyType, showBidDiscussionDialogType, sendBidDiscussionForUSLineType, createNewBidBaseOnThisBidType } from "../../../redux/reducers/bid-reducer";
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
    sendBidDiscussionForUSLine: sendBidDiscussionForUSLineType
}

type PathParamsType = {
    bidNumber: string
}

type PropsType = MapPropsType & DispatchPropsType & RouteComponentProps<PathParamsType>;

class BidContainer extends React.Component<PropsType> {

    componentDidMount() {
        document.title = "Заявка";
        if (!isNaN(parseInt(this.props.match.params.bidNumber))) {this.props.getBidData(this.props.match.params.bidNumber)}
        else {this.props.setNewBidData()}
    }

    //componentDidUpdate() {
        // if (this.props.fistInit === true) {
        //     window.setTimeout(resize, 0.1); //бага веба, нужно разобраться почему scrollHeight браузером при первом открытии вычисляется неверно
            //this.props.setCurrentBidState('fistInit', false);
        // }  
    //}

    render() {
        return <Bid Bid={this.props.Bid}
                BidMetadata={this.props.BidMetadata}
                setBidProp={this.props.setBidProp}
                setBidSpec={this.props.setBidSpec}
                pushBidButton={this.props.pushBidButton}
                setCurrentBidState={this.props.setCurrentBidState}
                NowMessage={this.props.NowMessage}
                setNewBidAttachement={this.props.setNewBidAttachement}
                sendBidReply={this.props.sendBidReply}
                showBidDiscussionDialog={this.props.showBidDiscussionDialog}
                getBidData={this.props.getBidData}
                createNewBidBaseOnThisBid={this.props.createNewBidBaseOnThisBid}
                sendBidDiscussionForUSLine={this.props.sendBidDiscussionForUSLine}
                setNewBidData={this.props.setNewBidData}
                queryParams={queryString.parse(this.props.location.search)} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        Bid: state.BidPage.Bid,
        BidMetadata: state.BidPage.BidMetadata,
        NowMessage: state.BidPage.NowMessage,
        fistInit: state.BidPage.Bid.fistInit
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, {setCurrentBidState, setBidProp, setBidSpec, pushBidButton, getBidData, setNewBidData, setNewBidAttachement, sendBidReply, showBidDiscussionDialog, createNewBidBaseOnThisBid, sendBidDiscussionForUSLine}), withRouter)(BidContainer);