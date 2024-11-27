import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar.js";
import axios from "axios";
import "../styling/landingpage.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top

const LandingPage = () => {
  const [userType, setUserType] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [unpublishedBlogs, setUnpublishedBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [sampleBlogs, setSampleBlogs] = useState([]);
  const [editedDescription, setEditedDescription] = useState("");
  const [allBlogs, setAllBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleError, setRoleError] = useState("");
  const [roleSuccess, setRoleSuccess] = useState("");

  // Move useNavigate here inside the component
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");

    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/signin");
  };

  const fetchUsersWithRoles = async () => {
    try {
      const response = await axios.get(
        "https://rbac-backend-y8xs.onrender.com/api/user/fetch-users"
      );
      setUsers(response.data);
      setRoleError(""); // Clear any previous errors
    } catch (error) {
      setRoleError(error.response?.data.message || "Error fetching users.");
    }
  };

  const handleModifyUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(
        "https://rbac-backend-y8xs.onrender.com/api/user/modify-role",
        { userId, newRole }
      );
      setRoleSuccess(response.data.message);
      setRoleError(""); // Clear any previous errors
      fetchUsersWithRoles(); // Refresh the user list
    } catch (error) {
      setRoleError(error.response?.data.message || "Error modifying role.");
      setRoleSuccess("");
    }
  };

  useEffect(() => {
    if (activeContent === "modifyUserRoles") {
      fetchUsersWithRoles();
    }
  }, [activeContent]);

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get(
        "https://rbac-backend-y8xs.onrender.com/api/blog/fetch-all-blogs"
      );
      setAllBlogs(response.data);
      setFetchError(""); // Clear any previous errors
    } catch (error) {
      setFetchError(error.response?.data.message || "Error fetching blogs.");
      setAllBlogs([]); // Clear blogs on error
    }
  };
  useEffect(() => {
    if (activeContent === "viewBlogs") {
      fetchAllBlogs();
    }
  }, [activeContent]);

  const fetchSampleBlogs = async () => {
    try {
      const response = await axios.get(
        "https://rbac-backend-y8xs.onrender.com/api/blog/fetch-sample-blogs"
      );
      setSampleBlogs(response.data);
      setFetchError("");
    } catch (error) {
      setFetchError(
        error.response?.data.message || "Error fetching sample blogs."
      );
      setSampleBlogs([]);
    }
  };

  useEffect(() => {
    if (activeContent === "sampleBlogs") {
      fetchSampleBlogs();
    }
  }, [activeContent]);

  const fetchUnpublishedBlogs = async () => {
    try {
      const response = await axios.get(
        "https://rbac-backend-y8xs.onrender.com/api/blog/fetch-unpublished-blogs"
      );
      setUnpublishedBlogs(response.data);
      setFetchError("");
    } catch (error) {
      setFetchError(
        error.response?.data.message || "Error fetching unpublished blogs."
      );
      setUnpublishedBlogs([]);
    }
  };

  useEffect(() => {
    if (activeContent === "unpublishedBlogs") {
      fetchUnpublishedBlogs();
    }
  }, [activeContent]);

  const handleApproveBlog = async (blogId) => {
    try {
      const managerName = localStorage.getItem("managerName"); // Manager's name
      const response = await axios.post(
        "https://rbac-backend-y8xs.onrender.com/api/blog/approve-blog",
        {
          blogId,
          managerName,
        }
      );
      setSuccess(response.data.message);

      // Refresh blogs
      fetchUnpublishedBlogs();
    } catch (error) {
      setError(error.response?.data.message || "Error approving blog.");
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setEditedTitle(blog.title);
    setEditedDescription(blog.description);
  };

  const handleSubmitEditedBlog = async () => {
    try {
      const managerName = localStorage.getItem("managerName"); // Manager's name
      const response = await axios.put(
        "https://rbac-backend-y8xs.onrender.com/api/blog/edit-blog",
        {
          blogId: editingBlogId,
          title: editedTitle,
          description: editedDescription,
          managerName,
        }
      );
      setSuccess(response.data.message);
      setEditingBlogId(null); // Exit edit mode

      // Refresh blogs
      fetchUnpublishedBlogs();
    } catch (error) {
      setError(error.response?.data.message || "Error editing blog.");
    }
  };

  useEffect(() => {
    const fetchPublishedBlogs = async () => {
      try {
        const response = await axios.get(
          "https://rbac-backend-y8xs.onrender.com/api/blog/fetch-published-blogs"
        );
        setPublishedBlogs(response.data);
        setFetchError("");
      } catch (error) {
        setFetchError(
          error.response?.data.message || "Error fetching published blogs."
        );
        setPublishedBlogs([]);
      }
    };

    if (activeContent === "publishedBlogs") {
      fetchPublishedBlogs();
    }
  }, [activeContent]);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleBlogSubmit = async (e, status) => {
    e.preventDefault();

    const title = e.target.title?.value || ""; // Get the blog title
    const description = e.target.description?.value || ""; // Get the blog description
    const email = localStorage.getItem("email"); // User's email from localStorage

    if (!email) {
      setError("User email not found. Please sign in again.");
      return;
    }

    const blogData = {
      title,
      description,
      status,
      email, // Send the email to the backend
    };

    try {
      const response = await axios.post(
        "https://rbac-backend-y8xs.onrender.com/api/blog/create",
        blogData
      );
      setSuccess(response.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data.message || "Error creating blog.");
      setSuccess("");
    }
  };

  const handleSubscriptionAction = async (subscriptionId, action) => {
    try {
      const response = await axios.post(
        "https://rbac-backend-y8xs.onrender.com/api/user/approve-subscription",
        {
          subscriptionId,
          action,
        }
      );
      setFetchError(""); // Clear any previous errors
      setSuccess(response.data.message);

      // Refresh subscriptions list after approval/rejection
      const fetchSubscriptions = async () => {
        try {
          const response = await axios.get(
            "https://rbac-backend-y8xs.onrender.com/api/user/fetch-subscriptions"
          );
          setSubscriptions(response.data);
        } catch (error) {
          setFetchError(
            error.response?.data.message || "Error fetching subscriptions."
          );
        }
      };

      fetchSubscriptions();
    } catch (error) {
      setFetchError(
        error.response?.data.message || "Error processing request."
      );
      setSuccess("");
    }
  };

  // Fetch subscriptions when 'subscriptionApproval' content is active
  useEffect(() => {
    if (activeContent === "subscriptionApproval") {
      const fetchSubscriptions = async () => {
        try {
          const response = await axios.get(
            "https://rbac-backend-y8xs.onrender.com/api/user/fetch-subscriptions"
          );
          setSubscriptions(response.data);
          setFetchError(""); // Clear any previous errors
        } catch (error) {
          setFetchError(
            error.response?.data.message || "Error fetching subscriptions."
          );
          setSubscriptions([]); // Clear subscriptions on error
        }
      };

      fetchSubscriptions();
    }
  }, [activeContent]); // Only fetch when the active content changes to subscriptionApproval

  const handleMenuClick = (content) => {
    setActiveContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    const userType = localStorage.getItem("userType"); // currentRole of the user
    const role = e.target.role.value;
    const reason = e.target.reason.value;

    if (!email) {
      setError("Email not found. Please sign in again.");
      return;
    }

    const subscriptionData = {
      email,
      currentRole: userType, // Add the current role here
      subscriptionType: role,
      reason,
      userType, // still send userType for backend validation if needed
    };

    try {
      const response = await axios.post(
        "https://rbac-backend-y8xs.onrender.com/api/user/request-subscription",
        subscriptionData
      );
      setSuccess("Subscription request submitted successfully.");
      setError("");
    } catch (error) {
      setError(error.response?.data.message || "Error submitting request.");
      setSuccess("");
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case "modifyUserRoles":
        return (
          <div className="modify-user-roles-container">
            <h2>Modify User Roles</h2>
            {roleError && <p className="error">{roleError}</p>}
            {roleSuccess && <p className="success">{roleSuccess}</p>}
            {users.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Modify Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">{user.role}</td>
                      <td className="border p-2">
                        <select
                          defaultValue={user.role}
                          onChange={(e) =>
                            handleModifyUserRole(user._id, e.target.value)
                          }
                          className="modify-role-select"
                        >
                          <option value="">Select</option>
                          <option value="manager">Manager</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                          <option value="guest">Guest</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-users-message">No users available.</p>
            )}
          </div>
        );

      case "viewBlogs":
        return (
          <div className="view-blogs-container">
            <h2 className="view-blogs-heading">All Blogs</h2>
            {fetchError && <p className="error">{fetchError}</p>}
            {allBlogs.length > 0 ? (
              <table className="view-blogs-table min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="view-blogs-header border p-2">Title</th>
                    <th className="view-blogs-header border p-2">
                      Description
                    </th>
                    <th className="view-blogs-header border p-2">Created By</th>
                    <th className="view-blogs-header border p-2">Created At</th>
                    <th className="view-blogs-header border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="view-blogs-data border p-2">
                        {blog.title}
                      </td>
                      <td className="view-blogs-data border p-2">
                        {blog.description}
                      </td>
                      <td className="view-blogs-data border p-2">
                        {blog.createdBy}
                      </td>
                      <td className="view-blogs-data border p-2">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="view-blogs-data border p-2">
                        {blog.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-blogs-message">No blogs available.</p>
            )}
          </div>
        );

      case "subscriptionApproval":
        return (
          <div className="subscription-approval-container">
            <h2 className="subscription-approval-heading">
              Subscription Approval
            </h2>
            {fetchError && <p className="error-message">{fetchError}</p>}
            {subscriptions.length === 0 ? (
              <p className="no-subscriptions-message">
                No subscription requests found.
              </p>
            ) : (
              <ul className="subscription-list">
                {subscriptions.map((subscription) => (
                  <li key={subscription._id} className="subscription-item">
                    <p className="subscription-info">
                      <strong>Created By:</strong> {subscription.createdBy}
                    </p>
                    <p className="subscription-info">
                      <strong>Current Role:</strong> {subscription.currentRole}
                    </p>
                    <p className="subscription-info">
                      <strong>Subscription Type:</strong>{" "}
                      {subscription.subscriptionType}
                    </p>
                    <p className="subscription-info">
                      <strong>Reason:</strong> {subscription.reason}
                    </p>
                    <p className="subscription-info">
                      <strong>Status:</strong> {subscription.status}
                    </p>
                    <div className="subscription-actions">
                      {subscription.status === "requested" && (
                        <button
                          onClick={() =>
                            handleSubscriptionAction(
                              subscription._id,
                              "approve"
                            )
                          }
                          className="approve-button"
                        >
                          Approve
                        </button>
                      )}
                      {subscription.status === "requested" && (
                        <button
                          onClick={() =>
                            handleSubscriptionAction(subscription._id, "reject")
                          }
                          className="reject-button"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "unpublishedBlogs":
        return (
          <div className="unpublished-blogs-container">
            <h2 className="unpublished-blogs-heading">Unpublished Blogs</h2>
            {fetchError && <p className="error-message">{fetchError}</p>}
            {unpublishedBlogs.length === 0 ? (
              <p className="no-blogs-message">No unpublished blogs found.</p>
            ) : (
              <ul className="blog-list">
                {unpublishedBlogs.map((blog) => (
                  <li key={blog._id} className="blog-item">
                    {editingBlogId === blog._id ? (
                      <>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="input-field"
                        />
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="input-field"
                          rows="5"
                        ></textarea>
                        <button
                          onClick={handleSubmitEditedBlog}
                          className="submit-button"
                        >
                          Submit
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="blog-title">{blog.title}</h3>
                        <p className="blog-description">{blog.description}</p>
                        <small className="blog-meta">
                          <strong>Created By:</strong> {blog.createdBy} |{" "}
                          <strong>Created At:</strong>{" "}
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </small>
                        <div className="blog-actions">
                          <button
                            onClick={() => handleApproveBlog(blog._id)}
                            className="approve-button"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "createBlog":
        return (
          <div className="create-blog-container">
            <h2 className="create-blog-heading">Create Blog</h2>
            <form
              onSubmit={(e) =>
                handleBlogSubmit(
                  e,
                  e.nativeEvent.submitter.getAttribute("data-status")
                )
              }
              className="create-blog-form"
            >
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Blog Content
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  rows="5"
                  required
                ></textarea>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <div className="form-buttons">
                <button
                  type="submit"
                  data-status="draft"
                  className="submit-button draft-button"
                >
                  Submit for Approval (Draft)
                </button>
                <button
                  type="submit"
                  data-status="sample"
                  className="submit-button sample-button"
                >
                  Publish (Sample)
                </button>
              </div>
            </form>
          </div>
        );

      case "publishedBlogs":
        return (
          <div className="published-blogs-container">
            <h2 className="published-blogs-heading">Published Blogs</h2>
            {fetchError && <p className="error-message">{fetchError}</p>}
            {publishedBlogs.length === 0 ? (
              <p className="no-blogs-message">No published blogs found.</p>
            ) : (
              <ul className="blog-list">
                {publishedBlogs.map((blog) => (
                  <li key={blog._id} className="blog-item">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-description">{blog.description}</p>
                    <small className="blog-meta">
                      <strong>Created By:</strong> {blog.createdBy} |{" "}
                      <strong>Published At:</strong>{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "about":
        return (
          <div className="about-container">
            <h2 className="about-title">
              About Content Management System (CMS)
            </h2>
            <p className="about-description">
              A Content Management System (CMS) is a software application that
              allows users to create, manage, and modify content on a website
              without needing specialized technical knowledge. It provides an
              easy-to-use interface for adding and organizing content, making it
              accessible to a wider range of users, from content creators to
              administrators.
            </p>
            <h3 className="about-subheading">Key Features of Our CMS</h3>
            <ul className="about-features-list">
              <li>
                <strong>Easy Content Creation:</strong> Create blog posts,
                articles, and other types of content with a user-friendly
                editor.
              </li>
              <li>
                <strong>Role-Based Access:</strong> Manage different user roles
                and permissions, such as admins, editors, and viewers.
              </li>
              <li>
                <strong>Content Scheduling:</strong> Schedule content to be
                published at specific times, allowing for better content
                planning.
              </li>
              <li>
                <strong>Content Review and Approval:</strong> Enable an approval
                process to ensure that content is reviewed before it goes live.
              </li>
              <li>
                <strong>SEO Optimization:</strong> Optimize your content for
                search engines, helping your site rank higher in search results.
              </li>
              <li>
                <strong>Mobile-Responsive:</strong> Our CMS ensures that your
                content looks great across all devices, including smartphones
                and tablets.
              </li>
            </ul>
            <h3 className="about-subheading">Why Choose Our CMS?</h3>
            <p className="about-description">
              Our CMS is designed to be both powerful and user-friendly, making
              it suitable for a wide range of users, from beginners to advanced
              users. Whether you're managing a personal blog, an e-commerce
              store, or a large corporate website, our CMS provides the tools
              you need to keep your site running smoothly and your content
              engaging.
            </p>
          </div>
        );

      case "sampleBlogs":
        return (
          <div className="sample-blogs-container">
            <h2 className="section-title">Sample Blogs</h2>
            {fetchError && <p className="error-message">{fetchError}</p>}
            {sampleBlogs.length > 0 ? (
              <ul className="blog-list">
                {sampleBlogs.map((blog) => (
                  <li key={blog._id} className="blog-item">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-description">{blog.description}</p>
                    <small className="blog-meta">
                      <strong>Created By:</strong> {blog.createdBy} |{" "}
                      <strong>Published At:</strong>{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sample blogs found.</p>
            )}
          </div>
        );

      case "subscription":
        return (
          <div className="subscription-container">
            <h2 className="section-title">Request Role Promotion</h2>
            <form onSubmit={handleSubmit} className="subscription-form">
              <div className="form-group">
                <label htmlFor="role">
                  Select the role you want to be promoted to:
                </label>
                <select id="role" name="role" className="form-input">
                  <option value="manager">Manager</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reason">
                  Why do you think you deserve this promotion?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  className="form-input"
                  rows="4"
                  placeholder="Provide the reason why you are asking for this promotion or why you think you are suitable for it."
                  required
                ></textarea>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </form>
          </div>
        );

      default:
        return <h1>Welcome to the Landing Page</h1>;
    }
  };

  if (!userType) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        <Sidebar
          userType={userType}
          onMenuClick={handleMenuClick}
          onLogout={handleLogout}
        />
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default LandingPage;
