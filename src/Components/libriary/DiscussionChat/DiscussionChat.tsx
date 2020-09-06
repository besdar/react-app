import React from 'react';
//import { MessageList } from '../react-chat-elements-master/MessageList/MessageList';
//import { Button } from "primereact/button";
import { ScrollPanel } from 'primereact/scrollpanel';
import { discussionDataType, sendBidReplyType } from '../../../redux/reducers/bid-reducer';
import "./DiscussionChat.css";
import { sendBidsReplyType } from '../../../redux/reducers/bids-reducer';
import { InputTextarea } from 'primereact/inputtextarea';
import { FiSend } from 'react-icons/fi';
import { ToggleButton } from 'primereact/togglebutton';

type PropsType = {
    data: discussionDataType,
    sendReply: sendBidReplyType | sendBidsReplyType,
    maxHeight: string,
    showAllMessagesButton?: boolean
}

type StateType = {
    currentReplyMessage: string,
    showAllMessages: boolean,
    nowReplyMessageId: string
}

class DiscussionChat extends React.Component<PropsType, StateType> {

    constructor(props: any) {
        super(props);
        this.state = {
            currentReplyMessage: '',
            showAllMessages: true,
            nowReplyMessageId: ''
        }
    }

    render() {

        const replyElement = this.props.data.childs.find((el) => (el.id === this.state.nowReplyMessageId));

        const messagesList = this.props.data.childs.map((element, index) => {
            return <div className='msg-container' key={index} style={{ float: element.position, borderRadius: element.position === 'left' ? '20px 20px 20px 0' : '20px 20px 0 20px' }}>
                <div className='msg-content'>
                    <div className='msg-title' style={{ WebkitTextStrokeColor: element.titleColor }}>{element.title}</div>
                    <div className='msg-text'>{element.text}</div>
                    <div className='msg-footer'>
                        <div className='msg-reply-btn' onClick={() => this.setState({ ...this.state, nowReplyMessageId: element.id })}>Ответить</div>
                        <div className='msg-date'>{element.dateString}</div>
                    </div>
                </div>
            </div>
        });

        return <div className="p-grid-col">
            {this.props.showAllMessagesButton && <div className='p-col'>
                <ToggleButton checked={!this.state.showAllMessages} onLabel='Все' offLabel='Только актуальные' onChange={() => this.setState({ ...this.state, showAllMessages: !this.state.showAllMessages })} />
            </div>}
            <div className="p-col">
                <ScrollPanel style={{ maxHeight: this.props.maxHeight }}>
                    <div className="mssg-box">
                        <div className='msg-list'>
                            {messagesList}
                        </div>

                        {replyElement && <div className='msg-reply-container'>
                            <div className='msg-title' style={{ WebkitTextStrokeColor: replyElement.titleColor }}>{replyElement.title}</div>
                            <div className='msg-text'>{replyElement.text}</div>
                            <div className='msg-footer'>
                                <div className='msg-date'>{replyElement.dateString}</div>
                            </div>
                        </div>}

                        <div className="send-inputgroup">
                            <InputTextarea autoResize placeholder="Введите текст здесь..." value={this.state.currentReplyMessage} onChange={(e) => this.setState({ ...this.state, currentReplyMessage: e.currentTarget.value })} />
                            <div className='send-bttn' id={this.props.data.id} onClick={(element) => {
                                this.props.sendReply(this.state.nowReplyMessageId || (replyElement === undefined ? '' : replyElement.id), this.state.currentReplyMessage);
                                this.setState({
                                    ...this.state,
                                    currentReplyMessage: '',
                                    nowReplyMessageId: ''
                                })
                            }}>
                                <FiSend title='Отправить' size='2em' />
                            </div>
                        </div>
                    </div>
                </ScrollPanel>
            </div>
        </div>
    }

}

export default DiscussionChat;