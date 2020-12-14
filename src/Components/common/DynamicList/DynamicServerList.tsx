import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

interface ColumnData {
    dataKey: string;
    label: string;
}

type RowsType = Array<{ [keys: string]: string | number }>;

type PropsType = {
    fetchData: (page: number) => Promise<RowsType>,
    columns: Array<ColumnData>,
    potion: number,
    componentHeight: number
}

const offset = 0.5; // запас в % снизу после которых начинается загрузка

// const fetchData = (fetchData: (page: number) => Promise<RowsType>, page: number, setListItems: React.Dispatch<React.SetStateAction<RowsType>>, listItems: RowsType, setIsFetching: React.Dispatch<React.SetStateAction<boolean>>) => 

const DynamicServerList: React.FC<PropsType> = (props) => {
    const [listItems, setListItems] = useState([] as RowsType);
    const [isFetching, setIsFetching] = useState(true);
    const [page, setPage] = useState(1);

    // useEffect(() => {
    //     props.fetchData(page).then((result) => {
    //         setListItems([...listItems, ...result]);
    //         //setPage(page + 1);
    //         setIsFetching(true);
    //         //window.addEventListener('scroll', handleScroll);
    //     });
    //     // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
    //     // eslint-disable-next-line 
    // }, []);

    const handleScroll = (el: React.UIEvent<HTMLDivElement>) => {
        const element = el.target as HTMLDivElement;
        if (Math.ceil(props.componentHeight + element.scrollTop) > element.scrollHeight * offset && !isFetching) {
            if (props.componentHeight * 2 < element.scrollTop && listItems.length > 2 * props.potion) {
                element.scrollTop = element.scrollTop - props.componentHeight;
                setListItems(listItems.slice(props.potion));
            }
            setPage(page + 1);
            setIsFetching(true);
        }
    };

    useEffect(() => {
        props.fetchData(page).then((result) => {
            setListItems([...listItems, ...result]);
            setIsFetching(false);
        });
        // ошибка что надо передавать все элементы что есть в теле эффекта (по правилам реакт), но тогда получается бесконечный вызов метода получения порции: 
        // устанавливаем состояние загрузки - срабатывает эффект - загружаем - добавляем новые элементы к существующему массиву (он меняется) - срабатывает эффект - начинается загрузка - ...
        // eslint-disable-next-line 
    }, [page]);

    return <React.Fragment>
        <TableContainer style={{ overflow: 'auto', height: props.componentHeight }} onScroll={handleScroll} component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {props.columns.map((elem) => <TableCell>{elem.label}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listItems.map((row, index) => (
                        <TableRow key={index}>
                            {props.columns.map((elem, ind) => <TableCell key={ind} component="th" scope="row">
                                {row[elem.dataKey]}
                            </TableCell>)}
                        </TableRow>
                    ))}
                    {isFetching && <TableRow>
                        {props.columns.map((elem, ind) => <TableCell key={ind} component="th" scope="row">
                            <Skeleton variant='text' />
                        </TableCell>)}
                    </TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    </React.Fragment >;
};

export default DynamicServerList;
