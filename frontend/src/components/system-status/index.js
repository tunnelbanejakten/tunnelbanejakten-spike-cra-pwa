import React from 'react'
import Geolocation from "./Geolocation";
import Backend from "./Backend";
import QrCodeReader from "./QrCodeReader";

const SystemStatus = () => (
    <>
        <Geolocation/>
        <Backend/>
        <QrCodeReader/>
    </>
)

export default SystemStatus
