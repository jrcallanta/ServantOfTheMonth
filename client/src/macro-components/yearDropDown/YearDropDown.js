import "../../styles/css/macro-components/yearDropDown/YearDropDown.css";

function YearDropDown(props) {
    const handleYearChange = ({ target }) =>
        props.setSelectedYear(target.value);

    return (
        <input
            className='YearDropDown'
            type='text'
            value={props.selectedYear}
            onChange={handleYearChange}
        />
    );
}

export default YearDropDown;
