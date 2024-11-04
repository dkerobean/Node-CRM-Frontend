import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useRtl from "@/hooks/useRtl";
import { useSelector } from "react-redux";
import axios from "axios";

const RevenueBarChart = ({ height = 400 }) => {
  const [isDark] = useDarkMode();
  const [isRtl] = useRtl();
  const [monthlyData, setMonthlyData] = useState(null);
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!token || !user?._id) {
        console.error("No token or user ID found");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/metrics/month/data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMonthlyData(response.data);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    fetchMonthlyData();
  }, [token, user]);

  const processChartData = () => {
    if (!monthlyData) return null; // Return null if monthlyData is not available

    const wonData = new Array(12).fill(0);
    const revenueData = new Array(12).fill(0);
    const lostData = new Array(12).fill(0);

    // Process closed won data
    monthlyData.closedWonData?.forEach(item => {
      const monthIndex = item.month - 1;
      wonData[monthIndex] = item.totalWon;
      revenueData[monthIndex] = item.totalRevenue;
    });

    // Process closed lost data
    monthlyData.closedLostData?.forEach(item => {
      const monthIndex = item.month - 1;
      lostData[monthIndex] = Math.round(item.totalLost); // Ensure whole number
    });

    return { wonData, revenueData, lostData };
  };

  const chartData = processChartData();

  // Ensure chartData is not null before accessing its properties
  if (!chartData) {
    return <div>Loading...</div>; // Optionally, show a loading state
  }

  // Find dynamic max values for both y-axes
  const maxDeals = Math.max(...chartData.wonData, ...chartData.lostData);
  const maxRevenue = Math.max(...chartData.revenueData);

  const series = [
    {
      name: "Won Deals",
      data: chartData.wonData,
      type: "column",
    },
    {
      name: "Lost Deals",
      data: chartData.lostData,
      type: "column",
    },
    {
      name: "Revenue ($)",
      data: chartData.revenueData,
      type: "column",
    },
  ];

  const options = {
    chart: {
      toolbar: { show: false },
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "45%",
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Inter",
      offsetY: -30,
      markers: {
        width: 8,
        height: 8,
        radius: 12,
      },
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
      itemMargin: { horizontal: 18, vertical: 0 },
    },
    title: {
      text: "Monthly Performance",
      align: "left",
      offsetX: isRtl ? "0%" : 0,
      style: {
        fontSize: "20px",
        fontWeight: "500",
        fontFamily: "Inter",
        color: isDark ? "#fff" : "#0f172a",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: [0, 0, 0], // No stroke since we're using bars
      curve: "smooth",
    },
    yaxis: [
      {
        title: { text: "Number of Deals" },
        min: 0,
        max: Math.ceil(maxDeals * 1.1), // Dynamically set max value with a buffer
        tickAmount: 10,
        forceNiceScale: true,
        labels: {
          style: {
            colors: isDark ? "#CBD5E1" : "#475569",
          },
        },
      },
      {
        title: { text: "Revenue ($)" },
        opposite: true,
        min: 0,
        max: Math.ceil(maxRevenue * 1.1), // Dynamically set max value with a buffer
        tickAmount: 10, // Adjust as needed
        labels: {
          style: {
            colors: isDark ? "#CBD5E1" : "#475569",
          },
          formatter: (value) => `$${value.toLocaleString()}`,
        },
      },
    ],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    fill: {
      opacity: [0.85, 0.85, 0.85], // Adjust opacity for bars
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val, { seriesIndex }) => {
          return seriesIndex === 2 ? `$${val.toLocaleString()}` : `${val} deals`;
        },
      },
    },
    colors: ["#4669FA", "#FA916B", "#0CE7FA"],
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#E2E8F0",
      strokeDashArray: 10,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
            offsetY: 8,
          },
          plotOptions: {
            bar: {
              columnWidth: "80%",
            },
          },
        },
      },
    ],
  };

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="bar" // Use "bar" for the chart type
        height={height}
      />
    </div>
  );
};

export default RevenueBarChart;
