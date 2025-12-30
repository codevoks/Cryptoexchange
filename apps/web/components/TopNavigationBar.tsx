"use client";
import TopHeaderButton from "./TopHeaderButton";
import MclarenLogo from "./McLarenLogo";
import { useState, useEffect } from "react";
import { meResponseType } from "types/logInCheck";
import axios from "axios";
import { topNavButtonStyle } from "../styles/buttonStyles/topNavButtonStyle";
import { usePathname, redirect } from "next/navigation";

export default function TopNavigationBar() {
  const [user, setUser] = useState<meResponseType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const logInCheck = async () => {
    setIsLoading(true);
    setUser(null); // Reset user state before checking
    try {
      const result = await axios.get<meResponseType>("/api/v1/me");
      // Check if response is successful and has valid user data with name field
      if (
        result.status === 200 &&
        result.data &&
        typeof result.data.name === "string" &&
        result.data.name.trim() !== ""
      ) {
        console.log("User logged in:", result.data);
        setUser(result.data);
      } else {
        console.log(
          "API returned invalid response - no valid user data:",
          result.status,
          result.data
        );
        setUser(null);
      }
    } catch (error: any) {
      // If API returns 401 or any error, user is not logged in
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        console.log("User not authenticated - API returned", status);
      } else {
        console.log(
          "API error - user not logged in. Status:",
          status || error.message
        );
      }
      setUser(null);
      // Axios throws error for 4xx/5xx status codes
      // We explicitly set user to null to ensure correct UI state
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/logout");
      setUser(null);
      redirect("/");
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      redirect("/");
    }
  };

  useEffect(() => {
    logInCheck();
  }, [pathname]); // Re-check auth status when route changes

  return (
    <nav className="flex items-center justify-between shadow-lg bg-bg">
      <div className="flex items-center gap-4">
        <MclarenLogo></MclarenLogo>
        <TopHeaderButton text="Home" href="/"></TopHeaderButton>
        <TopHeaderButton text="Dashboard" href="/dashboard"></TopHeaderButton>
        <TopHeaderButton text="Markets" href="/markets"></TopHeaderButton>
      </div>
      <div className="flex items-center gap-4">
        {isLoading ? null : user != null ? ( // Show nothing or a loading indicator while checking auth status
          <button onClick={handleLogout} className={topNavButtonStyle}>
            Logout
          </button>
        ) : (
          <>
            <TopHeaderButton text="Login" href="/login"></TopHeaderButton>
            <TopHeaderButton text="Register" href="/register"></TopHeaderButton>
          </>
        )}
      </div>
    </nav>
  );
}
