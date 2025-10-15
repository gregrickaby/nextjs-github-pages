import type { FC } from "react";

/**
 * @author
 * @function @Header
 **/

export const Header: FC = () => {
  return (
    <header className="sticky top-0">
      <nav>
        <ul className="px-10 py-5 flex gap-10 justify-end">
          <li>About</li>
          <li>Projects</li>

          <li>Experience</li>
          <li>Github</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
