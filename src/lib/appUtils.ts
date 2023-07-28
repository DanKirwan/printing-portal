// This includes utilities which are dependent on app state such as firebase things

import { storage } from "@src/main";
import { getDB } from "./firebaseUtils";
import { DBPart, Order } from "./types"
import { deleteOrder, updateOrder, uploadOrder, getOrder, updateOrderMetadata } from "./uploadUtils";

export const handleOrderUpload = (order: Order, userId: string | null) => uploadOrder(order, userId, getDB(), storage);
export const handleOrderDelete = (uuid: string) => deleteOrder(uuid, getDB());
export const handleOrderUpdate = (uuid: string, newOrder: Order) => updateOrder(uuid, newOrder, getDB(), storage);
export const handleOrderMetadataUpdate = (uuid: string, newOrder: Omit<Order, 'parts'>, newPartMetadata?: DBPart[]) => updateOrderMetadata(getDB(), uuid, newOrder, newPartMetadata);
export const handleOrderGet = (uuid: string) => getOrder(uuid, getDB(), storage);
