import _ from "lodash";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../assets/MenuIcon.svg";
import "../../styles/css/layout/NavFrame/NavFrame.css";
import { useNavFrameLogic } from "./_NavFrameLogic";

function NavFrame(props) {
    const {
        navItems,
        refs: { navbarRef, navListRef },
        state: { isNavExpanded, navIndex },
        handlers: { handleToggleNavExpand, handleNavLinkClass },
    } = useNavFrameLogic(props);

    return (
        <div className='NavFrame'>
            <div className='navbar' ref={navbarRef}>
                <div className='icon' onClick={handleToggleNavExpand}>
                    <MenuIcon />
                </div>
                <div
                    ref={navListRef}
                    className='nav'
                    data-aria-expanded={isNavExpanded}
                    style={{ "--length": navItems.length }}
                    onClick={handleToggleNavExpand}
                >
                    <ul className='nav__list' style={{ "--offset": navIndex }}>
                        {navItems.map((item, i) => (
                            <li key={i}>
                                <NavLink
                                    tabIndex={-1}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        handleNavLinkClass(
                                            isActive,
                                            item.className
                                        )
                                    }
                                    onClick={item.onClick ? item.onClick : ""}
                                >
                                    {_.capitalize(item.name)}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className='frame' data-aria-disabled={isNavExpanded}>
                <Outlet />
            </div>
        </div>
    );
}

export default NavFrame;
