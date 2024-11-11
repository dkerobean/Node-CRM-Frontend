import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

const ContactAddPage = () => {
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    notes: "",
    status: "lead",
    assignedTo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        const userOptions = data.map(user => ({
          label: user.name,
          value: user._id
        }));
        setUsers(userOptions);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching users");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/contact/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Contact added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          position: "",
          notes: "",
          status: "lead",
          assignedTo: ""
        });
      } else {
        setError(data.message || "Failed to add contact");
      }
    } catch (err) {
      setError("Error adding contact");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Add New Contact">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone"
                required
              />
            </div>

            <div>
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter company"
                required
              />
            </div>

            <div>
              <label className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter position"
                required
              />
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="form-label">Assigned To</label>
              <select
                className="form-control"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                required
              >
                <option value="">Select user</option>
                {users.map(user => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter notes"
                rows="4"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              text={loading ? "Adding..." : "Add Contact"}
              type="submit"
              className="btn-dark"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ContactAddPage;