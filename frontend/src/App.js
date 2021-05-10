import './App.css';
import SystemStatus from "./components/system-status";
import Camera from './components/camera'

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Camera/>
                <SystemStatus/>
            </header>
        </div>
    );
}

export default App;
