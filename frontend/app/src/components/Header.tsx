import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header>
      <nav className="header_circles_box">
        <div className="header_circles_box_1"></div>
        <div className="header_circles_box_2"></div>
        <div className="header_circles_box_3"></div>
        <div className="header_circles_box_4"></div>
      </nav>
      {user && (
        <div className="header_user_info">
          <span>{user.email}</span>
          <button className="btn-logout" onClick={() => signOut(auth)}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      )}
    </header>
  );
};
