import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import GlobalFilter from "../../table/react-tables/GlobalFilter";

import customer1 from "@/assets/images/all-img/customer_1.png";
import { toast } from "react-toastify";

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
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteContactId, setDeleteContactId] = useState(null);

  const actions = [
    {
      name: "view",
      icon: "heroicons-outline:eye",
      doit: (id) => {
        navigate(`/contact-view/${id}`);
      },
    },
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      doit: (id) => {
        navigate(`/contact-edit/${id}`);
      },
    },
    {
      name: "delete",
      icon: "heroicons-outline:trash",
      doit: (id) => {
        handleDeleteContact(id); // Call the delete function directly
      },
    },
  ];

const COLUMNS = [
  {
    Header: "ID",
    accessor: "id", // Assuming the contact object has an 'id' property
    Cell: ({ row }) => (
      <span>{row.original.id}</span> // Display the contact's id here
    ),
    // Add className to hide the column
    className: "hidden-column",
  },
  {
    accessor: "image",  // This can be left as a placeholder or unused, but we will use the static image for now
    Cell: () => (
      <img src={customer1} alt="Customer" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
    ),
  },
  {
    Header: "Name",
    accessor: "name",
    Cell: ({ row }) => (
      <span>{row.original.name}</span>
    ),
  },
  {
    Header: "Email",
    accessor: "email",
    Cell: ({ row }) => (
      <span>{row.original.email}</span>
    ),
  },
  {
    Header: "Phone",
    accessor: "phone",
    Cell: ({ row }) => (
      <span>{row.original.phone}</span>
    ),
  },
  {
    Header: "Notes",
    accessor: "notes",
    Cell: ({ row }) => (
      <span>{row.original.notes}</span>
    ),
  },
 {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "paid"
                  ? "text-success-500 bg-success-500"
                  : ""
              }
            ${
              row?.cell?.value === "lead"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              row?.cell?.value === "prospect"
                ? "text-danger-500 bg-danger-500"
                : ""
            }

             `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
  {
    Header: "Company",
    accessor: "company",
    Cell: ({ row }) => (
      <span>{row.original.company}</span>
    ),
  },
{
  Header: "action",
  accessor: "action",
  Cell: ({ row }) => {
    const contactId = row.original._id;
    console.log(contactId);
    return (
      <div>
        <Dropdown
          classMenuItems="right-0 w-[140px] top-[110%] "
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
                onClick={() => item.doit(contactId)}
                className={`
                  ${
                    item.name === "delete"
                      ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                      : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                  }
                  w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer
                  first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse
                `}
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
}


];

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Fetch data from API with token authentication
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        };

        const response = await axios.get(`${backendUrl}/api/contact/all`, config); // Make the request with the config
        setContacts(response.data.contacts); // Set the contacts data from the response
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle deletion
const handleDeleteContact = async (contactId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this contact?"
  );

  if (!confirmDelete) {
    return; // Exit the function if the user cancels
  }

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(
      `${backendUrl}/api/contact/delete/${contactId}`,
      config
    );

    // Check if the response contains a message and display it
    if (response.data && response.data.message) {
      toast.success(response.data.message); // Use the API response message for success
    } else {
      toast.success("Contact deleted successfully!"); // Fallback success message
    }

    setContacts(contacts.filter((contact) => contact._id !== contactId)); // Update contact list
  } catch (error) {
    // Extract the error message from the response if available
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error deleting contact."; // Fallback error message

    toast.error(errorMessage); // Display the error message in a toast
    console.error("Error deleting contact: ", error);
  }
};
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => contacts, [contacts]);
  console.log(data);

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
          <h6 className="flex-1 md:mb-0 mb-3">Contacts</h6>
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
                navigate("/contact-add");
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
                          {...column.getHeaderProps(column.getSortByToggleProps())}
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
    </> );
};

export default InvoicePage;