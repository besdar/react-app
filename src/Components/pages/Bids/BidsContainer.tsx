import React, { useLayoutEffect } from 'react';
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

const BidsContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        props.getBidsList();
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    return <Bids
        bidsList={props.bidsList}
        messagesList={props.messagesList}
        styleDisplayOfMessages={props.styleDisplayOfMessages}
        sendBidsReply={props.sendBidsReply}
        setBidsCurrentState={props.setBidsCurrentState}
        projectSelectItems={props.projectSelectItems}
        selectedProjectSelectItems={props.selectedProjectSelectItems} />
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