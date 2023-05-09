import { useEffect } from "react";

import "../../styles/css/macro-components/binSelector/BinSelector.css";

function BinSelector(props) {
    useEffect(() => {}, []);

    return (
        <div className='BinSelector'>
            {props.bins.map((bin, i) => (
                <div
                    key={i}
                    className={
                        props.selectedBinIndex === i ? "bin active" : "bin"
                    }
                    onClick={() => props.setSelectedBinIndex(i)}
                >
                    <h3 className='bin__text'>{bin}</h3>
                </div>
            ))}
        </div>
    );
}

export default BinSelector;
