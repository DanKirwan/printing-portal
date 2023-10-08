import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { FC } from 'react';
import { PartOrder } from '../lib/types';
import DetailedPartRow from './DetailedPartRow';



interface Props {
    parts: PartOrder[];
    onClick: (index: number) => void;
}


const DetailedPartOrderEditor: FC<Props> = ({ parts, onClick }) => {

    return <Table stickyHeader>
        <TableHead >
            <TableRow>
                <TableCell align="left" ></TableCell>
                <TableCell align="left" >Summary</TableCell>
                <TableCell align="left">Notes</TableCell>
                <TableCell align="center">Quantity</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {parts.map((part, i) => (
                <DetailedPartRow key={i} part={part} onClick={() => onClick(i)} />
            ))}
        </TableBody>
    </Table>
}

export default DetailedPartOrderEditor;