import { Stack, Container, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    return (
        <Stack>
            <Container>

                <Typography>Order Complete!</Typography>
                <Button onClick={() => navigate('/')} variant='contained'>Start Another Order</Button>
                {/* <Button onClick={() => navigate('/orders')} variant='contained'>Start Another Order</Button> */}
            </Container>
        </Stack>
    )
}