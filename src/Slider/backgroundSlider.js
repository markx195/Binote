import React, {useEffect, useState} from "react";
import './backgroundSlider.css'
import imageSlide from "./dataSlider";

const BackgroundSlider = () => {
    const [currentState, setCurrentState] = useState(0)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentState === 2) {
                setCurrentState(0)
            } else {
                setCurrentState(currentState + 1)
            }
        }, 5000)
        return clearTimeout(timer)
    }, [currentState])
    const bgImageStyle = {
        backgroundImage: `url(${imageSlide[currentState].url})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '100%'
    }
    const goNext = (currentState) => {
        setCurrentState(currentState)
    }
    return (
        <div className="container-style">
            <div style={bgImageStyle}></div>
            <div className="transparent-bg"></div>
            <div className="description">
                <div>
                    <h1>{imageSlide[currentState].title}</h1>
                    <p>{imageSlide[currentState].body}</p>
                </div>
                <div className="carousel-bolt">
                    {
                        imageSlide.map((imageSlide, currentState) => (
                            <span key={currentState} onClick={() => goNext(currentState)}></span>
                        ))
                    }
                </div>
            </div>
            <div className="snip1582">Next</div>
        </div>
    )
}

export default BackgroundSlider
