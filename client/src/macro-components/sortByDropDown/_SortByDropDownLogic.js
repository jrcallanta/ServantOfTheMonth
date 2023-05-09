import { useCallback, useRef, useState } from "react";
import { useOnClickOut } from "../../tools/customHooks";

export const useSortByDropDownLogic = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dropDownRef = useRef(null);

    /********************************
     * useEffect to listen on clicking outside
     * of drop down to set isExpanded to false
     */
    useOnClickOut(dropDownRef, isExpanded, () =>
        setIsExpanded((prev) => false)
    );

    /********************************
     * Handler called to provide
     * toggle expansion of the sort by
     * options.
     */
    const handleToggleExpand = useCallback(() => {
        setIsExpanded((prev) => {
            return !prev;
        });
    }, []);

    return {
        state: { isExpanded },
        handlers: { handleToggleExpand },
        refs: { dropDownRef },
    };
};
