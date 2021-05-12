import React, {useEffect, useMemo, useState} from "react";
import PrerequisiteStatus, {Status} from "../prerequisite-status";

const BackendStatus = {
    UNKNOWN: 'We do not know if the backend is alive or not',
    CHECKING: 'We are checking if you are connected',
    ONLINE: 'The system is online',
    FAILED: 'You are not connected to the system'
}

const Backend = () => {
    const apiHost = process.env.REACT_APP_API_HOST
    const [status, setStatus] = useState(BackendStatus.UNKNOWN)

    const prerequisiteStatus = useMemo(() => {
        switch (status) {
            case BackendStatus.UNKNOWN:
                return Status.PENDING
            case BackendStatus.CHECKING:
                return Status.PENDING
            case BackendStatus.ONLINE:
                return Status.SUCCESS
            case BackendStatus.FAILED:
                return Status.FAILURE
        }
    }, [status])

    const [showStatus, setShowStatus] = useState(false)

    useEffect(() => {
        const pingApi = async () => {
            setStatus(BackendStatus.CHECKING);
            try {
                const resp = await fetch(`${apiHost}/api/ping`)
                const payload = await resp.json()
                console.log('ℹ️', payload)
                setStatus(BackendStatus.ONLINE);
            } catch (e) {
                setStatus(BackendStatus.FAILED);
            }
        }
        pingApi()
    }, [setStatus, apiHost])

    return (
        <div>
            <PrerequisiteStatus icon='🌍'
                                label='API Connection'
                                status={prerequisiteStatus}
                                buttonLabel='Status'
                                onButtonClick={() => {
                                    setShowStatus(!showStatus)
                                }}/>
            {showStatus && <p>
                {status}
            </p>}
        </div>
    )
}

export default Backend
