import YearDropDown from "../../macro-components/yearDropDown/YearDropDown.js";
import MonthCarousel from "../../macro-components/monthCarousel/MonthCarousel.js";
import BinSelector from "../../macro-components/binSelector/BinSelector.js";
import SortByDropDown from "../../macro-components/sortByDropDown/SortByDropDown.js";
import ToggleSwitch from "../../macro-components/toggleSwitch/ToggleSwitch.js";
import VotesTable from "../../macro-components/votesTable/VotesTable.js";

import { useVotesPageLogic } from "./_VotesPageLogic";

import "../../styles/css/pages/VotesPage/VotesPage.css";

function VotesPage(props) {
    const {
        state: {
            selectedYear,
            selectedMonth,
            selectedBinIndex,
            selectedSortIndex,
            selectedDirection,
            isCellView,
        },
        handlers: {
            setSelectedYear,
            setSelectedMonth,
            setSelectedBinIndex,
            setSelectedSortIndex,
            setSelectedDirection,
            toggleCellView,
        },
        constants: { BIN_TYPES, SORT_TYPES },
    } = useVotesPageLogic(props);

    return (
        <div className='VotesPage'>
            <div className='header'>
                <YearDropDown
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />
                <MonthCarousel
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                />
                <div className='filters'>
                    <BinSelector
                        bins={BIN_TYPES}
                        selectedBinIndex={selectedBinIndex}
                        setSelectedBinIndex={setSelectedBinIndex}
                    />
                    <SortByDropDown
                        sorts={SORT_TYPES}
                        selectedSortIndex={selectedSortIndex}
                        selectedDirection={selectedDirection}
                        setSelectedSortIndex={setSelectedSortIndex}
                        setSelectedDirection={setSelectedDirection}
                        justify={"end"}
                    />
                </div>
                <div className='viewSelector'>
                    <ToggleSwitch
                        initialState={isCellView}
                        onToggle={toggleCellView}
                        label={`tally view`}
                    />
                </div>
            </div>

            <div className='body'>
                <VotesTable
                    filters={{
                        year: selectedYear,
                        month: selectedMonth,
                        bin: BIN_TYPES[selectedBinIndex],
                        sort: SORT_TYPES[selectedSortIndex],
                        direction: selectedDirection,
                    }}
                    cellView={isCellView}
                />
            </div>
        </div>
    );
}

export default VotesPage;
