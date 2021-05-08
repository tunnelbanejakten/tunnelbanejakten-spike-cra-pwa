import './App.css';
import {useEffect, useState} from "react";

function App() {
    const apiHost = process.env.REACT_APP_API_HOST
    const [pingResponse, setPingResponse] = useState('')

    useEffect(() => {
        const pingApi = async () => {
            try {
                const resp = await fetch(`${apiHost}/api/ping`)
                const payload = await resp.json()
                setPingResponse(`API is online. Ping message: ${payload.message}.`);
            } catch (e) {
                setPingResponse('API is not available');
            }
        }
        pingApi()
    }, [setPingResponse, apiHost])

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    {pingResponse || 'API status is unknown'}
                </p>
            </header>
        </div>
    );
}

export default App;
