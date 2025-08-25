import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Modal,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { toast } from "react-toastify";
import {
  addPackage,
  deletePackage,
  getPackages,
  getPackagesType,
} from "../../APIS/packages";
import { ConfirmationModal } from "../Reuseable/ConfirmationModal";
import { addCompany, deleteCompany, getCompanyList } from "../../APIS/companies";
import TitleBar from "../TitleBar";
import { useAppContext } from "../../context/AppContext";
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import { DashbaordCardTenantCard } from "../Reuseable/dashbaordCard";

// Center the modal on the screen
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const CompaniesScreen = () => {
  const { loginUser } = useAppContext();

  const [packageOptions, setPackageOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(true);
  const [formData, setFormData] = useState({
    CompanyName: "",
    CompanyRealmId: "",
    DsiplayName: "",
    Address: "",
    PhoneNo: "",
    Website: "",
    SecondPhoneNo: "",
    Email: "",
    isActive: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirmation",
    description: "Are you sure you want to delete this company?",
    onConfirm: () => {},
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.CompanyName.trim()) newErrors.CompanyName = "Company Name is required";
    if (!formData.CompanyRealmId.trim()) newErrors.CompanyRealmId = "Company Realm ID is required";
    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!validateEmail(formData.Email.trim())) {
      newErrors.Email = "Please enter a valid email address";
    }
    if (!formData.PhoneNo.trim()) newErrors.PhoneNo = "Phone number is required";
    if (formData.PhoneNo && (formData.PhoneNo.length < 7 || formData.PhoneNo.length > 15)) {
      newErrors.PhoneNo = "Phone number must be between 7 and 15 characters";
    }

    const emailExists = employeesData?.some(company =>
      company.Email?.toLowerCase() === formData.Email.toLowerCase() &&
      company.CompanyId !== selectedId
    );

    if (emailExists) {
      newErrors.Email = "This email is already registered with another company";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoader(true);
    setErrors({});

    const obj = {
      ...formData,
      CompanyId: selectedId,
    };

    try {
      const response = await addCompany(obj);
      if (response.status === 200) {
        const offcanvasEl = document.getElementById("offcanvasExample");
        const bsOffcanvas =
          Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
        bsOffcanvas.hide();

        setOpenForm(false);
        setFormData({
          CompanyName: "",
          CompanyRealmId: "",
          DsiplayName: "",
          Address: "",
          PhoneNo: "",
          Website: "",
          SecondPhoneNo: "",
          Email: "",
          isActive: false,
        });
        setSelectedId(0);
        fetchCompanies();
        toast.success(response?.data?.Message);
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      setLoader(false);
    }
  };

  const fetchTenant = async () => {
    try {
      const data = await getPackagesType(user.token.data);
      setPackageOptions(data);
    } catch (err) {}
  };

  const fetchCompanies = async () => {
    setLoader(true);
    const response = await getCompanyList();
    if (response?.status == 200) {
      setEmployeesData(response?.data?.Data);
      setCheckboxStates(new Array(response?.data?.Data.length).fill(false));
      setLoader(false);
    } else if (response?.status == 500) {
      setEmployeesData([]);
      setLoader(false);
    } else {
      toast.error(response?.data?.Message);
      setEmployeesData([]);
      setLoader(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchCompanies();

    if (user.token.data) {
      fetchTenant();
    }

    const staticCheck = true; // Static check for true or false
    if (staticCheck) {
      setPopupOpen(true);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteCompany(id);
      if (response?.status == 200) {
        const offcanvasEl = document.getElementById("offcanvasExample");
        const bsOffcanvas =
          Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
        bsOffcanvas.hide();
        setSelectedId(0);
        fetchCompanies();
        setOpenForm(false);
        toast.success(response?.data?.Message);
      } else {
        toast.error("Error deleting company");
      }
    } catch (error) {
      toast.error("Error deleting company");
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[index] = !updatedCheckboxStates[index];
    setCheckboxStates(updatedCheckboxStates);

    if (updatedCheckboxStates.every((state) => state)) {
      setPopupOpen(false);
      setFormData((prev) => ({
        ...prev,
        isActive: true,
      }));
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
      {/* <Modal
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1 ,width:"25%"}}>
          <h4>Company Verification</h4>
          {employeesData.map((company, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center">
              <span>{company.CompanyName}</span>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxStates[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                }
                label=""
              />
            </div>
          ))}
        </Box>
      </Modal> */}
      <div
        class="offcanvas offcanvas-end customeoff"
        tabIndex="-1"
        id="offcanvasExample"
      >
        <div class="offcanvas-header">
          <h5 class="modal-title" id="#gridSystemModal">
            {selectedId === 0 ? "Add Company" : "Edit Company"}
          </h5>
          <button
            type="button"
            className="btn-close close-btn"
            onClick={() => {
              const offcanvasEl = document.getElementById("offcanvasExample");
              const bsOffcanvas =
                Offcanvas.getInstance(offcanvasEl) ||
                new Offcanvas(offcanvasEl);
              bsOffcanvas.hide();

              setSelectedId(0);
              setErrors({});
              setFormData({
                CompanyName: "",
                CompanyRealmId: "",
                DsiplayName: "",
                Address: "",
                PhoneNo: "",
                Website: "",
                SecondPhoneNo: "",
                Email: "",
                isActive: false,
              });
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="container-fluid">
            <div class="row">
              <div className="col-xl-6 mb-4">
               
                <TextField
                required
                  label="Company Name"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.CompanyName}
                  helperText={errors.CompanyName}
                  inputProps={{ maxLength: 100 }}
                />
              </div>
              <div class="col-xl-6 mb-4">
               
                <TextField
                required
                  label="Company Realm ID"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="CompanyRealmId"
                  value={formData.CompanyRealmId}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.CompanyRealmId}
                  helperText={errors.CompanyRealmId}
                  inputProps={{ maxLength: 50 }}
                />
              </div>

              <div class="col-xl-6 mb-4 mt-3">
                <TextField
                  label="Display Name"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="DsiplayName"
                  value={formData.DsiplayName}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ maxLength: 50 }}
                />
              </div>

              <div class="col-xl-6 mb-4 mt-3">
             
                <TextField
                required
                  label="Email"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Email}
                  helperText={errors.Email}
                  inputProps={{ maxLength: 100 }}
                />
              </div>

              <div class="col-xl-6 mb-4 mt-3">
               
                <TextField
                required
                  label="Phone Number"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.PhoneNo}
                  helperText={errors.PhoneNo}
                  inputProps={{ minLength: 7, maxLength: 15 }}
                />
              </div>

              <div class="col-xl-6 mb-4 mt-3">
                <TextField
                  label="Secondary Phone Number"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="SecondPhoneNo"
                  value={formData.SecondPhoneNo}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ minLength: 7, maxLength: 15 }}
                />
              </div>

              <div class="col-xl-6 mb-4 mt-3">
                <TextField
                  label="Website"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="Website"
                  value={formData.Website}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ maxLength: 255 }}
                />
              </div>

              <div class="col-xl-6 mb-4 mt-3">
                <TextField
                  label="Address"
                  variant="outlined"
                  className="form-control form-control-sm"
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ maxLength: 255 }}
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-xl-6">
                <div className="form-check form-switch">
                  <label
                    className="form-check-label mb-0"
                    style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        isActive: !prev.isActive
                      }))
                    }}
                  >
                    {formData.isActive == null ? "Inactive" : formData.isActive ? "Active" : "Inactive"}
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive == null ? false : formData.isActive}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked
                      }))
                    }}
                  />
                </div>
              </div>
              <div className="col-xl-6">
                <div style={{ textAlign: "end" }}>
                  <button className="btn btn-primary me-1" onClick={handleSubmit} disabled={loader}>
                    {selectedId === 0 ? "Add" : "Update"}
                  </button>
                  <button
                    className="btn btn-danger light ms-1 cancel-btn"
                    onClick={() => {
                      setOpenForm(false);
                      setSelectedId(0);
                      const offcanvasEl = document.getElementById("offcanvasExample");
                      const bsOffcanvas =
                        Offcanvas.getInstance(offcanvasEl) ||
                        new Offcanvas(offcanvasEl);
                      bsOffcanvas.hide();
                      setErrors({});
                      setFormData({
                        CompanyName: "",
                        CompanyRealmId: "",
                        DsiplayName: "",
                        Address: "",
                        PhoneNo: "",
                        Website: "",
                        SecondPhoneNo: "",
                        Email: "",
                        isActive: false,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-body">
        <TitleBar icon={<StoreOutlinedIcon />} title="Companies" />
        <div className="container-fluid">
        <DashbaordCardTenantCard total={employeesData?.length} color="info" textColor="#fff" title="Total Companies" icon={<StoreOutlinedIcon style={{ color: "#7b9b43", fontSize: "25px" }} />} active={employeesData?.filter(item => item.isActive).length || 0} inactive={employeesData?.filter(item => !item.isActive).length || 0} />
          <div className="row table-space mt-2">
            <div className="col-xl-12">
              <div className="card shadow-sm rounded-card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                      <h4 className="heading mb-0"></h4>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedId(0);
                          setFormData({
                            CompanyName: "",
                            CompanyRealmId: "",
                            DsiplayName: "",
                            Address: "",
                            PhoneNo: "",
                            Website: "",
                            SecondPhoneNo: "",
                            Email: "",
                            isActive: false,
                          });
                          setErrors({});
                          const offcanvasEl =
                            document.getElementById("offcanvasExample");
                          const bsOffcanvas = new Offcanvas(offcanvasEl);
                          bsOffcanvas.show();
                        }}
                      >
                        + Add Company
                      </button>
                    </div>
                    <table id="employees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="text-center">Email</th>
                          <th className="text-center">Phone</th>
                          <th className="text-center">Address</th>
                          <th className="text-center">Website</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loader ? (
                          <tr>
                            <td colSpan={6} className="text-center py-5">
                              <CircularProgress />
                            </td>
                          </tr>
                        ) : employeesData?.length == 0 || employeesData == undefined ? (
                          <tr>
                            <td colSpan={6} className="text-center">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          employeesData?.map((emp, index) => (
                            <tr
                              key={index}
                              onClick={(e) => {
                                if (e.target.closest('.delete-icon')) return;
                                setSelectedId(emp.CompanyId);
                                setFormData({
                                  CompanyName: emp.CompanyName,
                                  CompanyRealmId: emp.CompanyRealmId || "",
                                  DsiplayName: emp.DsiplayName || "",
                                  Email: emp.Email || "",
                                  PhoneNo: emp.PhoneNo || "",
                                  SecondPhoneNo: emp.SecondPhoneNo || "",
                                  Address: emp.Address || "",
                                  Website: emp.Website || "",
                                  isActive: emp.isActive || false,
                                });
                                setErrors({});
                                const offcanvasEl =
                                  document.getElementById("offcanvasExample");
                                const bsOffcanvas = new Offcanvas(offcanvasEl);
                                bsOffcanvas.show();
                              }}
                            >
                              <td>
                                <div className="products">
                                  <h6>{emp.CompanyName}</h6>
                                </div>
                              </td>
                              <td className="text-center">
                                <span>{emp.Email ?? "-"}</span>
                              </td>
                              <td className="text-center">
                                <span>{emp.PhoneNo ?? "-"}</span>
                              </td>
                              <td className="text-center">
                                <span>{emp.Address ?? "-"}</span>
                              </td>
                              <td className="text-center">
                                <span>{emp.Website ?? "-"}</span>
                              </td>
                              <td className="text-center">
                                <span style={{
                                    padding: "2px 10px", fontSize: "11px", borderRadius: "4px", backgroundColor: emp.isActive ? '#28A745' :
                                      emp.isActive === false ? '#FFC107' :
                                          '#000000', color:  '#fff' 
                                          
                                  }}>
                                  {emp.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              {loginUser?.Data.roleId == 1 && (
                                <td className="text-center">
                                  <i
                                    className="fa-solid fa-trash text-danger cursor-pointer delete-icon"
                                    title="Delete Company"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalOpen(true);
                                      setModalConfig({
                                        title: "Confirmation",
                                        description: "Are you sure you want to delete this company?",
                                        onConfirm: () => {
                                          handleDelete(emp.CompanyId);
                                          setModalOpen(false);
                                        },
                                        confirmText: "Delete",
                                        cancelText: "Cancel",
                                      });
                                    }}
                                  ></i>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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
