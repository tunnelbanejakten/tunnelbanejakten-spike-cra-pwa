import React, {useCallback, useMemo, useState} from 'react'
import QrReader from 'react-qr-reader'
import PrerequisiteStatus, {Status} from "../prerequisite-status";

const QrCodeReader = () => {
    const [result, setResult] = useState('Nothing yet')
    const [enabled, setEnabled] = useState(false)
    const [prerequisiteStatus, setPrerequisiteStatus] = useState(Status.USER_INTERACTION_REQUIRED);

    const handleScan = useCallback(data => {
        if (data) {
            setResult(data);
            setPrerequisiteStatus(Status.SUCCESS)
        }
    }, [setResult, setPrerequisiteStatus]);

    const handleError = useCallback(err => {
        console.error(err)
        setResult(err.message)
        setPrerequisiteStatus(Status.FAILURE)
    }, [setResult, setPrerequisiteStatus]);

    return (
        <div>
            <PrerequisiteStatus icon='📷'
                                label='QR Code Reader'
                                status={prerequisiteStatus}
                                buttonLabel={enabled ? (prerequisiteStatus === Status.SUCCESS ? 'Close' : 'Cancel') : 'Test'}
                                onButtonClick={() => {
                                    setEnabled(!enabled)
                                }}/>
            {enabled && <>
                <QrReader
                    showViewFinder={false}
                    delay={500}
                    onError={handleError}
                    onScan={handleScan}
                    onLoad={() => {
                        setPrerequisiteStatus(Status.USER_INTERACTION_REQUIRED)
                    }}
                    style={{width: 300}}
                />
                <p>{result}</p>
            </>}
        </div>
    )
}

export default QrCodeReader
