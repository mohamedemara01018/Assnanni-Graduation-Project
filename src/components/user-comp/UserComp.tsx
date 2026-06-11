/* eslint-disable react-hooks/static-components */
import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, ChevronDown, User, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth/authSlice";
import { clearEmail } from "../../store/slices/email/emailSlice";
import Cookies from "js-cookie";

function UserComp() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userProfileCookie = Cookies.get("userProfile");
  const userProfile = userProfileCookie ? JSON.parse(userProfileCookie) : null;
  const fullName = userProfile?.fullName || userProfile?.name || "User";
  let imageUrl = userProfile?.imageUrl;
  if (String(imageUrl)?.length === 26) imageUrl = "";

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserMenu]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearEmail());
    setShowUserMenu(false);
    navigate("/");
  };

  const Avatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
    return (
      <div
        className={`${dim} rounded-full shrink-0 flex items-center justify-center overflow-hidden font-semibold text-xs`}
        style={{ background: "var(--color-bg-blue)", color: "var(--color-primary)" }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
        )}
      </div>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* ── Trigger ── */}
      <button
        onClick={() => setShowUserMenu((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={showUserMenu}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer"
        style={{
          background: showUserMenu ? "var(--color-bg-link-hover)" : "transparent",
          border: "1px solid var(--color-border)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-link-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = showUserMenu ? "var(--color-bg-link-hover)" : "transparent")}
      >
        <Avatar size="sm" />
        <span
          className="text-sm font-medium max-sm:hidden"
          style={{ color: "var(--color-text)" }}
        >
          {fullName}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 max-sm:hidden ${showUserMenu ? "rotate-180" : ""}`}
          style={{ color: "var(--color-text-light)" }}
        />
      </button>

      {/* ── Dropdown ── */}
      {showUserMenu && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-40"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {/* User info header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <Avatar size="md" />
            <div className="min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--color-text)" }}
              >
                {fullName}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: "var(--color-text-light)" }}
              >
                {userProfile?.email || "user@example.com"}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="py-1.5">
            {[
              { to: "/profile", icon: UserCircle, label: "Profile" },
              { to: "/settings", icon: Settings, label: "Settings" },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                style={{ color: "var(--color-text-light)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-link-hover)";
                  e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-light)";
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--color-border)" }} />

          {/* Logout */}
          <div className="py-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: "#dc2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserComp;
