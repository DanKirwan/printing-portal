import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { FC } from 'react';
import { PartOrder } from '../lib/types';
import DetailedPartRow from './DetailedPartRow';
import DetailedPartRowEditor from './DetailedPartRowEditor';
import ModelPreview from './ModelPreview';



interface Props {
    parts: PartOrder[];
    onChange: (parts: PartOrder[]) => void;
    onClick: (index: number) => void;
    onDelete: (index: number) => void;
}


const DetailedPartOrderEditor: FC<Props> = ({ parts, onClick, onChange, onDelete }) => {
    const handleChange = (part: PartOrder, index: number) => {
        const newParts = [...parts];
        newParts[index] = part;
        onChange(newParts);
    }
    return <Table stickyHeader>
        <TableHead >
            <TableRow>
                <TableCell align="left" ></TableCell>
                <TableCell align="left" >Summary</TableCell>
                <TableCell align="left">Notes</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align='right'></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {parts.map((part, i) => (
                <DetailedPartRowEditor key={i} part={part} onChange={newPart => handleChange(newPart, i)} onClick={() => onClick(i)} onDelete={() => onDelete(i)} />
            ))}
        </TableBody>
    </Table>
}

export default DetailedPartOrderEditor;