import {useEffect, useState} from "react";

const BackendStatus = {
    UNKNOWN: 'We do not know if the backend is alive or not',
    CHECKING: 'We are checking if you are connected',
    ONLINE: 'The system is online',
    FAILED: 'You are not connected to the system'
}

const Backend = () => {
    const apiHost = process.env.REACT_APP_API_HOST
    const [status, setStatus] = useState(BackendStatus.UNKNOWN)

    useEffect(() => {
        const pingApi = async () => {
            setStatus(BackendStatus.CHECKING);
            try {
                const resp = await fetch(`${apiHost}/api/ping`)
                const payload = await resp.json()
                setStatus(BackendStatus.ONLINE);
            } catch (e) {
                setStatus(BackendStatus.FAILED);
            }
        }
        pingApi()
    }, [setStatus, apiHost])

    return (
        <div>
            <h1>API Connection</h1>
            <p>
                {status}
            </p>
        </div>
    )
}

export default Backend
