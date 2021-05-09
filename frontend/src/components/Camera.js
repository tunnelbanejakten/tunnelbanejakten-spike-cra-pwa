import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720
};

const FacingMode = {
    SELFIE: 'user',
    REGULAR: 'environment'
}

const Camera = () => {
    const [enabled, setEnabled] = useState(false)

    const webcamRef = useRef(null);
    const [capturedImageUri, setCapturedImageUri] = useState(null)

    const [facingMode, setFacingMode] = useState(FacingMode.SELFIE);
    const [deviceId, setDeviceId] = useState(null);
    const [devices, setDevices] = useState([]);
    const [videoSourceDimensions, setVideoSourceDimensions] = useState([1280, 720]);
    const [message, setMessage] = useState(null)

    const [previewWidth, previewHeight] = useMemo(
        () => {
            const [width, height] = videoSourceDimensions
            const ratio = width / height;
            setMessage(`📐 Aspect ratio of ${width}x${height} is ${ratio.toFixed(2)}`)
            const maxSize = 400
            if (width > height) {
                return [maxSize, maxSize / ratio]
            } else {
                return [maxSize / ratio, maxSize]
            }
        },
        [videoSourceDimensions, setMessage])

    const handleDevices = useCallback(
        mediaDevices => {
            const videoDevices = mediaDevices.filter(({kind}) => kind === "videoinput");
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setDeviceId(videoDevices[0].deviceId)
            }
        },
        [setDevices]
    );

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    const capture = useCallback(
        () => {
            const [width, height] = videoSourceDimensions
            const imageSrc = webcamRef.current.getScreenshot({width, height});
            setMessage(`📷 Captured image. Requested ${width}x${height}. Got ${imageSrc.length} bytes.`)
            setCapturedImageUri(imageSrc)
        },
        [webcamRef, setCapturedImageUri, videoSourceDimensions, setMessage]
    );
    const [width, height] = videoSourceDimensions
    return (
        <div>
            <h1>Camera</h1>
            {enabled && <>
                <div>
                    <button onClick={() => setEnabled(false)}>Stop</button>
                </div>
                {devices && (
                    devices.map(device => (
                        <div key={`deviceId${device.deviceId}`}>
                            <input type="radio"
                                   name="deviceId"
                                   value={device.deviceId}
                                   id={`device-selector-${device.deviceId}`}
                                   checked={device.deviceId === deviceId}/>
                            <label htmlFor={`device-selector-${device.deviceId}`}>{device.label}</label>
                        </div>
                    ))
                )}
                {
                    Object.values(FacingMode).map(mode => (
                        <div key={`facingMode${mode}`}>
                            <input type="radio"
                                   name="mode"
                                   value={mode}
                                   onChange={() => {
                                       setFacingMode(mode)
                                   }}
                                   id={`facing-mode-selector-${mode}`}
                                   checked={mode === facingMode}/>
                            <label htmlFor={`facing-mode-selector-${mode}`}>{mode}</label>
                        </div>
                    ))
                }
                {deviceId && <div>
                    <Webcam
                        audio={false}
                        height={previewHeight}
                        width={previewWidth}
                        ref={webcamRef}
                        mirrored={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            ...videoConstraints,
                            width,
                            height,
                            deviceId: deviceId,
                            facingMode: facingMode
                        }}
                        onUserMedia={mediaStream => {
                            mediaStream.getVideoTracks().forEach(videoTrack => {
                                const capabilities = videoTrack.getCapabilities();
                                const {width, height, facingMode} = capabilities
                                setVideoSourceDimensions([width.max, height.max])
                                // console.log('getSettings', videoTrack.getSettings())
                                // console.log('getCapabilities', capabilities)
                                // console.log('getConstraints', videoTrack.getConstraints())
                            })
                        }}
                    />
                </div>}
                <div>
                    <button onClick={capture}>Capture photo</button>
                </div>
                {capturedImageUri && <div>
                    <p>
                        Most recently captured photo:
                    </p>
                    <div>
                        <img src={capturedImageUri} style={{width: 300, height: 'auto'}}/>
                    </div>
                </div>}
            </>}
            {!enabled && <>
                <button onClick={() => setEnabled(true)}>Start</button>
            </>}
            {message && <p>{message}</p>}
        </div>
    )
}
export default Camera
