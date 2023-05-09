import { useEffect, useState } from "react";
import "../../styles/css/macro-components/background/Background.css";

function Background(props) {
    const [isAnimating, setIsAnimating] = useState(props.animate);

    const handleLoad = (event) => {
        console.log("loaded");
    };

    useEffect(() => {
        if (!props.animate)
            setTimeout(() => setIsAnimating((prev) => false), 1000);
        else setIsAnimating((prev) => true);
    }, [props.animate]);

    return (
        <div
            className='Background'
            onLoad={handleLoad}
            data-animate={isAnimating}
            style={{ "--opacity": props.darken }}
        ></div>
    );
}

export default Background;
