import "../../styles/css/macro-components/toggleSwitch/ToggleSwitch.css";

function ToggleSwitch(props) {
    const handleToggle = (checked) => props.onToggle(checked);

    const handleClick = ({ target }) => {
        target.querySelector('input[type="checkbox"]')?.click();
    };

    return (
        <div className='ToggleSwitch' onClick={handleClick}>
            <label className='label'>{props.label}</label>
            <input
                type='checkbox'
                name={props.name}
                onChange={({ target: { checked } }) => handleToggle(checked)}
                checked={props.initialState}
            />
            <span className='slider'></span>
        </div>
    );
}

export default ToggleSwitch;
