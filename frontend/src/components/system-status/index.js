import React from 'react'
import Geolocation from "./Geolocation";
import Backend from "./Backend";
import QrCodeReader from "./QrCodeReader";
import Camera from "./Camera";

const SystemStatus = () => (
    <>
        <Camera/>
        <Geolocation/>
        <Backend/>
        <QrCodeReader/>
    </>
)

export default SystemStatus
