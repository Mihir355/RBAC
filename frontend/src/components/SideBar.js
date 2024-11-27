import React from "react";
import "../styling/sidebar.css";

const Sidebar = ({ userType, onMenuClick, onLogout }) => {
  const renderNavbarItems = () => {
    switch (userType) {
      case "admin":
        return (
          <>
            <li>
              <a onClick={() => onMenuClick("modifyUserRoles")}>
                Modify User Roles
              </a>
            </li>
            <li>
              <a onClick={() => onMenuClick("viewBlogs")}>View All Blogs</a>
            </li>
            <li>
              <a onClick={() => onMenuClick("subscriptionApproval")}>
                Subscription Approval
              </a>
            </li>
          </>
        );
      case "manager":
        return (
          <>
            <li>
              <a onClick={() => onMenuClick("unpublishedBlogs")}>
                Unpublished Blogs
              </a>
            </li>
          </>
        );
      case "editor":
        return (
          <>
            <li>
              <a onClick={() => onMenuClick("createBlog")}>Create Blog</a>
            </li>
            <li>
              <a onClick={() => onMenuClick("publishedBlogs")}>
                Published Blogs
              </a>
            </li>
            <li>
              <a onClick={() => onMenuClick("subscription")}>Subscription</a>
            </li>
          </>
        );
      case "viewer":
        return (
          <>
            <li>
              <a onClick={() => onMenuClick("publishedBlogs")}>
                Published Blogs
              </a>
            </li>
            <li>
              <a onClick={() => onMenuClick("subscription")}>Subscription</a>
            </li>
          </>
        );
      case "guest":
        return (
          <>
            <li>
              <a onClick={() => onMenuClick("about")}>About</a>
            </li>
            <li>
              <a onClick={() => onMenuClick("sampleBlogs")}>Sample Blogs</a>
            </li>
            <li>
              <a onClick={() => onMenuClick("subscription")}>Subscription</a>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <ul>
        {renderNavbarItems()}
        <li>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
