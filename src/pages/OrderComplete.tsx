import { Stack, Container, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    return (
        <Stack height='100%' width='100%' alignItems='center' justifyContent='center'>
            <Container maxWidth='sm'>
                <Stack spacing={2}>


                    <Typography variant='h4' textAlign='center'>Order Complete!</Typography>
                    <Typography variant='caption' textAlign='center'>
                        You will receieve a confirmation email once your order is confirmed.
                    </Typography>
                    <Button onClick={() => navigate('/')} variant='contained'>Start Another Order</Button>
                    {/* <Button onClick={() => navigate('/orders')} variant='contained'>Start Another Order</Button> */}
                </Stack>
            </Container>
        </Stack>
    )
}