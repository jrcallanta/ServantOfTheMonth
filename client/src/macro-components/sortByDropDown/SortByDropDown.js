import { ReactComponent as ArrowIcon } from ".././../assets/ArrowIcon.svg";
import { ReactComponent as ArrowIconSmall } from ".././../assets/ArrowIconSmall.svg";
import { useSortByDropDownLogic } from "./_SortByDropDownLogic";

import "../../styles/css/macro-components/sortByDropDown/SortByDropDown.css";

function SortByDropDown(props) {
    const {
        state: { isExpanded },
        handlers: { handleToggleExpand },
        refs: { dropDownRef },
    } = useSortByDropDownLogic(props);

    return (
        <div className='SortByDropDown'>
            <div className='label'>
                <h3 className='label__text'>sort by</h3>
            </div>
            <div
                className='sorts'
                data-aria-expanded={isExpanded}
                style={{ "--length": props.sorts.length }}
                onClick={handleToggleExpand}
                ref={dropDownRef}
            >
                <ul
                    className='sorts__list'
                    style={{ "--offset": props.selectedSortIndex }}
                >
                    {props.sorts.map((sort, i) => (
                        <li
                            key={i}
                            onClick={() => props.setSelectedSortIndex(i)}
                            className={
                                props.selectedSortIndex === i
                                    ? "sort active"
                                    : "sort"
                            }
                        >
                            <h3 className='sort__text'>{sort}</h3>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className='direction'
                data-ascending={props.selectedDirection > 0}
                onClick={() => props.setSelectedDirection((prev) => -1 * prev)}
            >
                <div className='icon'>
                    <ArrowIcon />
                </div>

                <div className='icon small'>
                    <ArrowIconSmall />
                </div>
            </div>
        </div>
    );
}

export default SortByDropDown;
