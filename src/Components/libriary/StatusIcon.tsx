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
    let icon = <FaCircle title={props.status} size={props.size} />;

    let status = props.status.toLowerCase().replace(' ', '');

    if (status === "приостановлена") { icon = <FaPauseCircle title={props.isHeader ? props.status : "Приостановить"} size={props.size} /> }
    else if (status === "вработе") { icon = <FaPlayCircle title={props.isHeader ? "В работе" : "Взять в работу"} size={props.size} /> }
    else if (status === "заявка") { icon = <FaCircle title={props.status} size={props.size} /> }
    else if (status === "выполнена") { icon = <FaCheckCircle title={props.status} size={props.size} /> }
    else if (status === "натестировании") { icon = <GiPunchBlast title={props.isHeader ? "На тестировании" : "Передать на тестирование"} size={props.size} /> }
    else if (status === "требуетсядоработка") { icon = <GoGitCompare title={"Требуется доработка"} size={props.size} /> }
    else if (status === "готовкавтотесту") { icon = <GoGitPullRequest title={"Готов к автотесту"} size={props.size} /> }
    else if (status === "релизкандидат") { icon = <FaReddit title={"Релиз кандидат"} size={props.size} /> }
    else if (status === "отменена") { icon = <GoCircleSlash title={props.isHeader ? props.status : "Отменить"} size={props.size} /> }
    else if (status === "принятазаказчиком") { icon = <GoThumbsup title={"Принята заказчиком"} size={props.size} /> }
    else if (status === "сформирована") { icon = <GoGitBranch title={props.status} size={props.size} /> }
    else if (status === "отложена") { icon = <BsStopwatch title={props.isHeader ? props.status : "Отложить"} size={props.size} /> }
    else if (status === "внедрение") { icon = <GiPush title={props.status} size={props.size} /> }
    else if (status === "ожидаетсвязанных") { icon = <GoLink title={"Ожидает связанных"} size={props.size} /> }
    else if (status === "обсуждение") { icon = <FaComments title={"Обсуждение"} size={props.size} /> }
    else if (status === "тестированиезаказчиком") { icon = <GoCloudUpload title={"Тестирование заказчиком"} size={props.size} /> }

    return icon
}

export default React.memo(StatusIcon);