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
import { addCompany,deleteCompany,getCompanyList } from "../../APIS/companies";

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const newErrors = {};
    if (!formData.CompanyName.trim()) newErrors.CompanyName = "Company Name is required";
    if (!formData.CompanyRealmId.trim()) newErrors.CompanyRealmId = "Company Realm ID is required";
    if (!formData.Email.trim()) newErrors.Email = "Email is required";
    if (!formData.PhoneNo.trim()) newErrors.PhoneNo = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoader(false);
      return;
    }

    setErrors({});

    const obj = {
      ...formData,
      CompanyId: selectedId,
    };
console.log(obj,'obj');
    try {
      const response = await addCompany(obj);
      console.log(response,'response');
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
    console.log(response,'response');
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
      } catch (err) {}
    };

    if (user.token.data) {
      fetchTenant();
    }
  }, []);

  const handleDelete = async () => {
    try {
      const response = await deleteCompany(selectedId);
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
        tabindex="-1"
        id="offcanvasExample"
      >
        <div class="offcanvas-header">
          <h5 class="modal-title" id="#gridSystemModal">
            Add Company
          </h5>
          <button
            type="button"
            className="btn-close"
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
                <label className="form-label">Company Name</label>
                <TextField
                  className="form-control form-control-sm"
                  name="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.CompanyName}
                  helperText={errors.CompanyName}
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">Company Realm ID</label>
                <TextField
                  className="form-control form-control-sm"
                  name="CompanyRealmId"
                  value={formData.CompanyRealmId}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.CompanyRealmId}
                  helperText={errors.CompanyRealmId}
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
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label class="form-label">Email</label>
                <TextField
                  className="form-control form-control-sm"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Email}
                  helperText={errors.Email}
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label class="form-label">Phone Number</label>
                <TextField
                  className="form-control form-control-sm"
                  name="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.PhoneNo}
                  helperText={errors.PhoneNo}
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
                />
              </div>
            </div>

            <div style={{ textAlign: "end" }}>
              <button className="btn btn-primary me-1" onClick={handleSubmit}>
                {selectedId === 0 ? "Add" : "Update"}
              </button>
              <button
                className="btn btn-danger light ms-1"
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

              {selectedId !== 0 && (
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => {
                    setModalOpen(true);
                    setModalConfig({
                      title: "Confirmation",
                      description: "Are you sure you want to delete this company?",
                      onConfirm: () => {
                        handleDelete();
                        setModalOpen(false);
                      },
                      confirmText: "Delete",
                      cancelText: "Cancel",
                    });
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
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
                    d="M13.5096 2.53165H7.41104C5.50437 2.52432 3.94146 4.04415 3.89654 5.9499V15.7701C3.85437 17.7071 5.38979 19.3121 7.32671 19.3552C7.35512 19.3552 7.38262 19.3561 7.41104 19.3552H14.7343C16.6538 19.2773 18.1663 17.6915 18.1525 15.7701V7.36798L13.5096 2.53165Z"
                    stroke="#888888"
                    strokeRinecap="round"
                    strokeRinejoin="round"
                  />
                  <path
                    d="M13.2688 2.52084V5.18742C13.2688 6.48909 14.3211 7.54417 15.6228 7.54784H18.1482"
                    stroke="#888888"
                    strokeRinecap="round"
                    strokeRinejoin="round"
                  />
                  <path
                    d="M13.0974 14.0786H8.1474"
                    stroke="#888888"
                    strokeRinecap="round"
                    strokeRinejoin="round"
                  />
                  <path
                    d="M11.2229 10.6388H8.14655"
                    stroke="#888888"
                    strokeRinecap="round"
                    strokeRinejoin="round"
                  />
                </svg>
                Companies{" "}
              </a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
          <div className="row" style={{ marginLeft: "0.5px" }}>
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
                        </tr>
                      </thead>
                      <tbody>
                        {loader ? (
                          <tr>
                            <td colSpan={5} className="text-center py-5">
                              <CircularProgress />
                            </td>
                          </tr>
                        ) : employeesData?.length == 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          employeesData?.map((emp, index) => (
                            <tr
                              key={index}
                              onClick={() => {
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
