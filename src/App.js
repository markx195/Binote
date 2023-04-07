import './App.css';
import BackgroundSlider from "./Slider/backgroundSlider";
import {Route, Routes} from "react-router-dom";
import Login from "./Login/login";
import HomePage from "./HomePage/homePage"
import CourseCard from "./HomePage/courseCard"

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<BackgroundSlider/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/HomePage" element={<HomePage/>}>
                    <Route
                        path=""
                        element={<CourseCard/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
