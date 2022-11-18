import { storage } from '../main';
import { getDownloadURL, ref } from 'firebase/storage';
import { suspend } from 'suspend-react';
import { Suspense, useMemo } from 'react';
import Loading from '../components/Loading';
import LoginTest from '@src/components/LoginTest';




export default () => {
    // const storageRef = useMemo(() => ref(storage, 'Istanbul EUSA 2022-088.jpg'), []);

    // const url = suspend(() => getDownloadURL(storageRef), []);

    return (
        <LoginTest />
    )
}