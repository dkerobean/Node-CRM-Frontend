import React from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";

const EarningChart = ({
  revenue,
  winRate,
  closedWon,
  closedLost,
  className = "bg-slate-50 dark:bg-slate-900 rounded py-3 px-4 md:col-span-2",
}) => {
  const [isDark] = useDarkMode();

  // Set up the series data based on closedWon and closedLost
  const series = [closedWon || 0, closedLost || 0];

  const options = {
    labels: ["Won", "Lost"],
    dataLabels: {
      enabled: false,
    },
    colors: ["#0CE7FA", "#FA916B"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter",
      fontWeight: 400,
      markers: {
        width: 8,
        height: 8,
        offsetY: 0,
        offsetX: -5,
        radius: 12,
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className={` ${className}`}>
      <div className="flex items-center">
        <div className="flex-none">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-[6px]">
            Earnings
          </div>
          <div className="text-lg text-slate-900 dark:text-white font-medium mb-[6px]">
            ${revenue ? revenue.toLocaleString() : 0} {/* Format revenue */}
          </div>
          <div className="font-normal text-xs text-slate-600 dark:text-slate-300">
            <span className="text-primary-500">+{winRate || 0}%</span> {/* Display win rate */}
            Win Rate
          </div>
        </div>
        <div className="flex-1">
          <div className="legend-ring2">
            <Chart
              type="donut"
              height="200"
              options={options}
              series={series}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium">Closed Won: </span>{closedWon || 0}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium">Closed Lost: </span>{closedLost || 0}
        </div>
      </div>
    </div>
  );
};

export default EarningChart;
