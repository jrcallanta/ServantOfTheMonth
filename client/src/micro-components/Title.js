import { ReactComponent as TitleSVG } from "../assets/Title.svg";
import { useOnAllImgLoad } from "../tools/customHooks";
import "../styles/css/micro-components/Title.css";

function Title(props) {
    useOnAllImgLoad(
        ".Title",
        (elem) => {
            elem.style.opacity = "1";
            elem.style.transform = "scale(1)";
            elem.style.filter = "none";
        },
        { loadSelector: "svg" }
    );

    return (
        <div
            className='Title'
            style={{ display: props.displayed ? "flex" : "none" }}
        >
            <TitleSVG />
            {/* <h1>Servant</h1>
            <h1>of the</h1>
            <h1>Month</h1> */}
        </div>
    );
}

export default Title;
