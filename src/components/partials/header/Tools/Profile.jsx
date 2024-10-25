import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector to access state
import { handleLogout } from "../../../../pages/auth/common/store"; // Adjust import path
import { toast } from "react-toastify";
import UserAvatar from "@/assets/images/all-img/user.png";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Access user data from the store

  const handleLogoutClick = async () => {
    try {
      await dispatch(handleLogout());
      localStorage.removeItem('token'); // Correct the key used here
      toast.success("Successfully logged out!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",
      action: () => navigate("/profile"),
    },
    {
      label: "Chat",
      icon: "heroicons-outline:chat",
      action: () => navigate("/chat"),
    },
    {
      label: "Email",
      icon: "heroicons-outline:mail",
      action: () => navigate("/email"),
    },
    {
      label: "Todo",
      icon: "heroicons-outline:clipboard-check",
      action: () => navigate("/todo"),
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: handleLogoutClick,
    },
  ];

  const profileLabel = () => (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            src={UserAvatar}
            alt="User Avatar"
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {user ? user.name : "Loading..."} {/* Display user name */}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down" />
        </span>
      </div>
    </div>
  );

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={item.action}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block cursor-pointer px-4 py-2`}
            >
              <div className="flex items-center">
                <span className="block text-xl ltr:mr-3 rtl:ml-3">
                  <Icon icon={item.icon} />
                </span>
                <span className="block text-sm">{item.label}</span>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
