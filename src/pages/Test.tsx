import { ShippingDateViewer } from "@src/components/generic/ShippingDateViewer"
import moment from "moment"

export default () => {
    return (

        <ShippingDateViewer
            leadDays={2}
            orderDate={moment()}
        />
    )
}