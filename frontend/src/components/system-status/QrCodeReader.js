import React, {useCallback, useState} from 'react'
import QrReader from 'react-qr-reader'

const QrCodeReader = () => {
    const [result, setResult] = useState('Nothing yet')

    const handleScan = useCallback(data => {
        if (data) {
            console.log('💬', data)
            setResult(data);
        }
    }, [setResult]);

    const handleError = useCallback(err => {
        console.error(err)
    }, []);

    return (
        <div>
            <h1>QR Reader</h1>
            <QrReader
                showViewFinder={false}
                delay={500}
                onError={handleError}
                onScan={handleScan}
                style={{width: 300}}
            />
            <p>{result}</p>
        </div>
    )
}

export default QrCodeReader
