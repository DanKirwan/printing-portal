import { storage } from '../main';
import { getDownloadURL, ref } from 'firebase/storage';
import { suspend } from 'suspend-react';
import { Suspense, useMemo } from 'react';
import Loading from '../components/Loading';
import LoginTest from '@src/components/LoginTest';




export default () => {
    return (
        <LoginTest />
    )
}