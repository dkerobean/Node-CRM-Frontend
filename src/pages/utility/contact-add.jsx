import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { toast } from "react-toastify";

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
        toast.error("Failed to fetch users")
      }
    } catch (err) {
      toast.error("Error fetching users");
      console.error(err);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
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
        toast.success("Contact added successfully!");
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
        toast.error("Error adding contact", data.message);
      }
    } catch (err) {
      toast.error("Error adding contact");
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
              <Textinput
                label="Name"
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required={true}
              />
            </div>

            <div>
              <Textinput
                label="Email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required={true}
              />
            </div>

            <div>
              <Textinput
                label="Phone"
                type="text"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                required={true}
              />
            </div>

            <div>
              <Textinput
                label="Company"
                type="text"
                placeholder="Enter company"
                value={formData.company}
                onChange={handleInputChange('company')}
                required={true}
              />
            </div>

            <div>
              <Textinput
                label="Position"
                type="text"
                placeholder="Enter position"
                value={formData.position}
                onChange={handleInputChange('position')}
                required={true}
              />
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={handleInputChange('status')}
                required
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="form-label">Assigned To</label>
              <Select
                className="form-control"
                value={formData.assignedTo}
                onChange={handleInputChange('assignedTo')}
                required
              >
                <option value="">Select user</option>
                {users.map(user => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Textarea
                label="Notes"
                placeholder="Enter notes"
                value={formData.notes}
                onChange={handleInputChange('notes')}
                rows={4}
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