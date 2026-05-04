import logo from "../../assets/logo.png";
import { Link, NavLink } from "react-router";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import useMediaQuery from "@/hooks/useMediaQuery ";
import { List, X } from "lucide-react";
import { useState } from "react";
import UserComp from "../user-comp/UserComp";

function Header() {
  // const [toggle, setToggle] = useState<boolean>(false)
  const [showMobileMenu, setMobileMenu] = useState(true);
  const user = false;
  const links = [
    { name: "Home", path: "/" },
    { name: "Find Doctors", path: "/doctors-list" },
    { name: "About Us", path: "/faq" },
    { name: "Support", path: "/support" },
  ];

  const isMobile = useMediaQuery("(max-width: 955px)");

  return (
    <header className="bg-(--color-surface) border-b-2 border-b-(--color-border) fixed top-0 left-0 right-0 z-20">
      <div className=" wrapper   flex items-center justify-between py-4 ">
        <div className="flex items-center gap-7">
          <Link to={"/"} className="flex items-center gap-1">
            <img src={logo} alt="" className=" h-15" />
            {/* <h1 className="text-2xl font-bold">Assnani</h1> */}
          </Link>

          {!isMobile && (
            <nav>
              <ul className="flex gap-2">
                {links &&
                  links.map((link) => {
                    return (
                      <li key={link.name}>
                        <NavLink
                          to={link.path}
                          className={({ isActive, isPending }) =>
                            `px-4 py-2 block rounded-md  hover:bg-(--color-bg-link-hover) font-semibold ${
                              isPending
                                ? ""
                                : isActive
                                  ? "bg-(--color-bg-blue) text-(--color-text-blue)"
                                  : "hover:bg-(--color-bg-link-hover)"
                            }`
                          }
                        >
                          {link.name}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={() => setMobileMenu(!showMobileMenu)}
              className="cursor-pointer p-2 rounded-xl hover:bg-(--color-bg-link-hover) transition-all duration-300 hover:scale-110"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <List className="w-5 h-5 text-foreground" />
              )}
            </button>
          )}

          <ThemeToggle />

          {!isMobile && !user && (
            <div className="flex items-center gap-2">
              <Link
                to={"/login"}
                className="text-(--color-primary) hover:bg-black/5 hover:dark:bg-white/15 py-2 px-4 rounded-sm cursor-pointer transform duration-200"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className=" text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm cursor-pointer transform duration-200"
              >
                Register
              </Link>
            </div>
          )}
          {user && <UserComp />}
        </div>

        {showMobileMenu && isMobile && (
          <div className="fixed top-23 left-0 right-0 p-4 bg-(--color-surface) border border-t-2">
            <nav>
              <ul className="flex flex-col gap-2">
                {links &&
                  links.map((link) => {
                    return (
                      <li key={link.name}>
                        <NavLink
                          to={link.path}
                          className={({ isActive, isPending }) =>
                            `px-4 py-2 block rounded-md  hover:bg-(--color-bg-link-hover) font-semibold ${
                              isPending
                                ? ""
                                : isActive
                                  ? "bg-(--color-bg-blue) text-(--color-text-blue)"
                                  : "hover:bg-(--color-bg-link-hover)"
                            }`
                          }
                        >
                          {link.name}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>

              {!user && (
                <div className="flex flex-col pt-2 gap-2">
                  <Link
                    to={"/login"}
                    className="text-(--color-primary) hover:bg-black/5 hover:dark:bg-white/15 py-2 px-4 rounded-sm cursor-pointer transform duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/register"}
                    className="text-center text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm cursor-pointer transform duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
