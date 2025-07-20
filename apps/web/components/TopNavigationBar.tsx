import TopHeaderButton from "./TopHeaderButton";
import MclarenLogo from "./McLarenLogo";

export default function TopNavigationBar() {
    const loggedin = !true;
  return (
    <nav className="flex items-center justify-between shadow-lg bg-bg">
      <div className="flex items-center gap-4">
        <MclarenLogo></MclarenLogo>
        <TopHeaderButton text = "Home" href="/"></TopHeaderButton>
        <TopHeaderButton text = "Dashboard" href="/dashboard"></TopHeaderButton>
        <TopHeaderButton text = "Markets" href="/markets"></TopHeaderButton>
      </div>
      <div className="flex items-center gap-4">
        {loggedin? (
          <TopHeaderButton text="Logout" href="/logout"></TopHeaderButton>
        ):(
          <>
            <TopHeaderButton text="Login" href="/login"></TopHeaderButton>
            <TopHeaderButton text="Register" href="/register"></TopHeaderButton>
          </>
        )}
      </div>
    </nav>
  );
}