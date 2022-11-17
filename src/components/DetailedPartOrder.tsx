import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { FC } from 'react';
import { PartOrder } from '../lib/types';
import DetailedPartRow from './DetailedPartRow';
import DetailedPartRowEditor from './DetailedPartRowEditor';
import ModelPreview from './ModelPreview';



const columns: GridColDef[] = [
    { field: 'image', headerName: "", width: 70 },
    { field: 'summary', headerName: "Summary", width: 50 },
    { field: 'notes', headerName: "Notes", width: 70 },
    { field: 'quantity', headerName: "Quantity", width: 10 }
]

interface Props {
    parts: PartOrder[]
}


const DetailedPartOrder: FC<Props> = ({ parts }) => {
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
                <DetailedPartRowEditor part={part} onChange={(_) => { }} />
            ))}
        </TableBody>
    </Table>
}

export default DetailedPartOrder;