import { Stack, Typography } from '@mui/material';
import { FC } from 'react';


export const PrivacyPolicyPC: FC = () => {
    return (
        <Stack spacing={3} padding={10}>
            <Typography variant='h3'>Privacy Policy</Typography>
            <Typography variant="h5">Introduction</Typography>
            <Typography variant="body1">
                HenleyPrint3D is committed to protecting the privacy of its users. This privacy policy explains how we collect, use,
                and protect personal information.
            </Typography>
            <Typography variant="h5">Personal Information Collection and Use</Typography>
            <Typography variant="body1">
                We collect personal information at the point of order such as name, email address, and physical address either through
                forms on our website, or from our authentication provider: Google. The option to post an order without logging in has been
                added for those who do not want to attach their google account to the service however this is highly recommended. We collect
                this information to create, manage, and track your orders.
            </Typography>
            <Typography variant="h5">Sharing of Personal Information</Typography>
            <Typography variant="body1">
                This personal information is stored in a secure database hosted using Googles “Firebase” infrastructure. Google does not
                share this information with any other third parties and is storing it solely for use within HenleyPrint3D’s purview. We
                protect personal information from unauthorized access, misuse, or disclosure using the above mentioned Google Firebase
                which is only accessed through this order portal.
            </Typography>
            <Typography variant="h5">User Rights</Typography>
            <Typography variant="body1">
                Users have the right to clear all personal data related to any of their orders that are not currently in production. Users
                can contact us at support@henleyprint3d.com to exercise their rights if they do not hold an account within the website or
                would prefer manual support.
            </Typography>
            <Typography variant="h5">Cookies and Tracking Technologies</Typography>
            <Typography variant="body1">
                We use cookies for authentication within our app when logging into your account. This is essential for the operation of the
                website. Our website uses Google Analytics to improve our services however this is optional and you can change your
                preferences at any time.
            </Typography>
            <Typography variant="h5">Retention of Personal Information</Typography>
            <Typography variant="body1">
                Personal information related to orders can be deleted once delivery confirmation has occurred.
            </Typography>
            <Typography variant="h5">Changes to Privacy Policy</Typography>
            <Typography variant="body1">
                We do not anticipate making any changes to this privacy policy in the near future. However, any changes will be updated in
                the privacy policy on the website.
            </Typography>
            <Typography variant="h5">Conclusion</Typography>
            <Typography variant="body1">
                By using our website, users agree to the terms of this privacy policy. We are committed to protecting the privacy of our
                users and will take all necessary measures to ensure the safety of personal information.
            </Typography>
        </Stack>
    )
}
