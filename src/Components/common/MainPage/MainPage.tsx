import React from 'react';
import LinkList from './LinkList';

type PropsType = {}

const MainPage: React.FC<PropsType> = (props) => {
    return <div>
        <h1>Projector</h1>
        <LinkList />
    </div>
}

export default MainPage;