import { Button, Stack } from '@mui/material';
import { OrderEditor } from '@src/components/OrderEditor';
import { useAuth } from '@src/contexts/AuthContext';
import { Order } from '@src/lib/types';
import { getOrderFolderUrl } from '@src/lib/uploadUtils';
import { WithId } from '@src/lib/utils';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import { FC } from 'react';

interface Props {
    order: WithId<Order>;
}

export const AdminOrderViewerPC: FC<Props> = ({ order }) => {
    const handleOrderDownload = async () => {
        const files = order.parts.map(p => p.file);
        const zipper = new JSZip();
        for (let file of files) {
            zipper.file(file.name, file);
        }
        const zip = await zipper.generateAsync({ type: 'blob' });
        saveAs(zip, `order (${order.id}).zip`);
    }
    return (
        <Stack>
            <OrderEditor order={order} onChange={() => null} />
            <Button onClick={() => handleOrderDownload()} variant='contained'>Download Files</Button>
        </Stack>
    )
}
