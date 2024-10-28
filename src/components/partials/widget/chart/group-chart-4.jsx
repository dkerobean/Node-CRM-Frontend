import React from "react";
import Icon from "@/components/ui/Icon";

const GroupChart4 = ({ totalClients, totalLeads, totalProspects, totalTasks, totalRevenue }) => {
  const statistics = [
    {
      title: "Total Clients",
      count: totalClients || 0, // Use prop value or default to 0
      bg: "bg-info-500",
      text: "text-info-500",
      icon: "heroicons-outline:users",
    },
    {
      title: "Total Leads",
      count: totalLeads || 0,
      bg: "bg-warning-500",
      text: "text-warning-500",
      icon: "heroicons-outline:clipboard-list",
    },
    {
      title: "Total Prospects",
      count: totalProspects || 0,
      bg: "bg-primary-500",
      text: "text-primary-500",
      icon: "heroicons-outline:eye",
    },
    {
      title: "Total Revenue",
      count: `$${totalRevenue || 0}`, // Format revenue with dollar sign
      bg: "bg-success-500",
      text: "text-success-500",
      icon: "heroicons-outline:cash",
    },
  ];

  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
        >
          <div
            className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4 `}
          >
            <Icon icon={item.icon} />
          </div>
          <span className="block text-sm text-slate-600 font-medium dark:text-white mb-1">
            {item.title}
          </span>
          <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium">
            {item.count}
          </span>
        </div>
      ))}
    </>
  );
};

export default GroupChart4;
