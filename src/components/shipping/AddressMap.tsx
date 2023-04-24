import { Stack, Typography } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { Address } from '@src/lib/types';
import { FC, useCallback, useState } from 'react';
import { CentralLoading } from '../generic/CentralLoading';

interface Props {
    address: Address;
}

const libraries: ['places'] = ['places'];
export const AddressMap: FC<Props> = ({ address }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBGajxlwaiPMwabZ6PpK9Fwq4_upyZnMYQ",
        libraries
    })

    const [failed, setFailed] = useState<boolean | null>(null);

    const [center, setCenter] = useState<google.maps.LatLng>();

    const onLoad = useCallback((map: google.maps.Map) => {
        const service = new google.maps.places.PlacesService(map);
        const addressString = `${address.line1}, ${address.line2 ?? ''}, ${address.postCode}`
        console.log(addressString)
        service.findPlaceFromQuery({ query: addressString, fields: ['geometry.location'] }, (response, status) => {
            console.log(response, status);
            if (!response || response.length == 0) return setFailed(true);
            setCenter(response[0].geometry!.location);
            setFailed(false);
        })

    }, [])


    if (!isLoaded) return <CentralLoading />;

    if (failed) return (
        <Stack height='100%' width='100%' justifyContent='center' alignItems='center'>
            <Typography>Failed to load map.</Typography>
        </Stack>
    );

    return (
        <GoogleMap
            options={{
                panControl: false, mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false, draggable: false
            }}
            onDrag={() => null}
            zoom={15}
            center={center}
            mapContainerStyle={{ height: '100%', width: '100%' }}
            onLoad={onLoad}
            clickableIcons={false}

        >
            {center && <Marker position={center} />}
        </GoogleMap>
    )
}
