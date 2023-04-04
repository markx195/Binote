import './App.css';
import BackgroundSlider from "./Slider/backgroundSlider";
import {Route, Routes} from "react-router-dom";
import Login from "./Login/login";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<BackgroundSlider/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </div>
    );
}

export default App;
