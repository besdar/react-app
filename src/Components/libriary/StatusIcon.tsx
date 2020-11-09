import React from "react";
import {
    FaCircle,
    FaCheckCircle,
    FaPauseCircle,
    FaPlayCircle,
    FaReddit,
    FaComments
} from "react-icons/fa";
import { GiPunchBlast, GiPush } from 'react-icons/gi';
import { BsStopwatch } from 'react-icons/bs';
import { GoGitCompare, GoGitPullRequest, GoCircleSlash, GoThumbsup, GoGitBranch, GoLink, GoCloudUpload } from 'react-icons/go';

type PropsType = {
    isHeader: boolean,
    status: string,
    size: string
}

const StatusIcon: React.FC<PropsType> = (props) => {

    const status = props.status.toLowerCase().replace(' ', '');

    if (status === "приостановлена") { return <FaPauseCircle title={props.isHeader ? props.status : "Приостановить"} size={props.size} /> }
    else if (status === "вработе") { return <FaPlayCircle title={props.isHeader ? "В работе" : "Взять в работу"} size={props.size} /> }
    else if (status === "заявка") { return <FaCircle title={props.status} size={props.size} /> }
    else if (status === "выполнена") { return <FaCheckCircle title={props.status} size={props.size} /> }
    else if (status === "натестировании") { return <GiPunchBlast title={props.isHeader ? "На тестировании" : "Передать на тестирование"} size={props.size} /> }
    else if (status === "требуетсядоработка") { return <GoGitCompare title={"Требуется доработка"} size={props.size} /> }
    else if (status === "готовкавтотесту") { return <GoGitPullRequest title={"Готов к автотесту"} size={props.size} /> }
    else if (status === "релизкандидат") { return <FaReddit title={"Релиз кандидат"} size={props.size} /> }
    else if (status === "отменена") { return <GoCircleSlash title={props.isHeader ? props.status : "Отменить"} size={props.size} /> }
    else if (status === "принятазаказчиком") { return <GoThumbsup title={"Принята заказчиком"} size={props.size} /> }
    else if (status === "сформирована") { return <GoGitBranch title={props.status} size={props.size} /> }
    else if (status === "отложена") { return <BsStopwatch title={props.isHeader ? props.status : "Отложить"} size={props.size} /> }
    else if (status === "внедрение") { return <GiPush title={props.status} size={props.size} /> }
    else if (status === "ожидаетсвязанных") { return <GoLink title={"Ожидает связанных"} size={props.size} /> }
    else if (status === "обсуждение") { return <FaComments title={"Обсуждение"} size={props.size} /> }
    else if (status === "тестированиезаказчиком") { return <GoCloudUpload title={"Тестирование заказчиком"} size={props.size} /> }
    else {return <FaCircle title={props.status} size={props.size} />}
}

export default React.memo(StatusIcon);