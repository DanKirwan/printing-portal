// This includes utilities which are dependent on app state such as firebase things

import { storage } from "@src/main";
import { getDB } from "./firebaseUtils";
import { Order } from "./types"
import { deleteOrder, updateOrder, uploadOrder, getOrder } from "./uploadUtils";

export const handleOrderUpload = (order: Order, userId: string | null) => uploadOrder(order, userId, getDB(), storage);
export const handleOrderDelete = (uuid: string) => deleteOrder(uuid, getDB());
export const handleOrderUpdate = (uuid: string, newOrder: Omit<Order, 'parts'>) => updateOrder(uuid, newOrder, getDB());
export const handleOrderGet = (uuid: string) => getOrder(uuid, getDB(), storage);
