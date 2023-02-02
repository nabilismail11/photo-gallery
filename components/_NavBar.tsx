import Link from "next/link";
import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";
const NavBar = () => {
  const session = useSession();

  return (
    <div>
      <div className="header">
        <a className="logo" href="/">
          {/* <Image src="/../public/logo.jpg" alt={""} width={100} height={100} /> */}
        </a>
        <li className="nav__links">
          <Link href="/">
            <p>Home</p>
          </Link>
        </li>
        {session && (
          <li className="nav__links">
            <Link href="/myPosts">
              <p>My Posts</p>
            </Link>
          </li>
        )}
        <li className="nav__links">
          <Link href="/signup">
            <p>{!session ? "Sign In" : "Profile"}</p>
          </Link>
        </li>
        <li className="nav__links">
          <Link href="/addPost">
            <p className="cta">Add Post</p>
          </Link>
        </li>
      </div>
    </div>
  );
};

export default NavBar;
