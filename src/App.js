import './App.css';
import {useEffect, useRef} from "react";
import {controller} from "./Controller";

function App() {
    const rectangleRef = useRef();
    const containerRef = useRef();
    const circleRef = useRef();
    const circle2Ref = useRef();
    const circle3Ref = useRef();

    useEffect(() => {
        controller.init({
            rectangle: rectangleRef.current,
            circle: circleRef.current,
            container: containerRef.current,
            prejector: circle2Ref.current,
            rotated: circle3Ref.current,
        })
    }, [])


    return (
        <div className="App">
            <div className={"container"} ref={containerRef}>
                <div className={"rectangle"} ref={rectangleRef}/>
                <div className={"circle prejector"} ref={circle2Ref}/>
                <div className={"circle prejector_rotated"} ref={circle3Ref}/>
                <div className={"circle"} ref={circleRef}/>
            </div>
        </div>
    );
}

export default App;
