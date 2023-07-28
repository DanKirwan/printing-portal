import saveAs from "file-saver";
import JSZip from "jszip";
import { Order } from "./types";
import { WithId } from "./utils";

export const handleOrderDownload = async (order: WithId<Order>) => {
    const files = order.parts.map(p => p.file);
    const zipper = new JSZip();
    for (let file of files) {
        zipper.file(file.name, file);
    }
    const zip = await zipper.generateAsync({ type: 'blob' });
    saveAs(zip, `order - ${order.email} - (${order.id}).zip`);
}
