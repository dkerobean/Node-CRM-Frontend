import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams hook
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import userDarkMode from "@/hooks/useDarkMode";
import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";

const ContactDetailPage = () => {
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDark] = userDarkMode();
  const id = "67019fbaad5c762a7a91adc1"; // Replace with dynamic ID or use useParams()

  useEffect(() => {
    const fetchContact = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/contact/view/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Add token to Authorization header
            "Content-Type": "application/json", // Ensure the content type is JSON
          },
        });
        const data = await response.json();

        if (response.ok) {
          setContact(data.contact);
        } else {
          setError("Contact not found");
        }
      } catch (err) {
        setError("Error fetching contact");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const printPage = () => {
    window.print();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="lg:flex justify-between flex-wrap items-center mb-6">
        <h4>Contact Details</h4>
        <div className="flex lg:justify-end items-center flex-wrap space-xy-5">
          <button className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse">
            <span className="text-lg">
              <Icon icon="heroicons:pencil-square" />
            </span>
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={printPage}
            className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg">
              <Icon icon="heroicons:printer" />
            </span>
            <span>Print</span>
          </button>
          <button className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse">
            <span className="text-lg">
              <Icon icon="heroicons:arrow-down-tray" />
            </span>
            <span>Download</span>
          </button>
          <button className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse">
            <span className="text-lg transform -rotate-45">
              <Icon icon="heroicons:paper-airplane" />
            </span>
            <span>Send invoice</span>
          </button>
        </div>
      </div>

      <Card bodyClass="p-0">
        <div className="flex justify-between flex-wrap space-y-4 px-6 pt-6 bg-slate-50 dark:bg-slate-800 pb-6 rounded-t-md">
          <div>
            <img src={isDark ? LogoWhite : MainLogo} alt="Logo" />

            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
              {contact.company} <br />
              {contact.position} <br />
              {contact.phone}
              <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                <Icon icon="heroicons-outline:phone" />
                <span>{contact.phone}</span>
              </div>
              <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                <Icon icon="heroicons-outline:mail" />
                <span>{contact.email}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl">
              Lead Details:
            </span>

            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
              <strong>Status:</strong> {contact.leadDetails.status} <br />
              <strong>Priority:</strong> {contact.leadDetails.priority}
            </div>
          </div>

          <div className="space-y-[2px]">
            <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl mb-4">
              Contact Information:
            </span>
            <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
              Name:
            </h4>
            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
              {contact.name}
            </div>

            <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
              Email:
            </h4>
            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
              {contact.email}
            </div>

            <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
              Phone:
            </h4>
            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
              {contact.phone}
            </div>

            <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
              Notes:
            </h4>
            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
              {contact.notes}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactDetailPage;