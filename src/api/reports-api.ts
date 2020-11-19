import axios from "axios";
import { ReportInitialStateType } from "../redux/reducers/reports-reducer";

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const ReportsAPI = {
    getReport(reportState: ReportInitialStateType): Promise<string | {reportResult: string}> {return axios.post('/getReport', {reportState: reportState}).then(res => res.data).catch((error) => (error.message))}
}