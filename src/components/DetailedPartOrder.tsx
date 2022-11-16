import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { FC } from 'react';
import { PartOrder } from '../lib/types';



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
                <TableCell></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Summary</TableCell>
                <TableCell align="right">Notes</TableCell>
                <TableCell align="right">Quantity</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {parts.map((part, i) => (
                <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="right">
                        <Stack>

                            <Typography>{part.file?.name}</Typography>
                        </Stack>
                    </TableCell>
                    <TableCell align="right">
                        <Stack>
                            <Typography>Material: {part.settings.material}</Typography>
                            <Typography>Colour: {part.settings.color}</Typography>
                            <Typography>Infil: {part.settings.infill / 100}%</Typography>
                            <Typography>Resolution: {part.settings.resolution}μm</Typography>
                        </Stack></TableCell>
                    <TableCell align="right">
                        <Typography>{part.notes}</Typography>

                    </TableCell>
                    <TableCell align="right">{part.quantity}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default DetailedPartOrder;