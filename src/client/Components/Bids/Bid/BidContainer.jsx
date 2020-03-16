import React from 'react';
import Bid from './Bid.jsx';
import { connect } from "react-redux";
import { setCurrentState, setBidProp, setBidSpec, pushButton, setUserStory, getBidData, setNewBidData, setNewAttachement } from "../../../redux/reducers/bids-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import {Growl} from 'primereact/growl';

function resize() {
    let elements = document.getElementsByClassName('p-inputtextarea');
    Array.from(elements).forEach((el) => {
        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
    });
}

class BidContainer extends React.Component {

    componentDidMount() {
        document.title = "Заявка";
        if (!isNaN(this.props.match.params.bidNumber)) {this.props.getBidData(this.props.match.params.bidNumber)}
        else {this.props.setNewBidData()}
    }

    componentDidUpdate() {
        if (this.props.fistInit == true) {
            window.setTimeout(resize, 0.1); //бага веба, нужно разобраться почему scrollHeight браузером при первом открытии вычисляется неверно
            this.props.setCurrentState('fistInit', false);
        }  
    }

    render() {
        return <React.Fragment>
                <Bid Bid={this.props.Bid}
                BidMetadata={this.props.BidMetadata}
                setBidProp={this.props.setBidProp}
                setBidSpec={this.props.setBidSpec}
                setUserStory={this.props.setUserStory}
                pushButton={this.props.pushButton}
                setCurrentState={this.props.setCurrentState}
                NowMessage={this.props.NowMessage}
                GrowlMetod={this.growl}
                setNewAttachement={this.props.setNewAttachement} />
                <Growl ref={(el) => this.growl = el}></Growl>
            </React.Fragment>
    }
}

let mapStateToProps = (state) => {
    return ({
        Bid: state.BidsPage.Bid,
        BidMetadata: state.BidsPage.BidMetadata,
        NowMessage: state.BidsPage.NowMessage,
        fistInit: state.BidsPage.fistInit
    })
}

export default compose(connect(mapStateToProps, {setCurrentState, setBidProp, setUserStory, setBidSpec, pushButton, getBidData, setNewBidData, setNewAttachement}), withRouter)(BidContainer);