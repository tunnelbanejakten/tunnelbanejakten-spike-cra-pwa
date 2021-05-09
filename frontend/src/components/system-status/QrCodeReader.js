import React, {useCallback, useState} from 'react'
import QrReader from 'react-qr-reader'

const QrCodeReader = () => {
    const [result, setResult] = useState('Nothing yet')
    const [enabled, setEnabled] = useState(false)

    const handleScan = useCallback(data => {
        if (data) {
            setResult(data);
        }
    }, [setResult]);

    const handleError = useCallback(err => {
        console.error(err)
        setResult(err.message)
    }, [setResult]);

    return (
        <div>
            <h1>QR Reader</h1>
            {enabled && <>
                <div>
                    <button onClick={() => setEnabled(false)}>Stop</button>
                </div>
                <QrReader
                    showViewFinder={false}
                    delay={500}
                    onError={handleError}
                    onScan={handleScan}
                    onLoad={() => {
                        console.log('onLoad')
                    }}
                    style={{width: 300}}
                />
            </>}
            {!enabled && <>
                <button onClick={() => setEnabled(true)}>Start</button>
            </>}
            <p>{result}</p>
        </div>
    )
}

export default QrCodeReader
