import "../../styles/css/micro-components/submitButton/SubmitButton.css";

function SubmitButton(props) {
    return (
        <button
            disabled={props.disabled}
            data-submitting={props.isSubmitting}
            className='SubmitButton'
        >
            submit
        </button>
    );
}

export default SubmitButton;
