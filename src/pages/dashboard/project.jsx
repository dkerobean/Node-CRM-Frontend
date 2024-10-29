import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import DonutChart from "@/components/partials/widget/chart/donut-chart";
import BasicArea from "../chart/appex-chart/BasicArea";
import SelectMonth from "@/components/partials/SelectMonth";
import TaskLists from "@/components/partials/widget/task-list";
import MessageList from "@/components/partials/widget/message-list";
import TrackingParcel from "../../components/partials/widget/activity";
import TeamTable from "@/components/partials/Table/team-table";
import { meets, files } from "@/constant/data";
import CalendarView from "@/components/partials/widget/CalendarView";
import HomeBredCurbs from "./HomeBredCurbs";
import { useSelector } from "react-redux";
import axios from "axios";

import StackBarChart from "../../components/partials/widget/chart/stack-bar";

import ProfitChart from "../../components/partials/widget/chart/profit-chart";
import OrderChart from "../../components/partials/widget/chart/order-chart";
import EarningChart from "../../components/partials/widget/chart/earning-chart";


const ProjectPage = () => {
  // State to store metrics
  const [metrics, setMetrics] = useState(null);
  const token = localStorage.getItem("token"); // Retrieve token from local storage
  const user = useSelector((state) => state.auth.user); // Get user from Redux store


  // Define useFetchMetrics function
  const useFetchMetrics = () => {

    const getMetrics = async () => {
      if (!token || !user?._id) {
        console.error("No token or user ID found");
        return null; // Return null if token or user ID is not available
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/metrics/all/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched Metrics:", response.data); // Log fetched metrics
        return response.data; // Return fetched metrics
      } catch (error) {
        console.error("Error fetching metrics:", error);
        return null; // Handle error
      }
    };

    return getMetrics; // Return the function to call it later
  };

  // Fetch metrics on component mount
  useEffect(() => {
    const getMetrics = async () => {
      const fetchMetrics = useFetchMetrics();
      const data = await fetchMetrics();
      if (data) {
        console.log("Metrics data received:", data);
        setMetrics(data);
      } else {
        console.error("No data received for metrics.");
      }
    };

    getMetrics();
  }, []);


  return (
    <div className="space-y-5">
      <HomeBredCurbs title="Dashboard Overview" />
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12 space-y-5">
          <Card>
            <div className="grid grid-cols-12 gap-5">
              <div className="xl:col-span-8 col-span-12">
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                  <GroupChart4
                    totalClients={metrics?.totalClients}
                    totalLeads={metrics?.totalLeads}
                    totalProspects={metrics?.totalProspects}
                    totalRevenue={metrics?.totalRevenue}
                  />
                </div>
              </div>

              <div className="xl:col-span-4 col-span-12">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4">
                  <span className="block dark:text-slate-400 text-sm text-slate-600">
                    Progress
                  </span>
                  <DonutChart />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Deal distribution by stage" headerslot={<SelectMonth />}>
            <StackBarChart />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Key Performance Indicators (KPIs)">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <OrderChart
                prospects={metrics?.totalProspects}
              />
              <ProfitChart
                negotiations={metrics?.dealsStatusDistribution?.negotiation }
              />
              <div className="md:col-span-2">
                <EarningChart
                  revenue={metrics?.totalRevenue}
                  winRate={metrics?.winRate}
                  closedWon={metrics?.dealsStatusDistribution?.closedWon}
                  closedLost={metrics?.dealsStatusDistribution?.closedLost}

                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="grid xl:grid-cols-3 grid-cols-1 gap-5">
        <Card title="Task list" headerslot={<SelectMonth />}>
          <TaskLists />
        </Card>
        <Card title="Messages" headerslot={<SelectMonth />}>
          <MessageList />
        </Card>
        <Card title="Activity" headerslot={<SelectMonth />}>
          <TrackingParcel />
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 lg:col-span-7 col-span-12">
          <Card title="Team members" noborder>
            <TeamTable />
          </Card>
        </div>
        <div className="xl:col-span-4 lg:col-span-5 col-span-12">
          <Card title="Files" headerslot={<SelectMonth />}>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {files.map((item, i) => (
                <li key={i} className="block py-[8px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                      <div className="flex-none">
                        <div className="h-8 w-8">
                          <img
                            src={item.img}
                            alt=""
                            className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300">
                          {item.title}
                        </span>
                        <span className="block font-normal text-xs text-slate-500 mt-1">
                          {item.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex-none">
                      <button
                        type="button"
                        className="text-xs text-slate-900 dark:text-white"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
