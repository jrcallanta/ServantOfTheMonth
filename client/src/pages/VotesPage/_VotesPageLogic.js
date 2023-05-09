import { useMemo, useState } from "react";

export const useVotesPageLogic = (props) => {
    const BIN_TYPES = useMemo(() => ["all", "valid", "invalid"], []);
    const SORT_TYPES = useMemo(
        () => ["vote count", "nominee", "voter", "date"],
        []
    );

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedBinIndex, setSelectedBinIndex] = useState(0);
    const [selectedSortIndex, setSelectedSortIndex] = useState(3);
    const [selectedDirection, setSelectedDirection] = useState(-1);
    const [isCellView, setIsCellView] = useState(false);

    const toggleCellView = () => setIsCellView((prev) => !prev);

    return {
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
        constants: {
            BIN_TYPES,
            SORT_TYPES,
        },
    };
};
