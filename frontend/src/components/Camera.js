import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Webcam from "react-webcam";

const CameraStatus = {
    UNKNOWN: 'Status of camera is unknown',
    LOADING_DEVICE_LIST: 'Loading list of cameras',
    DEVICE_LIST_LOADED: 'Camera list loaded',
    ERROR: 'Error',
    STARTING_DEVICE: 'Starting camera',
    DEVICE_STARTED: 'Camera started',
    RESIZING_VIDEO: 'Changing camera resolution',
    NO_DEVICE_SELECTED: 'No camera selected'
}

const Camera = () => {
    const [enabled, setEnabled] = useState(false)

    const webcamRef = useRef(null);
    const [capturedImageUri, setCapturedImageUri] = useState(null)

    const [status, setStatus] = useState(CameraStatus.UNKNOWN);
    const [deviceId, setDeviceId] = useState(null);
    const [devices, setDevices] = useState([]);
    const [videoDesiredDimensions, setVideoDesiredDimensions] = useState([1280 * 2, 720 * 2]);
    const [videoActualDimensions, setVideoActualDimensions] = useState([0, 0]);
    const [message, setMessage] = useState(null)

    const [previewWidth, previewHeight] = useMemo(
        () => {
            setStatus(CameraStatus.RESIZING_VIDEO)
            const [width, height] = videoDesiredDimensions
            const ratio = width / height;
            setMessage(`📐 Aspect ratio of ${width}x${height} is ${ratio.toFixed(2)}.`)
            const maxSize = 400
            if (width > height) {
                return [maxSize, maxSize / ratio]
            } else {
                return [maxSize / ratio, maxSize]
            }
        },
        [videoDesiredDimensions, setMessage])

    const handleDevices = useCallback(
        mediaDevices => {
            setStatus(CameraStatus.DEVICE_LIST_LOADED)
            const videoDevices = mediaDevices.filter(({kind}) => kind === "videoinput");
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setDeviceId(videoDevices[0].deviceId)
            }
        },
        [setDevices, setStatus]
    );

    useEffect(
        () => {
            if (enabled) {
                setStatus(CameraStatus.LOADING_DEVICE_LIST);
                navigator.mediaDevices.enumerateDevices().then(handleDevices);
            }
        },
        [handleDevices, setStatus, enabled]
    );

    useEffect(() => {
        if (deviceId) {
            setStatus(CameraStatus.STARTING_DEVICE);
        } else {
            setStatus(CameraStatus.NO_DEVICE_SELECTED);
        }
    }, [deviceId])

    useEffect(() => {
        console.log(`⚠️ Status is ${status}`)
    }, [status])

    const capture = useCallback(
        () => {
            const [width, height] = videoActualDimensions
            const imageSrc = webcamRef.current.getScreenshot({width, height});
            setMessage(`📷 Captured image. Requested ${width}x${height}. Got ${imageSrc.length} bytes.`)
            setCapturedImageUri(imageSrc)
        },
        [webcamRef, setCapturedImageUri, videoActualDimensions, setMessage]
    );
    const [width, height] = videoDesiredDimensions
    return (
        <div>
            <h1>Camera</h1>
            {enabled && <>
                <div>
                    <button onClick={() => setEnabled(false)}>Stop</button>
                </div>
                <p>{status}</p>
                {devices && (
                    devices.map(device => (
                        <div key={`deviceId${device.deviceId}`}>
                            <input type="radio"
                                   name="deviceId"
                                   value={device.deviceId}
                                   onClick={() => {
                                       setDeviceId(device.deviceId)
                                   }}
                                   id={`device-selector-${device.deviceId}`}
                                   checked={device.deviceId === deviceId}/>
                            <label htmlFor={`device-selector-${device.deviceId}`}>{device.label}</label>
                        </div>
                    ))
                )}
                {deviceId && <div>
                    <Webcam
                        audio={false}
                        height={previewHeight}
                        width={previewWidth}
                        ref={webcamRef}
                        mirrored={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            deviceId: deviceId,
                            width,
                            height
                        }}
                        onUserMediaError={(mediaStreamError) => {
                            setStatus(CameraStatus.ERROR)
                            setMessage(mediaStreamError.name)
                        }}
                        onUserMedia={mediaStream => {
                            setStatus(CameraStatus.DEVICE_STARTED)
                            mediaStream.getVideoTracks().forEach(videoTrack => {
                                // const capabilities = videoTrack.getCapabilities();
                                const currentSettings = videoTrack.getSettings();
                                // if (currentSettings.width !== width || currentSettings.height !== height) {
                                //     setVideoDesiredDimensions([currentSettings.width, currentSettings.height]);
                                // }
                                setMessage(`Got ${currentSettings.width}x${currentSettings.height}`);
                                setVideoActualDimensions([currentSettings.width, currentSettings.height])
                                // const {width: capWidth, height: capHeight} = capabilities
                                // if (capWidth && capHeight && (capWidth.max * capHeight.max > currentSettings.width * currentSettings.height)) {
                                //     console.log(`📐 Can get ${capWidth.max}x${capHeight.max}`);
                                //     setImmediate(() => {
                                //         setVideoDesiredDimensions([capWidth.max, capHeight.max])
                                //     })
                                // }
                                // console.log('getSettings', currentSettings)
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
                {message && <p>{message}</p>}
            </>}
            {!enabled && <>
                <button onClick={() => setEnabled(true)}>Start</button>
            </>}
        </div>
    )
}
export default Camera
