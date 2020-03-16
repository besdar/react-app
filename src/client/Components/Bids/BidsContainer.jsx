import React from 'react';
import Bids from './Bids.jsx';
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getBidsList, setCurrentState, sendReply } from "../../redux/reducers/bids-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { withSuspense } from "../../hoc/withSuspense";
// import BidContainer from "./Bid/BidContainer.jsx";

const BidContainer = React.lazy(() => import('./Bid/BidContainer.jsx'));

class BidsContainer extends React.Component {

    componentDidMount() {
        document.title = "Заявки";
        // let nowPath = location.pathname.replace('/bids/', '');
        this.props.getBidsList();
    }

    render() {
        return <Switch>
            <Route path='/bids/:bidNumber'
                render={withSuspense(BidContainer)} />
            <Route exact path='/bids'
                render={() => <Bids 
                    bidsList={this.props.bidsList}
                    messagesList={this.props.messagesList}
                    styleDisplayOfMessages={this.props.styleDisplayOfMessages}
                    current_reply_id={this.props.current_reply_id}
                    sendReply={this.props.sendReply}
                    setCurrentState={this.props.setCurrentState} />} />
        </Switch>
    }
}

let mapStateToProps = (state) => {
    return ({
        bidsList: state.BidsPage.bidsList,
        messagesList: state.BidsPage.messagesList,
        styleDisplayOfMessages: state.BidsPage.styleDisplayOfMessages,
        current_reply_id: state.BidsPage.current_reply_id
    })
}

export default compose(connect(mapStateToProps, {setCurrentState, getBidsList, sendReply}), withRouter)(BidsContainer);