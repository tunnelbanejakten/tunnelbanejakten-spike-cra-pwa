import {useEffect, useState} from "react";

const GeolocationStatus = {
    UNKNOWN: 'UNKNOWN',
    NO_BROWSER_API: 'NO_BROWSER_API',
    NO_USER_APPROVAL: 'NO_USER_APPROVAL',
    NO_POSITION: 'NO_POSITION',
    NO_RESPONSE: 'NO_RESPONSE',
    BROWSER_API_AVAILABLE: 'BROWSER_API_AVAILABLE',
    LOCATION_REQUEST_INITIATED: 'LOCATION_REQUEST_INITIATED',
    LOCATION_REQUEST_SUCCEEDED: 'LOCATION_REQUEST_SUCCEEDED',
    LOCATION_REQUEST_FAILED: 'LOCATION_REQUEST_FAILED'
}

const Geolocation = () => {
    const [geolocationMessage, setGeolocationMessage] = useState(null)
    const [geolocationStatus, setGeolocationStatus] = useState(GeolocationStatus.UNKNOWN)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [accuracy, setAccuracy] = useState(null)

    useEffect(() => {
        setGeolocationStatus("geolocation" in navigator
            ? GeolocationStatus.BROWSER_API_AVAILABLE
            : GeolocationStatus.NO_BROWSER_API
        )
    }, [])

    useEffect(() => {
        switch (geolocationStatus) {
            case GeolocationStatus.UNKNOWN:
                setGeolocationMessage('We do not know if we can figure out your location.')
                break;
            case GeolocationStatus.NO_BROWSER_API:
                setGeolocationMessage('We will not be able to figure out your location. Your browser does not support providing us with your GPS coordinates.')
                break;
            case GeolocationStatus.NO_USER_APPROVAL:
                setGeolocationMessage('You denied our request to get your location.')
                break;
            case GeolocationStatus.NO_POSITION:
                setGeolocationMessage('We could not lock onto your location. Maybe you are moving around? Maybe the reception is bad where you are at the moment?')
                break;
            case GeolocationStatus.NO_RESPONSE:
                setGeolocationMessage('We did not get your position because the request timed out.')
                break;
            case GeolocationStatus.BROWSER_API_AVAILABLE:
                setGeolocationMessage('Your device is figuring out your location.')
                setGeolocationStatus(GeolocationStatus.LOCATION_REQUEST_INITIATED)

                navigator.geolocation.getCurrentPosition((position) => {
                    const {
                        coords: {
                            accuracy,
                            latitude,
                            longitude,
                        }
                    } = position
                    setAccuracy(accuracy)
                    setLatitude(latitude)
                    setLongitude(longitude)
                    setGeolocationStatus(GeolocationStatus.LOCATION_REQUEST_SUCCEEDED)
                }, (error) => {
                    switch (error.code) {
                        // 1	PERMISSION_DENIED	The acquisition of the geolocation information failed because the page didn't have the permission to do it.
                        case 1:
                            setGeolocationStatus(GeolocationStatus.NO_USER_APPROVAL)
                            break;
                        // 2	POSITION_UNAVAILABLE	The acquisition of the geolocation failed because one or several internal sources of position returned an internal error.
                        case 2:
                            setGeolocationStatus(GeolocationStatus.NO_POSITION)
                            break;
                        // 3	TIMEOUT	The time allowed to acquire the geolocation, defined by PositionOptions.timeout information that was reached before the information was obtained.
                        case 3:
                            setGeolocationStatus(GeolocationStatus.NO_RESPONSE)
                            break;
                        default:
                            setGeolocationStatus(GeolocationStatus.LOCATION_REQUEST_FAILED)
                            break;
                    }
                })
                break;
            case GeolocationStatus.LOCATION_REQUEST_INITIATED:
                break;
            case GeolocationStatus.LOCATION_REQUEST_SUCCEEDED:
                setGeolocationMessage('We have received your location.')
                break;
            case GeolocationStatus.LOCATION_REQUEST_FAILED:
                setGeolocationMessage('For some reason, we could not find your location.')
                break;
            default:
                setGeolocationMessage('Unknown status')
                break;
        }
    }, [geolocationStatus, setGeolocationStatus, setGeolocationMessage, setLatitude, setLongitude])

    return (
        <div>
            <h1>Geolocation</h1>
            <p>{geolocationMessage}</p>
            {geolocationStatus === GeolocationStatus.LOCATION_REQUEST_SUCCEEDED && (<>
                <p>Latitude: {latitude.toFixed(10)}</p>
                <p>Longitude: {longitude.toFixed(10)}</p>
                <p>Accuracy: {accuracy.toFixed(0)} meters</p>
            </>)}
        </div>
    )
}
export default Geolocation
