import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import darkModeContext from "./darkModeContext";
import userContext from "./userContext";
import { setTokenCookie } from "../pages/login";

const Header: React.FC = () => {
  const darkMode = useContext(darkModeContext).darkMode;
  const setDarkMode = useContext(darkModeContext).setDarkMode;
  const user = useContext(userContext).user;
  const setUser = useContext(userContext).setUser;
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const signOut = async () => {
    await router.push("/"); // Go to feed page
    setUser({ username: "", email: "", token: "", imageUrl:"" })
    setTokenCookie("");
  };
  const isUserLogged = user?.username != "";
  const status = {}; //TODO Delete or update (Check how to get the status without next-auth, i'm not sure it's a must)

  let left = (
    <div className="left">
      <Link href="/" legacyBehavior>
        <a className="bold" data-active={isActive("/")}>
          Feed
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: ${darkMode ? "#FFFFFF" : "#000"};
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: ${darkMode ? "rbga(0,0,0,0.7)" : "gray"};
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/" legacyBehavior>
          <a className="bold" data-active={isActive("/")}>
            Feed
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: ${darkMode ? "#FFFFFF" : "#000"};
            display: inline-block;
          }

          .left a[data-active="true"] {
            color: ${darkMode ? "rbga(0,0,0,0.7)" : "gray"};
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <button onClick={() => setDarkMode(!darkMode)}><a>Dark mode</a></button>
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!isUserLogged) {
    right = (
      <div className="right">
        <button onClick={() => setDarkMode(!darkMode)}><a>Dark mode</a></button>
        <Link href="/login" legacyBehavior>
          <a>Log in</a>
        </Link>
        <Link href="/register" legacyBehavior>
          <a>Sign up</a>
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: ${darkMode ? "#FFFFFF" : "#000"};
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
      </div>
    );
  }

  if (isUserLogged) {
    left = (
      <div className="left">
        <Link href="/" legacyBehavior>
          <a className="bold" data-active={isActive("/")}>
            Feed
          </a>
        </Link>
        <Link href={`/drafts`} legacyBehavior>
          <a data-active={isActive("/drafts")}>My drafts</a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: ${darkMode ? "#FFFFFF" : "#000"};
            display: inline-block;
          }

          .left a[data-active="true"] {
            color: ${darkMode ? "rbga(0,0,0,0.7)" : "gray"};
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <button onClick={() => setDarkMode(!darkMode)}><a>Dark mode</a></button>
        <p>
          {user?.username} ({user?.email})
        </p>
        <Link href="/create" legacyBehavior>
          <button className="action-NewPostButton">
            <a>New post</a>
          </button>
        </Link>
        <Link href="/profile" legacyBehavior>
          <button className="action-ProfileButton">
            <a>Profile</a>
          </button>
        </Link>
        <button onClick={async () => await signOut()}>
          <a>Log out</a>
        </button>
        <style jsx>{`
          a {
            text-decoration: none;
            color: ${darkMode ? "#FFFFFF" : "#000"};
            display: inline-block;
          }

          p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
            ${darkMode ? "color: #FFFFFF" : ""}
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          button {
            border: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
