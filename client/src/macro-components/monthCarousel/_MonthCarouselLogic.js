import { useEffect, useMemo, useRef } from "react";

export const useMonthCarouselLogic = (props) => {
    const selectedMonthRef = useRef(null);
    const monthCarouselRef = useRef(null);

    const months = useMemo(
        () =>
            Array(12)
                .fill(0)
                .map((e, i) =>
                    new Date(2023, i, 1).toLocaleString("default", {
                        month: "long",
                    })
                ),
        []
    );

    useEffect(() => {
        console.log("ref changed");
        monthCarouselRef.current
            .querySelector(".monthItem.active")
            .scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
    }, [monthCarouselRef, props.selectedMonth]);

    return {
        refs: { selectedMonthRef, monthCarouselRef },
        constants: { months },
    };
};
