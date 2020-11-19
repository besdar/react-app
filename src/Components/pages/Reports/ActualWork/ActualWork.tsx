import React from 'react';
import { DatePicker } from "@material-ui/pickers";
import { changeStatePropType } from '../../../../redux/reducers/reports-reducer';

type PropsType = {
  dateEnd: Date,
  dateStart: Date,
  changeStateProp: changeStatePropType
}

const ActualWork: React.FC<PropsType> = (props) => {
  return <React.Fragment>
    <DatePicker
      label="Дата начала"
      value={props.dateStart}
      onChange={(e) => props.changeStateProp('dateStart', e?.toDate() as Date)}
    />
    <DatePicker
      style={{marginLeft: 10}}
      label="Дата окончания"
      value={props.dateEnd}
      onChange={(e) => props.changeStateProp('dateEnd', e?.toDate() as Date)}
    />
  </React.Fragment>
}

export default ActualWork;