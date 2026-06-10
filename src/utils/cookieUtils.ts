import Cookies from "js-cookie";

export const clearAllCookies = () => {
  Object.keys(Cookies.get()).forEach((name) => {
    Cookies.remove(name);
    Cookies.remove(name, { path: "/" });
  });
};
