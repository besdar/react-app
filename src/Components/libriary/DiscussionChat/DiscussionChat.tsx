import React, { useState } from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import "./DiscussionChat.css";
import { InputTextarea } from 'primereact/inputtextarea';
import { FiSend } from 'react-icons/fi';
import { ToggleButton } from 'primereact/togglebutton';

export type discussionDataType = {
    id: string,
    childs: Array<discussionDataItem>
};

export type discussionDataItem = {
    id: string,
    dateString: string,
    text: string,
    title: string,
    type: string,
    position: 'left' | 'right',
    titleColor: string,
    isActual: boolean
}

type PropsType = {
    data: discussionDataType,
    sendReply: (id: string, text: string) => void,
    maxHeight?: string,
    showAllMessagesButton?: boolean
}

const DiscussionChat: React.FC<PropsType> = (props) => {

    const [state, setState] = useState({
        currentReplyMessage: '',
        showAllMessages: true,
        nowReplyMessageId: ''
    });

    const replyElement = props.data.childs.find((el) => (el.id === state.nowReplyMessageId));

    const messagesList = props.data.childs.map((element, index) => {
        return <div className={'msg-container ' + (element.position === 'left' ? ' leftDiscussionMessage' : ' rightDiscussionMessage')} key={index} >
            <div key={index} className='msg-content'>
                <div key={index} className='msg-title' style={{ WebkitTextStrokeColor: element.titleColor }}>{element.title}</div>
                <div key={index} className='msg-text'>{element.text}</div>
                <div key={index} className='msg-footer'>
                    <div key={index} className='msg-reply-btn' onClick={() => setState({ ...state, nowReplyMessageId: element.id })}>Ответить</div>
                    <div key={index} className='msg-date'>{element.dateString}</div>
                </div>
            </div>
        </div>
    });

    return <div className="p-grid-col">
        {props.showAllMessagesButton && <div className='p-col'>
            <ToggleButton checked={!state.showAllMessages} onLabel='Все' offLabel='Только актуальные' onChange={() => setState({ ...state, showAllMessages: !state.showAllMessages })} />
        </div>}
        <div className="p-col">
            <ScrollPanel style={{ maxHeight: props.maxHeight || 'none' }}>
                <div className="mssg-box">
                    <div className='msg-list discussionMessageList'>
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
                        <InputTextarea className="discussionInputTextarea" autoResize placeholder="Введите текст здесь..." value={state.currentReplyMessage} onChange={(e) => setState({ ...state, currentReplyMessage: e.currentTarget.value })} />
                        <div className='send-bttn' id={props.data.id} onClick={(element) => {
                            props.sendReply(state.nowReplyMessageId || (!replyElement ? '' : replyElement.id), state.currentReplyMessage);
                            setState({
                                ...state,
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

export default React.memo(DiscussionChat);