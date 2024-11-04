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

  // Process data for the chart
const processChartData = () => {
  if (!monthlyData) return null;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const wonData = new Array(12).fill(0);
  const revenueData = new Array(12).fill(0);
  const lostData = new Array(12).fill(0);

  // Fill in wonData and revenueData
  monthlyData.closedWonData.forEach(item => {
    const monthIndex = item.month - 1;
    wonData[monthIndex] = item.totalWon;
    revenueData[monthIndex] = item.totalRevenue;
  });

  // Fill in lostData
  monthlyData.closedLostData.forEach(item => {
    const monthIndex = item.month - 1;
    lostData[monthIndex] = item.totalLost;
  });

  console.log('Won Data:', wonData);
  console.log('Revenue Data:', revenueData);
  console.log('Lost Data:', lostData);

  return {
    wonData,
    revenueData,
    lostData
  };
};


  const chartData = processChartData();

const series = chartData ? [
  {
    name: "Won Deals",
    data: chartData.wonData,
  },
  {
    name: "Revenue ($)",
    data: chartData.revenueData,
  },
  {
    name: "Lost Deals",
    data: chartData.lostData,
  },
] : [];


  const options = {
    chart: {
      toolbar: {
        show: false,
      },
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
        offsetY: -1,
        offsetX: -5,
        radius: 12,
      },
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
    },
    title: {
      text: "Monthly Performance",
      align: "left",
      offsetX: isRtl ? "0%" : 0,
      offsetY: 13,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "500",
        fontFamily: "Inter",
        color: isDark ? "#fff" : "#0f172a",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      opposite: isRtl ? true : false,
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val, { seriesIndex }) {
          if (seriesIndex === 1) {
            return "$ " + val;
          }
          return val + " deals";
        },
      },
    },
    colors: ["#4669FA", "#0CE7FA", "#FA916B"],
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#E2E8F0",
      strokeDashArray: 10,
      position: "back",
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
            offsetY: 8,
            horizontalAlign: "center",
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
        type="bar"
        height={height}
      />
    </div>
  );
};

export default RevenueBarChart;