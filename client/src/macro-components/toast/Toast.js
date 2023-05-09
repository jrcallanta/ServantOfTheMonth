import { useState } from "react";
import { ReactComponent as XIcon } from "../../assets/XIcon.svg";
import { ReactComponent as XIconSmall } from "../../assets/XIconSmall.svg";

import "../../styles/css/macro-components/toast/Toast.css";

function Toast(props) {
    const [isClosed, setIsClosed] = useState(false);

    const closeToast = () => {
        setIsClosed(true); // only closes visually

        if (props.onClose()) props.onClose(); // closes toast based on parenting component
    };

    return (
        <div
            className='Toast'
            data-toast-type={props.toastType || "notif"}
            data-align={props.align || "bottom"}
            data-closed={isClosed}
        >
            {props.closable === true && (
                <>
                    <span className='close' onClick={closeToast}>
                        <XIcon />
                    </span>

                    <span className='close small' onClick={closeToast}>
                        <XIconSmall />
                    </span>
                </>
            )}

            {props.title && <h3 className='title'>{props.title}</h3>}
            {props.message && <p className='message'>{props.message}</p>}
        </div>
    );
}

export default Toast;
