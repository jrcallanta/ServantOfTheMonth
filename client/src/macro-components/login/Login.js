import { ReactComponent as VisibleIcon } from "../../assets/VisibleIcon.svg";
import { ReactComponent as VisibleNotIcon } from "../../assets/VisibleNotIcon.svg";
import { useLoginLogic } from "./_LoginLogic";
import SubmitButton from "../../micro-components/submitButton/SubmitButton.js";
import Toast from "../toast/Toast";

import "../../styles/css/macro-components/login/Login.css";

function Login(props) {
    const {
        state: { isValid, feedback, isIncorrect, isSubmitting, showPassword },
        handlers: {
            handleToggleViewPassword,
            handleKeyDown,
            handleChangeInput,
            handleSubmit,
        },
        refs: { inputRef },
    } = useLoginLogic(props);

    return (
        <div className='Login'>
            <form onSubmit={handleSubmit} className='form'>
                <div className='inputField'>
                    <input
                        maxLength={36}
                        type={showPassword ? "text" : "password"}
                        name={"password"}
                        onKeyDown={handleKeyDown}
                        onChange={handleChangeInput}
                        placeholder={"enter password"}
                        data-incorrect={isIncorrect}
                        ref={inputRef}
                    />

                    <span
                        className='icon'
                        data-show-password={showPassword}
                        onClick={handleToggleViewPassword}
                    >
                        {showPassword ? <VisibleIcon /> : <VisibleNotIcon />}
                    </span>
                </div>

                {isIncorrect && (
                    <Toast message={feedback} toastType={"error"} />
                )}

                <SubmitButton
                    disabled={!isValid || isIncorrect}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}

export default Login;
