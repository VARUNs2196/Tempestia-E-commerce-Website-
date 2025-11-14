import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import "../css/AdminDashboard.css"; // Import your custom CSS

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [userRes, requestRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", { headers }),
        axios.get("http://localhost:5000/api/users/vendor-requests", { headers }),
      ]);
      setUsers(userRes.data);
      setVendorRequests(requestRes.data);
    };
    fetchData();
  }, []);

  const changeRole = async (id, newRole) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/users/${id}`, { role: newRole }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
    setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, role: newRole, vendorRequest: false } : u
        )
      );
    };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
      </div>

      <section className="user-section">
        <h2>All Users</h2>
        <ul className="user-list">
  {users.map((u) => (
    <li key={u._id} className="user-item">
      <span>{u.name} ({u.email}) - <strong>{u.role}</strong></span>
      <div className="role-selector">
        <select
          defaultValue={u.role}
          onChange={(e) => changeRole(u._id, e.target.value)}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </li>
  ))}
</ul>

      </section>

      <section className="vendor-requests">
        <h2>Pending Vendor Requests</h2>
        <ul className="request-list">
          {vendorRequests.map((u) => (
            <li key={u._id} className="request-item">
              <span>{u.name} ({u.email})</span>
              <button
                className="btn-approve-vendor"
                onClick={() => changeRole(u._id, "vendor")}
              >
                Approve Vendor
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
