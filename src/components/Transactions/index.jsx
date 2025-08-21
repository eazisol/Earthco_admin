import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { getTenantServerSideList } from "../../APIS/transactions";
import { useAppContext } from "../../context/AppContext";
// Add Material UI Pagination
import Pagination from '@mui/material/Pagination';
import TitleBar from "../TitleBar";
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
export const TransactionsScreen = () => {
  const { loginUser } = useAppContext();
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  // Pagination and search state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    maxUser: "",
    maxStorage: "",
    monthlyPrice: "",
    maxCompanies: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Define fields that should only allow numbers
    const numericFields = [
      "maxUser",
      "maxStorage",
      "monthlyPrice",
      "maxCompanies",
    ];

    // Check if it's a numeric-only field
    if (numericFields.includes(name)) {
      // Allow only digits (and optionally decimals here)
      const isValid = /^\d*$/.test(value); // Change to /^\d*\.?\d*$/ if decimals are allowed
      if (!isValid) return; // Don't update if invalid
    }

    // Update state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  // Fetch transactions with search and pagination
  const fetchTransactions = async (searchValue = search, pageValue = page, pageSizeValue = pageSize) => {
    setLoading(true);
    try {
      const data = await getTenantServerSideList(searchValue, pageValue, pageSizeValue);
      setTransactionsData(data.Data);
      setTotalCount(data.totalRecords || 0);
    } catch (e) {
      setTransactionsData([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [page, pageSize]);

  // Search handler
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    fetchTransactions(e.target.value, 1, pageSize);
  };

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <DashboardLayout>

      <div className="content-body">
        <TitleBar icon={<ReceiptLongOutlinedIcon />} title="Transactions" />
        <div className="container-fluid">
          <div className="row table-space"  >
            <div className="col-xl-12">
              <div className="card shadow-sm rounded-card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                      <h4 className="heading mb-0"></h4>
                      <TextField
                        className="ml-3"
                        size="small"
                        variant="outlined"
                        label="Search Transaction"
                        // placeholder="Search Transaction..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ minWidth: 200 }}
                      />
                    </div>
                    <table id="employees-tblwrapper" className="table">

                      <thead>
                        <tr>
                          <th>Invoice Number</th>
                          {loginUser?.Data?.RoleId === 1 && <th>Customer Name</th>}
                          <th>Package Name</th>
                          <th>Amount</th>
                          <th>Paid Date</th>
                          <th>Status</th>
                          <th>Links</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                        <tr>
                        <td colSpan={6} className="text-center py-5">
                          <CircularProgress />
                        </td>
                      </tr>
                        ) : transactionsData?.length === 0 ? (
                          <tr><td colSpan={10} className="text-center">No data found</td></tr>
                        ) : (
                          transactionsData?.map((transaction, index) =>  (<tr key={index}>
                              <td>
                                <span>{transaction.InvoiceNumber}</span>
                              </td>
                              {loginUser?.Data?.RoleId === 1 && <td>
                                <div className="products">
                                  <h6>{transaction.FirstName}</h6>
                                </div>
                              </td>}
                              <td>
                                  <span>{transaction.Name}</span>
                                </td>
                              <td>
                                <span className="text-center"> {`$${transaction.Price}`}</span>
                              </td>
                            
                              <td>
                                <span>{transaction.PaidDate ? new Date(transaction.PaidDate).toLocaleDateString() : '-'}</span>
                              </td> <td>
                                <span style={{
                                  padding: "2px 10px", fontSize: "11px", borderRadius: "12px", backgroundColor: transaction.Status === 'paid' ? '#c2ded1' :
                                    transaction.Status === 'Pending' ? '#fff3cd' :
                                      transaction.Status === 'incomplete' ? '#f8d7da' :
                                        '#e2e3e5', color: transaction.Status === 'paid' ? '#03543f' :
                                          transaction.Status === 'Pending' ? '#664d03' :
                                            transaction.Status === 'incomplete' ? '#842029' :
                                              '#41464b'
                                }}>
                                  {transaction.Status.charAt(0).toUpperCase() + transaction.Status.slice(1)}
                                </span>

                              </td>
                              <td>
                                <div>
                                  <span>
                                    {transaction.PaymentLink && (<a href={transaction.PaymentLink} target="_blank" rel="noopener noreferrer" style={{ color: "#0000FF" }}>
                                      Payment
                                    </a>)}
                                  </span>
                                  <span style={{ marginLeft: "5px", marginRight: "5px" }}>|</span>
                                  <span>
                                    {transaction.InvoiceLink && (<a href={transaction.InvoiceLink} target="_blank" rel="noopener noreferrer" style={{ color: "#0000FF" }}>
                                      Invoice
                                    </a>)}
                                  </span>
                                </div>
                              </td>


                            </tr>)
                          )
                        )}
                      </tbody>
                    </table>

                    <div className="d-flex justify-content-end align-items-center p-3">
                      <Pagination
                        count={Math.ceil(totalCount / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="#b0e15b"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
