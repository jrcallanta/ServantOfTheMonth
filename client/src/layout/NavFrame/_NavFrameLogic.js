import {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext,
} from "react";
import { useLocation } from "react-router";
import { useOnClickOut } from "../../tools/customHooks";
import { AuthContext } from "../../store/auth-context";

export const useNavFrameLogic = (props) => {
    const ctx = useContext(AuthContext);

    const navListRef = useRef(null);
    const navbarRef = useRef(null);
    const [navIndex, setNavIndex] = useState();
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const location = useLocation();

    /********************************
     * useEffect to listen on clicking outside
     * navList to set isExpanded to false
     */
    useOnClickOut(navbarRef, isNavExpanded, () => setIsNavExpanded(false));

    /*********************
     * An array of available pages
     * accessible via nav tabs.
     */
    const navItems = useMemo(
        () => [
            // { name: "dashboard", path: "dashboard" },
            { name: "votes", path: "votes" },
            // { name: "history", path: "history" },
            // { name: "settings", path: "settings" },
            {
                name: "logout",
                onClick: () =>
                    ctx.handlers.logOutHandler((error) => {
                        console.log(error);
                    }),
                className: "nav__item critical",
            },
        ],
        [ctx.handlers]
    );

    /********************************
     * useEffect to listen to location
     * and display the corresponding
     * navIndex/navItem
     */
    useEffect(() => {
        const subroots = location.pathname.split("/").filter((e) => e !== "");
        if (subroots.length > 1 && navItems) {
            const index = navItems
                .map((item) => item.name?.toLowerCase())
                .indexOf(location.pathname?.split("/")[2].toLowerCase());

            setNavIndex((prev) => index);
            setIsNavExpanded((prev) => false);
        }
    }, [navItems, location, setNavIndex, setIsNavExpanded]);

    /********************************
     * Handler called to provide
     * corresponding NavLink classname
     * depending on active state.
     */
    const handleNavLinkClass = (isActive, className) => {
        return className
            ? className
            : isActive
            ? "nav__item active"
            : "nav__item";
    };

    /********************************
     * Handler called to provide
     * toggle expansion of the nav,
     * triggering animations.
     */
    const handleToggleNavExpand = useCallback(() => {
        setIsNavExpanded((prev) => {
            if (prev) {
                navListRef.current.addEventListener(
                    "transitionend",
                    () => {
                        console.log("transitionend");
                        navListRef.current.style.overflow = "";
                    },
                    { once: true }
                );
            } else {
                navListRef.current.style.overflow = "visible";
            }

            return !prev;
        });
    }, [navListRef]);

    return {
        state: {
            navIndex,
            isNavExpanded,
        },
        handlers: {
            handleNavLinkClass,
            handleToggleNavExpand,
        },
        refs: {
            navListRef,
            navbarRef,
        },
        navItems,
    };
};
