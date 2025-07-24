import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { getTenantServerSideList } from "../../APIS/transactions";
import { useAppContext } from "../../context/AppContext";
  // Add Material UI Pagination
import Pagination from '@mui/material/Pagination';

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
  console.log("🚀 ~ TransactionsScreen ~ totalCount:", totalCount)
  
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
        <div className="page-titles">
          <ol className="breadcrumb">
            {/* <li><h5 className="bc-title">Employee</h5></li> */}
            <li className="breadcrumb-item">
              <a href="javascript:void(0)">
               	<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6.64111 13.5497L9.38482 9.9837L12.5145 12.4421L15.1995 8.97684" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
								<ellipse cx="18.3291" cy="3.85021" rx="1.76201" ry="1.76201" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M13.6808 2.86012H7.01867C4.25818 2.86012 2.54651 4.81512 2.54651 7.57561V14.9845C2.54651 17.7449 4.22462 19.6915 7.01867 19.6915H14.9058C17.6663 19.6915 19.3779 17.7449 19.3779 14.9845V8.53213" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
                Transactions{" "}
              </a>
            </li>
            {/* <li className="breadcrumb-item active"><a href="javascript:void(0)">Employee</a></li> */}
          </ol>
          {/* <a className="text-primary fs-13" data-bs-toggle="offcanvas" href="#offcanvasExample1" role="button" aria-controls="offcanvasExample1">+ Add Task</a> */}
        </div>
        <div className="container-fluid">
          <div className="row table-space"  >
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className="tbl-caption d-flex justify-content-between align-items-center">
                      <h4 className="heading mb-0">Transactions</h4>
                      {/* Search Field */}
                      <TextField
                        size="small"
                        placeholder="Search..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ minWidth: 200 }}
                      />
                    </div>
                    <table id="employees-tblwrapper" className="table">
                    {/* loginUser?.Data?.RoleId */}
                      <thead>
                        <tr>
                          {loginUser?.Data?.RoleId === 1 && <th>Customer Name</th>}
                          <th>Invoice Number</th>
                          {loginUser?.Data?.RoleId === 1 && <th>Transaction ID</th>}
                          <th>Package Name</th>
                        
                        {loginUser?.Data?.RoleId === 1 && <th>Subscription ID</th>}
                          <th>Transaction Date</th>
                          <th>Paid Date</th>
                         
                          <th>Status</th>
                          <th>Links</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={10} className="text-center">Loading...</td></tr>
                        ) : transactionsData?.length === 0 ? (
                          <tr><td colSpan={10} className="text-center">No data found</td></tr>
                        ) : (
                          transactionsData?.map((transaction, index) => (
                            
                            <tr key={index}>
                              {loginUser?.Data?.RoleId === 1 && <td>
                                <div className="products">
                                  <h6>{transaction.FirstName}</h6>
                                </div>
                              </td>}
                              <td>
                                <span>{transaction.InvoiceNumber}</span>
                              </td>
                                  {loginUser?.Data?.RoleId === 1 && <td>
                                    <span>{transaction.TransactionId}</span>
                                  </td>}
                              <td>
                                <span>{transaction.Name}</span>
                              </td>
                           {loginUser?.Data?.RoleId === 1 && <td>
                                <span>{transaction.SubscriptionId}</span>
                              </td>}
                              <td>
                                <span>{new Date(transaction.TransactionDate).toLocaleDateString()}</span>
                              </td>
                              <td>
                                <span>{transaction.PaidDate ? new Date(transaction.PaidDate).toLocaleDateString() : '-'}</span>
                              </td>
                            
                             
                              <td>
                                <span className={`badge ${
                                  transaction.Status === 'paid' ? 'badge-success' :
                                  transaction.Status === 'Pending' ? 'badge-warning' :
                                  transaction.Status === 'Failed' ? 'badge-danger' :
                                  'badge-secondary'
                                }`}>
                                  {transaction.Status}
                                </span>
                              </td>
                              <td>
                                <div>
                                <span>
                                  {transaction.PaymentLink && (
                                    <a href={transaction.PaymentLink} target="_blank" rel="noopener noreferrer" style={{color:"#0000FF"}}>
                                     Payment
                                    </a>
                                  )}
                                </span>
                              <span style={{marginLeft:"5px",marginRight:"5px"}}>|</span>
                                <span>
                                  {transaction.InvoiceLink && (
                                    <a href={transaction.InvoiceLink} target="_blank" rel="noopener noreferrer" style={{color:"#0000FF"}}>
                                  Invoice
                                    </a>
                                  )}
                                </span>
                                </div>
                              </td>
                            
                             
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    {/* Pagination Controls */}
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
