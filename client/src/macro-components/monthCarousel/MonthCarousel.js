import { useMonthCarouselLogic } from "./_MonthCarouselLogic";
import "../../styles/css/macro-components/monthCarousel/MonthCarousel.css";

function MonthCarousel(props) {
    const {
        refs: { monthCarouselRef, selectedMonthRef },
        constants: { months },
    } = useMonthCarouselLogic(props);

    return (
        <div className='MonthCarousel' ref={monthCarouselRef}>
            <div className='slider'>
                {months.map((month, i) => (
                    <div
                        key={i}
                        ref={
                            i === props.selectedMonth ? selectedMonthRef : null
                        }
                        onClick={() => props.setSelectedMonth(i)}
                        className={
                            props.selectedMonth === i
                                ? "monthItem active"
                                : "monthItem"
                        }
                    >
                        <h2 className='monthItem__text'>{month}</h2>
                    </div>
                ))}
            </div>

            {/* <div className='slider'>
                {[2021, 2022, 2023].map((elem, j) => (
                    <div className='monthSlider' key={j}>
                        <p>{elem}</p>
                        {months.map((month, i) => (
                            <div
                                ref={
                                    i === props.selectedMonth
                                        ? selectedMonthRef
                                        : null
                                }
                                key={j}
                                onClick={() => props.setSelectedMonth(i)}
                                className={
                                    props.selectedMonth === i
                                        ? "monthItem active"
                                        : "monthItem"
                                }
                            >
                                <h2 className='monthItem__text'>{month}</h2>
                            </div>
                        ))}
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default MonthCarousel;
