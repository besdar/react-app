import React from 'react';
import Bids from './Bids';
import { connect } from "react-redux";
import { getBidsList, setBidsCurrentState, sendBidsReply, projectSelectType, getBidsListType, sendBidsReplyType, setBidsCurrentStateType } from "../../../redux/reducers/bids-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getBidsList: getBidsListType,
    sendBidsReply: sendBidsReplyType,
    setBidsCurrentState: setBidsCurrentStateType,
    selectedProjectSelectItems: Array<projectSelectType>,
    projectSelectItems: Array<projectSelectType>
}

type PropsType = MapPropsType & DispatchPropsType;

class BidsContainer extends React.Component<PropsType> {

    componentDidMount() {
        document.title = "Заявки";
        this.props.getBidsList();
    }

    render() {
        return <Bids
            bidsList={this.props.bidsList}
            messagesList={this.props.messagesList}
            styleDisplayOfMessages={this.props.styleDisplayOfMessages}
            sendBidsReply={this.props.sendBidsReply}
            setBidsCurrentState={this.props.setBidsCurrentState}
            projectSelectItems={this.props.projectSelectItems}
            selectedProjectSelectItems={this.props.selectedProjectSelectItems} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        bidsList: state.BidsPage.bidsList,
        messagesList: state.BidsPage.messagesList,
        styleDisplayOfMessages: state.BidsPage.styleDisplayOfMessages,
        projectSelectItems: state.BidsPage.projectSelectItems,
        selectedProjectSelectItems: state.BidsPage.selectedProjectSelectItems
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { setBidsCurrentState, getBidsList, sendBidsReply }), withRouter)(BidsContainer);