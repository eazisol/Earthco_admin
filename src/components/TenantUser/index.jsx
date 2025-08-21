import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { CircularProgress,  TextField,Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { getPackages } from "../../APIS/packages";
import { AddTenant, deleteTenant, getTenant, getTenantRole, updateTenantStatus } from "../../APIS/auth";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../Reuseable/ConfirmationModal";
import Pagination from '@mui/material/Pagination';
import { useAppContext } from "../../context/AppContext";
import TitleBar from "../TitleBar";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

export const TenantScreen = () => {
  const navigate = useNavigate();
  const [tenantData, setTenantData] = useState([]);
  // Pagination and search state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(11);
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
      // toast.error("Failed to fetch tenants");
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
  const tenantDelete = async (id) => {
    try {
      const response = await deleteTenant(id);
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
          <TitleBar icon={<PersonOutlineOutlinedIcon />} title="Tenant List" />
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card shadow-sm rounded-card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    {/* Search Field */}
                    <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                      <h4 className="heading mb-0" style={{marginLeft:"15px"}}></h4>
                      <TextField
                        size="small"
                        variant="outlined"
                        label="Search Tenant"
                        // placeholder="Search Tenant..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ minWidth: 200, }}
                      />
                    </div>
                    <table id="employees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="text-center">Username</th>
                          <th className="text-center">Email Address</th>
                          <th className="text-center">Phone No</th>
                          {/* <th className="text-center">Role</th> */}
                          <th className="text-center">Status</th>
                          {/* <th className="text-center">Action</th> */}
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
                        ) : tenantData?.filter(emp=>emp.RoleId==2)?.map((emp, index) =>{
                          
                          return (
                          <tr key={index} >
                            <td onClick={() => navigate(`/profile?id=${emp.TenantId}`)} style={{cursor:"pointer"}}>
                              <h6>{emp.CompanyName}</h6>
                            </td>
                            <td className="text-center" onClick={() => navigate(`/profile?id=${emp.TenantId}`)} style={{cursor:"pointer"}}>
                              <span>{emp.SubDomain}</span>
                            </td>
                            <td className="text-center" onClick={() => navigate(`/profile?id=${emp.TenantId}`)} style={{cursor:"pointer"}}>
                              <span 
                                className="text-primary "  
                             
                              >
                                {emp.Email}
                              </span>
                            </td>
                            <td className="text-center" onClick={() => navigate(`/profile?id=${emp.TenantId}`)} style={{cursor:"pointer"}}>
                              <span>{emp.PhoneNo}</span>
                            </td>
                            {/* <td className="text-center">
                              <h6>{emp.Role}</h6>
                            </td> */}
                           
                              <td className="text-center">
                                <div className="form-check form-switch d-flex align-items-center justify-content-center" style={{ width: "fit-content" }}>
                                  <Tooltip title={emp.isActive ? "Activate Tenant" : "Inactivate Tenant"} arrow>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={emp.isActive}
                                      onChange={() => {
                                        setModalOpen(true);
                                        setModalConfig({
                                          title: "Confirmation",
                                          description: `Are you sure you want to ${emp.isActive ? "Inactivate" : "activate"} this tenant?`,
                                          onConfirm: async () => {
                                            const data = await updateTenantStatus({ id: emp.TenantId, Active: emp.isActive ? false : true });
                                            if (data?.status == 200) {
                                              toast.success(data?.data?.Message || "Tenant status updated successfully");
                                              fetchTenants();
                                              setModalOpen(false);
                                            } else {
                                              toast.error(data?.Message || "Tenant status update failed");
                                            }
                                          },
                                          confirmText: emp.isActive ? "Inactivate" : "Activate",
                                          cancelText: "Cancel",
                                        });
                                      }}
                                      style={{ marginLeft: "12px" }}
                                    />
                                  </Tooltip>
                                </div>
                              </td>
                            {/* <td className="text-center">
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
                                      tenantDelete(emp.TenantId);
                                      setModalOpen(false);
                                    },
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                  });
                                }}
                              ></i>
                            </td> */}
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
