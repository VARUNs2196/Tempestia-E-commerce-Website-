import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../css/vendorDashboard.css";
import { useAuth } from "../auth/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

const VendorDashboard = () => {
  const [stats, setStats] = useState(null); // Start with null
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await API.get("/vendor/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleVisitStore = () => {
    navigate(`/store/${user._id}`);
  };

  if (loading) return <div className="loader">Loading vendor dashboard...</div>;

  if (!stats) return <div className="error">Failed to load vendor stats.</div>;

  return (
    <div className="vendor-dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Vendor Dashboard</h2>
        <button className="visit-store-button" onClick={handleVisitStore}>
          Visit Store
        </button>
      </div>

      <div className="card-grid">
        <div className="custom-card">
          <div className="custom-card-content">
            <h4 className="custom-card-title">Total Sales</h4>
            <p className="custom-card-value">${stats.totalSales || 0}</p>
          </div>
        </div>

        <div className="custom-card">
          <div className="custom-card-content">
            <h4 className="custom-card-title">Top Product</h4>
            <p className="custom-card-subvalue">
              {stats.topProducts?.[0]?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="custom-card">
          <div className="custom-card-content">
            <h4 className="custom-card-title">Products Sold</h4>
            {stats.productsSold?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.productsSold}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No product sales data.</p>
            )}
          </div>
        </div>

        <div className="custom-card">
          <div className="custom-card-content">
            <h4 className="custom-card-title">Category Distribution</h4>
            {stats.categoryStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.categoryStats.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No category data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
