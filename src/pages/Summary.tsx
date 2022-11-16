import { Order, PartOrder } from "../lib/types"
import OrderSummaryPC from "../pageComponents/OrderSummary.pc"

export default () => {
    const testParts: PartOrder[] = [
        {
            file: null as unknown as File,
            notes: "Test Note",
            quantity: 10,
            settings: {
                color: "red",
                infill: 0.8,
                material: "PLA",
                resolution: 300
            }
        }
    ]

    const testOrder: Order = {
        desc: "Test",
        email: "cassian@h3dp.org",
        lead: 2,
        ordered: new Date(),
        parts: testParts,
    }
    return (
        <OrderSummaryPC order={testOrder} />
    )
}