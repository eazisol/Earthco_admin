import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { getPackages } from "../../APIS/packages";
import { AddTenant, deleteTenant, getTenant, getTenantRole } from "../../APIS/auth";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../Reuseable/ConfirmationModal";
import Pagination from '@mui/material/Pagination';

export const TenantScreen = () => {
 
  const [tenantData, setTenantData] = useState([]);
  // Pagination and search state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [packagesData, setPackagesdata] = useState({});
  const [role, setRole] = useState([]);
  const [packages, setpackegs] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirmation",
    description: "Are you sure you want to delete this tenant?",
    onConfirm: () => {},
    confirmText: "Delete",
    cancelText: "Cancel",
  });
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    PhoneNo: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    RoleId: 1,
    SubDomain: "",
    PackageId: 0,
    CompanyName: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Optional: if you want to save full selected object too
    if (name === "PackageId") {
      const selectedPackage = packages.find((pkg) => pkg.PackageId === value);
      setPackagesdata(selectedPackage);
    }
  };

 
  const fetchPackages = async () => {
    const response = await getPackages({
      Search: "",
      DisplayStart: 1,
      DisplayLength: 10,
    });

    setpackegs(response?.Data);
  };
  // Fetch tenants with search and pagination
  const fetchTenants = async (searchValue = search, pageValue = page, pageSizeValue = pageSize) => {
    setLoading(true);
    try {
      const response = await getTenant({
        Search: searchValue || "",
        DisplayStart: pageValue,
        DisplayLength: pageSizeValue,
      });
      
      if (response?.error) {
        toast.error(response.message || "Error fetching tenants");
        setTenantData([]);
        setTotalCount(0);
      } else {
        setTenantData(response?.Data || []);
        setTotalCount(response?.totalRecords || 0);
      }
    } catch (error) {
      toast.error("Failed to fetch tenants");
      setTenantData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchPackages();
    getRole();
  }, [page, pageSize]);

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchTenants(value, 1, pageSize);
  };

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const getRole = async () => {
    const response = await getTenantRole();
    setRole(response?.data);
  };
  const tenantDelete = async () => {
    try {
      const response = await deleteTenant(selectedId);
      if (response?.error) {
        toast.error(response.message || "Error deleting tenant");
      } else {
        toast.success(response?.Message || "Tenant deleted successfully");
        fetchTenants();
      }
    } catch (error) {
      toast.error("Error deleting tenant");
    }
  };
  return (
    <DashboardLayout>
         <ConfirmationModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
  
      <div className="content-body">
        <div className="page-titles">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="javascript:void(0)">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.986 14.0673C7.4407 14.0673 4.41309 14.6034 4.41309 16.7501C4.41309 18.8969 7.4215 19.4521 10.986 19.4521C14.5313 19.4521 17.5581 18.9152 17.5581 16.7693C17.5581 14.6234 14.5505 14.0673 10.986 14.0673Z"
                    stroke="#888888"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.986 11.0054C13.3126 11.0054 15.1983 9.11881 15.1983 6.79223C15.1983 4.46564 13.3126 2.57993 10.986 2.57993C8.65944 2.57993 6.77285 4.46564 6.77285 6.79223C6.76499 9.11096 8.63849 10.9975 10.9563 11.0054H10.986Z"
                    stroke="#888888"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{  marginLeft:'8px'}}>Tenant</span>
              </a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    {/* Search Field */}
                    <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                      <h4 className="heading mb-0" style={{marginLeft:"15px"}}>Tenant List</h4>
                      <TextField
                        size="small"
                        placeholder="Search Tenant..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ minWidth: 200, marginRight: "15px" }}
                      />
                    </div>
                    <table id="employees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="text-center">Username</th>
                          <th className="text-center">Email Address</th>
                          <th className="text-center">Phone No</th>
                          <th className="text-center">Role</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? <tr>
                         <td colSpan={6} className="text-center py-5">
                          <CircularProgress />
                         </td>
                          </tr> 
                         : tenantData?.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center">No data found</td>
                          </tr>
                        ) : tenantData?.map((emp, index) =>{
                          return (
                          <tr key={index}>
                            <td>
                              <h6>{emp.CompanyName}</h6>
                            </td>
                            <td className="text-center">
                              <span>{emp.SubDomain}</span>
                            </td>
                            <td className="text-center">
                              <span className="text-primary">{emp.Email}</span>
                            </td>
                            <td className="text-center">
                              <span>{emp.PhoneNo}</span>
                            </td>
                            <td className="text-center">
                              <h6>{emp.Role}</h6>
                            </td>
                            <td className="text-center">
                              <i 
                                className="fa-solid fa-trash text-danger cursor-pointer" 
                                title="Delete Tenant"
                                style={{cursor: 'pointer'}}
                                onClick={(e)=>{
                                  e.stopPropagation(); 
                                  setModalOpen(true);
                                  setModalConfig({
                                    title: "Confirmation", 
                                    description: "Are you sure you want to delete this tenant?",
                                    onConfirm: () => {
                                      setSelectedId(emp.TenantId);
                                      tenantDelete();
                                      setModalOpen(false);
                                    },
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                  });
                                }}
                              ></i>
                            </td>
                          </tr>
                        )})}
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
