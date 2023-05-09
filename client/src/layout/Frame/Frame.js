import { Outlet } from "react-router-dom";
import { createPortal } from "react-dom";

import Background from "../../macro-components/background/Background.js";

import "../../styles/css/layout/Frame/Frame.css";

function Frame(props) {
    return (
        <>
            {createPortal(
                <Background animate={!props.isFull} darken={0.24} />,
                document.getElementById("background-root")
            )}

            <div className='Frame' data-fullscreen={props.isFull}>
                {props.showTitle && (
                    <>
                        <div className='title'>
                            <img
                                src='/GradientTitle.png'
                                alt='GradientTitle.png'
                                className='title__img'
                            />
                        </div>

                        <div className='title small'>
                            <img
                                src='/GradientTitleSmall.png'
                                alt='GradientTitleSmall.png'
                                className='title__img'
                            />
                        </div>
                    </>
                )}

                <Outlet />
            </div>
        </>
    );
}

export default Frame;
