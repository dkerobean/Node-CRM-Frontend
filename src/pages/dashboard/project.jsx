import React, { useEffect, useState } from "react";
import {useDispatch } from "react-redux";
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
import { useNavigate } from "react-router-dom";

import StackBarChart from "../../components/partials/widget/chart/stack-bar";

import ProfitChart from "../../components/partials/widget/chart/profit-chart";
import OrderChart from "../../components/partials/widget/chart/order-chart";
import EarningChart from "../../components/partials/widget/chart/earning-chart";
import RevenueBarChart from "@/components/partials/widget/chart/revenue-bar-chart";
import { fetchUserData } from "../auth/common/store";


const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const { user, loading, initialized, isAuth } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  // Initialize auth state
  useEffect(() => {
    if (token && !user && !loading && !initialized) {
      dispatch(fetchUserData());
    }
  }, [dispatch, token, user, loading, initialized]);

  // Redirect if no auth
  useEffect(() => {
    if (initialized && !isAuth) {
      navigate('/login');
    }
  }, [initialized, isAuth, navigate]);

  // Fetch metrics when user data is available
  useEffect(() => {
    const getMetrics = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/metrics/all/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    if (user) {
      getMetrics();
    }
  }, [user, token, navigate]);

  // Show loading state while initializing
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }


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
          <Card title="Monthly Sales Performance Overview" headerslot={<SelectMonth />}>
            <RevenueBarChart height={420} />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-8">
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
        <Card title="Files" headerslot={<SelectMonth />}>
          {/* <TrackingParcel /> */}
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
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-12 lg:col-span-7 col-span-12">
          <Card title="Team members" noborder>
            <TeamTable />
          </Card>
        </div>
        {/* <div className="xl:col-span-4 lg:col-span-5 col-span-12">
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
        </div> */}
      </div>
    </div>
  );
};

export default ProjectPage;
