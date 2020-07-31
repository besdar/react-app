import React from 'react';
import { MessageList } from '../react-chat-elements-master';
import { Input } from '../react-chat-elements-master';
import { Button } from "primereact/button";
import { ScrollPanel } from 'primereact/scrollpanel';
import { discussionDataType, sendBidReplyType } from '../../../redux/reducers/bid-reducer';
import "./DiscussionChat.css";
import { sendBidsReplyType } from '../../../redux/reducers/bids-reducer';

type PropsType = {
    nowReplyMessageId?: string,
    data: discussionDataType,
    onResponseMessageClick?: (element: React.FormEvent) => void,
    sendReply: sendBidReplyType | sendBidsReplyType,
    maxHeight: string,
    showAllMessages: boolean
}

const DiscussionChat: React.FC<PropsType> = (props) => {
    return <div className="p-grid">
            <div className="p-col">
                <ScrollPanel style={{ maxHeight: props.maxHeight }}>
                    <div className="mssg-box">
                        <MessageList showAllMessages={props.showAllMessages} allMesages={true} dataSource={props.data.childs} onResponseMessageClick={props.onResponseMessageClick} />
                        <Input //необходимо реализовать функцию onChange по заветам FLUX
                            placeholder="Введите текст здесь..."
                            multiline={true}
                            child={props.data.childs.find((el) => (
                                // eslint-disable-next-line
                                el.id == props.nowReplyMessageId
                                ))}
                            rightButtons={<Button label='Отправить' id={props.data.id} onClick={(element) => {
                                // @ts-ignore - we need to take it from state. And we need to remove 'react-chat-elements-master' component at all
                                const text = element.currentTarget.parentElement.parentElement.firstElementChild.value;
                                props.sendReply(props.nowReplyMessageId || element.currentTarget.id, text);
                            }} />}
                             />
                    </div>
                </ScrollPanel>
            </div>
        </div>
}

export default DiscussionChat;