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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Textinput
              label="Name"
              type="text"
              placeholder="Enter name"
              {...register("name", { required: "Name is required" })}
              error={errors.name}
            />

            <Textinput
              label="Email"
              type="email"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
              error={errors.email}
            />

            <Textinput
              label="Phone"
              type="text"
              placeholder="Enter phone"
              {...register("phone", { required: "Phone number is required" })}
              error={errors.phone}
            />

            <Textinput
              label="Company"
              type="text"
              placeholder="Enter company"
              {...register("company", { required: "Company is required" })}
              error={errors.company}
            />

            <Textinput
              label="Position"
              type="text"
              placeholder="Enter position"
              {...register("position", { required: "Position is required" })}
              error={errors.position}
            />

            <div>
              <label className="form-label">Status</label>
              <select
                className="form-control"
                {...register("status", { required: "Status is required" })}
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
                {...register("assignedTo", { required: "Assigned user is required" })}
              >
                <option value="">Select user</option>
                {users.map(user => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Notes"
              {...register("notes")}
              placeholder="Enter notes"
              rows="4"
            />
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