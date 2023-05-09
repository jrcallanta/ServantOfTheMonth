import { useCallback, useEffect } from "react";

// export const useOnImgLoad = (styles) => {
//     return ({ target }) => {
//         Object.entries(styles).forEach(([key, value]) => {
//             target.style[key] = value;
//         });
//     };
// };

// export const useOnAllImgLoad = (
//     selector,
//     callback,
//     options = { loadSelector: "img" }
// ) => {
//     useEffect(() => {
//         let container = document.querySelector(selector);
//         if (!container) return;

//         let imgs = container.querySelectorAll(options.loadSelector),
//             length = imgs.length,
//             completed = 0;
//         if (!length) return;

//         let increment = () => {
//             // console.log(container, "counter++");
//             completed++;

//             if (completed === length) {
//                 // console.log(container, "completed");
//                 return callback(container);
//             }
//         };

//         [].forEach.call(imgs, (img) => {
//             if (img.complete) increment();
//             else img.addEventListener("load", increment);
//             console.log(img);
//         });

//         return () => {
//             [].forEach.call(imgs, (img) => {
//                 img.removeEventListener("load", increment);
//             });
//         };
//     }, []);
// };

// export const useOnSelectorLoad = ({ selector, selectorAll }) => {
//     if (selector) {
//         const elem = document.querySelector(selector);
//         if (!elem) return;
//         elem.style.opacity = "0";
//         console.log(elem);

//         elem.addEventListener("load", ({ target }) => {
//             target.style.opacity = "1";
//         });
//     }

//     if (selectorAll) {
//         const elems = document.querySelectorAll(selectorAll);
//         if (!elems.length) return;
//         elems.forEach((e) => {
//             e.style.opacity = "0";

//             e.addEventListener("load", ({ target }) => {
//                 target.style.opacity = "1";
//             });
//         });
//     }
// };

export const useOnClickOut = (elemRef, condition, callback) => {
    const clickHandler = useCallback(
        (event) => {
            if (elemRef.current && !elemRef.current.contains(event.target))
                callback();
        },
        [callback, elemRef]
    );

    useEffect(() => {
        if (condition) window.addEventListener("click", clickHandler);
        else window.removeEventListener("click", clickHandler);
        return () => window.removeEventListener("click", clickHandler);
    }, [condition, clickHandler]);

    return [elemRef];
};

export const useOnLeave = (elemRef, condition, callback) => {
    useEffect(() => {
        const { current } = elemRef;
        const handleLeave = (event) => callback();

        if (condition && current)
            current.addEventListener("mouseleave", handleLeave);

        return () => current?.removeEventListener("mouseleave", handleLeave);
    }, [elemRef, condition, callback]);
};
