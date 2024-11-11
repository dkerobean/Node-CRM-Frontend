import React, { useMemo, useState, useEffect } from "react";
import axios from "axios"; // You can also use fetch instead of axios
import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import GlobalFilter from "../../table/react-tables/GlobalFilter";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="table-checkbox"
      />
    );
  }
);

const InvoicePage = () => {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState([]); // Store fetched invoice data
  const [loading, setLoading] = useState(true); // Track loading state
  const actions = [
    {
      name: "view",
      icon: "heroicons-outline:eye",
      doit: () => {
        navigate("/invoice-preview");
      },
    },
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      doit: (id) => {
        navigate("/invoice-edit");
      },
    },
    {
      name: "delete",
      icon: "heroicons-outline:trash",
      doit: (id) => {
        return null;
      },
    },
  ];

  // Define columns (same as before)
  const COLUMNS = [
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row }) => {
        return (
          <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: ({ row }) => {
        return <span className="text-sm text-slate-600 dark:text-slate-300">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ row }) => {
        return <span className="text-sm text-slate-600 dark:text-slate-300">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Notes",
      accessor: "notes",
      Cell: ({ row }) => {
        return <span className="text-sm text-slate-600 dark:text-slate-300">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        return (
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : row?.cell?.value === "inactive"
                ? "text-danger-500 bg-danger-500"
                : ""
            }`}
          >
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Company",
      accessor: "company",
      Cell: ({ row }) => {
        return <span className="text-sm text-slate-600 dark:text-slate-300">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => {
        return (
          <div>
            <Dropdown
              classMenuItems="right-0 w-[140px] top-[110%]"
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => item.doit()}
                    className={`${
                      item.name === "delete"
                        ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                        : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                    } w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
                  >
                    <span className="text-base">
                      <Icon icon={item.icon} />
                    </span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/invoices"); // Replace with your API endpoint
        setInvoiceData(response.data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Columns and data passed to useTable
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => invoiceData, [invoiceData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Invoice</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              icon="heroicons-outline:calendar"
              text="Select date"
              className=" btn-outline-secondary dark:border-slate-700 text-slate-600 btn-sm font-normal dark:text-slate-300 "
              iconClass="text-lg"
            />
            <Button
              icon="heroicons-outline:filter"
              text="Filter"
              className=" btn-outline-secondary text-slate-600 dark:border-slate-700 dark:text-slate-300 font-normal btn-sm "
              iconClass="text-lg"
            />
            <Button
              icon="heroicons-outline:plus-sm"
              text="Add Record"
              className=" btn-dark font-normal btn-sm "
              iconClass="text-lg"
              onClick={() => {
                navigate("/invoice-add");
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="text-sm font-medium text-left text-slate-600 dark:text-slate-300 py-3.5 pl-4 pr-3 first:pl-5 last:pr-5 capitalize"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <Icon icon="heroicons:arrow-sm-down" />
                              ) : (
                                <Icon icon="heroicons:arrow-sm-up" />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps}
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="text-sm font-normal text-slate-600 dark:text-slate-300 py-4 pl-4 pr-3 first:pl-5 last:pr-5"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                onClick={() => gotoPage(0)}
                className="table-pagination-btn"
                disabled={!canPreviousPage}
              >
                {"<<"}
              </Button>
              <Button
                onClick={() => previousPage()}
                className="table-pagination-btn"
                disabled={!canPreviousPage}
              >
                {"<"}
              </Button>
              <Button
                onClick={() => nextPage()}
                className="table-pagination-btn"
                disabled={!canNextPage}
              >
                {">"}
              </Button>
              <Button
                onClick={() => gotoPage(pageCount - 1)}
                className="table-pagination-btn"
                disabled={!canNextPage}
              >
                {">>"}
              </Button>
            </div>
          </div>
          <div className="space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Show
            </span>
            <select
              className="table-pagination-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Entries
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default InvoicePage;