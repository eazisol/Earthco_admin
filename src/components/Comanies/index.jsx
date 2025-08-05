import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
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

export const CompaniesScreen = () => {
  const [packageOptions, setPackageOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    CompanyName: "",
    CompanyRealmId: "",
    DsiplayName: "",
    Address: "",
    PhoneNo: "",
    Website: "",
    SecondPhoneNo: "",
    Email: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirmation",
    description: "Are you sure you want to delete this company?",
    onConfirm: () => {},
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Remove error for the field as user types
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

    // Validate required fields before setting loader
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

    // Check if email already exists
    const emailExists = employeesData?.some(company =>
      company.Email?.toLowerCase() === formData.Email.toLowerCase() &&
      company.CompanyId !== selectedId
    );

    if (emailExists) {
      newErrors.Email = "This email is already registered with another company";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Don't set loader if there are errors
      return;
    }

    setLoader(true);
    setErrors({});

    const obj = {
      ...formData,
      CompanyId: selectedId,
    };
    // console.log(obj, 'obj');
    try {
      const response = await addCompany(obj);
      // console.log(response, 'response');
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
        });
        setSelectedId(0);
        fetchCompanies();
        toast.success(response?.data?.Message);
      } else {
        toast.error("Error adding company");
      }
    } catch (error) {
      toast.error("Error adding company");
    } finally {
      setLoader(false);
    }
  };

  const fetchCompanies = async () => {
    setLoader(true);
    const response = await getCompanyList();
    console.log(response, 'response');
    setEmployeesData(response?.data?.Data);
    setLoader(false);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchCompanies();
    const fetchTenant = async () => {
      try {
        const data = await getPackagesType(user.token.data);
        setPackageOptions(data);
      } catch (err) { }
    };

    if (user.token.data) {
      fetchTenant();
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteCompany(id);
      // console.log('response', response);
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
              });
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="container-fluid">
            <div class="row">
              <div className="col-xl-6 mb-3">
                <label className="form-label">
                  Company Name<span class="text-danger">*</span>
                </label>
                <TextField
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
              <div class="col-xl-6 mb-3">
                <label class="form-label">
                  Company Realm ID<span class="text-danger">*</span>
                </label>
                <TextField
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

              <div class="col-xl-6 mb-3">
                <label class="form-label">Display Name</label>
                <TextField
                  className="form-control form-control-sm"
                  name="DsiplayName"
                  value={formData.DsiplayName}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ maxLength: 50 }}
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label class="form-label">
                  Email<span class="text-danger">*</span>
                </label>
                <TextField
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

              <div class="col-xl-6 mb-3">
                <label class="form-label">
                  Phone Number<span class="text-danger">*</span>
                </label>
                <TextField
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

              <div class="col-xl-6 mb-3">
                <label class="form-label">Secondary Phone Number</label>
                <TextField
                  className="form-control form-control-sm"
                  name="SecondPhoneNo"
                  value={formData.SecondPhoneNo}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ minLength: 7, maxLength: 15 }}
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label class="form-label">Website</label>
                <TextField
                  className="form-control form-control-sm"
                  name="Website"
                  value={formData.Website}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ maxLength: 255 }}
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label class="form-label">Address</label>
                <TextField
                  className="form-control form-control-sm"
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ maxLength: 255 }}
                />
              </div>
            </div>

            <div style={{ textAlign: "end" }}>
              <button className="btn btn-primary me-1" onClick={handleSubmit}>
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
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="content-body">
 <TitleBar icon={  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6.46932 12.2102H0.693665" stroke='#888888' stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M9.04547 3.32535H14.8211" stroke='#888888' stroke-linecap="round" stroke-linejoin="round"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M4.99912 3.27573C4.99912 2.08805 4.02914 1.125 2.8329 1.125C1.63667 1.125 0.666687 2.08805 0.666687 3.27573C0.666687 4.46342 1.63667 5.42647 2.8329 5.42647C4.02914 5.42647 4.99912 4.46342 4.99912 3.27573Z" stroke='#888888' stroke-linecap="round" stroke-linejoin="round"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M15.3333 12.1743C15.3333 10.9866 14.3641 10.0235 13.1679 10.0235C11.9709 10.0235 11.0009 10.9866 11.0009 12.1743C11.0009 13.3619 11.9709 14.325 13.1679 14.325C14.3641 14.325 15.3333 13.3619 15.3333 12.1743Z" stroke='#888888' stroke-linecap="round" stroke-linejoin="round"/>
							</svg>} title="Companies" />
        <div className="container-fluid">
          <div className="row ">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className="tbl-caption">
                      <h4 className="heading mb-0">Companies</h4>
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
                          });
                          setErrors({}); // Clear errors when opening the form

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
                          <th className="text-center">Action</th>
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
                                // Prevent row click if delete icon is clicked
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
                                });
                                setErrors({}); // Clear errors when editing

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
