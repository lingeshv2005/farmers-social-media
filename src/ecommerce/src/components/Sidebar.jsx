import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <Link to="/">🏠 Home</Link>
        </li>
        <li>
          <Link to="/category/vegetables">🥕 Vegetables</Link>
        </li>
        <li>
          <Link to="/category/fruits">🍎 Fruits</Link>
        </li>
        <li>
          <Link to="/category/dairy">🥛 Dairy Products</Link>
        </li>
        <li>
          <Link to="/category/seeds">🌱 Seeds</Link>
        </li>
        <li>
          <Link to="/category/tools">🛠️ Farming Tools</Link>
        </li>
        <li>
          <Link to="/category/others">📦 Others</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
