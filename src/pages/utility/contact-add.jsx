import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "react-select";
import { toast } from "react-toastify";

const ContactAddPage = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    notes: "",
    status: { value: "lead", label: "Lead" },
    assignedTo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusOptions = [
    { value: "lead", label: "Lead" },
    { value: "prospect", label: "Prospect" },
    { value: "customer", label: "Customer" }
  ];

  const styles = {
    option: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

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

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOption
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Prepare data for submission - extract values from select options
    const submissionData = {
      ...formData,
      status: formData.status?.value || 'lead',
      assignedTo: formData.assignedTo?.value || ''
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/contact/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Contact added successfully!");
        // Redirect to contacts page after successful addition
        navigate('/contact');
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
              <Select
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={formData.status}
                onChange={handleSelectChange('status')}
                styles={styles}
                isClearable={false}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="form-label">Assigned To</label>
              <Select
                className="react-select"
                classNamePrefix="select"
                options={users}
                value={formData.assignedTo}
                onChange={handleSelectChange('assignedTo')}
                styles={styles}
                isClearable
                placeholder="Select user"
              />
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