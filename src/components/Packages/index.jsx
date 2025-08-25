import DashboardLayout from "../DashboardLayout/DashboardLayout";
import {
  CircularProgress,
  FormControl,
  MenuItem,
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
import Pagination from '@mui/material/Pagination';
import TitleBar from "../TitleBar";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { DashbaordCardTenantCard } from "../Reuseable/dashbaordCard";
import { useNavigate } from "react-router-dom";
export const PackagesScreen = () => {
  const navigate = useNavigate();
  const [packageOptions, setPackageOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    PackageId: selectedId,
    name: "",
    maxUser: "",
    MaxStorageMB: "",
    Price: "",
    maxCompanies: "",
    PackageTypeId: 0,
    Description: "",
    isActive: true,
  });
  const [content, setContent] = useState('');

  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirmation",
    description: "Are you sure you want to delete this package?",
    onConfirm: () => { },
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["MaxStorageMB", "Price", 'maxCompanies', 'maxUser'];

    if (name === "name") {
      const isValid = /^[a-zA-Z0-9\s_-]{0,50}$/.test(value);
      if (!isValid) return;

      if (value.length > 50) return;
    }

    if (numericFields.includes(name)) {
      if (name === "Price") {
        const isValid = /^[\d.]*$/.test(value);
        if (!isValid) return;
      } else {
        const isValid = /^\d*$/.test(value);
        if (!isValid) return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      Description: content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    } else if (!/^[a-zA-Z0-9\s_-]*$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters, numbers, spaces, dashes and underscores";
    }

    if (!formData.maxUser) newErrors.maxUser = "Max User is required";
    if (!formData.MaxStorageMB) newErrors.MaxStorageMB = "Max Storage is required";
    if (!formData.Price) newErrors.Price = "Price is required";
    if (!formData.maxCompanies) newErrors.maxCompanies = "Max Companies is required";
    if (!formData.PackageTypeId) newErrors.PackageTypeId = "Package Type is required";
    if (!formData.Description) {
      newErrors.Description = "Description is required";
    } else if (formData.Description.length > 200) {
      newErrors.Description = "Description must be less than 200 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoader(false);
      return;
    }

    setErrors({});

    try {
      const response = await addPackage({
        ...formData,
        PackageId: selectedId,
      });
      if (response?.status === 200) {
        const offcanvasEl = document.getElementById("offcanvasExample");
        const bsOffcanvas = Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
        bsOffcanvas.hide();

        setOpenForm(false);
        setFormData({
          name: "",
          maxUser: "",
          MaxStorageMB: "",
          Price: "",
          maxCompanies: "",
          PackageTypeId: 0,
          Description: "",
          isActive: true,
        });
        setContent('');
        setSelectedId(0);
        fetchPackages();
        toast.success(response?.data?.Message || "Package saved successfully");
      } else {
        toast.error(response?.response?.data || "Error saving package");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.Message || "Error saving package");
    } finally {
      setLoader(false);
    }
  };

  const fetchPackages = async (searchValue = search, pageValue = page, pageSizeValue = pageSize) => {
    setLoader(true);
    const response = await getPackages({
      Search: searchValue || "",
      DisplayStart: pageValue,
      DisplayLength: pageSizeValue,
    });
    setEmployeesData(response);
    setTotalCount(response?.totalRecords || 0);
    setLoader(false);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchPackages();
    const fetchTenant = async () => {
      try {
        const data = await getPackagesType(user.token.data);
        setPackageOptions(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching package types");
      }
    };
    if (user?.token?.data) {
      fetchTenant();
    }
  }, [page, pageSize]);

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchPackages(value, 1, pageSize);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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
            {selectedId === 0 ? "Add package" : "Edit package"}
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
                name: "",
                maxUser: "",
                MaxStorageMB: "",
                monthlyPrice: "",
                maxCompanies: "",
                Description: "",
                isActive: true,
              });
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="container-fluid">
            <div class="row">
              <div className="col-xl-6 mb-3 ">
                <TextField
                  label="Name"
                  variant="outlined"
                  required
                  className="form-control form-control-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </div>
              <div class="col-xl-6 mb-3">

                <TextField
                  label="Max User"
                  variant="outlined"
                  required
                  className="form-control form-control-sm"
                  name="maxUser"
                  value={formData.maxUser}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.maxUser}
                  helperText={errors.maxUser}
                />
              </div>

              <div class="col-xl-6 mb-3 mt-3">
             
                <TextField
                  label="Max Storage(MB)"
                  variant="outlined"
                  required
                  className="form-control form-control-sm"
                  name="MaxStorageMB"
                  value={formData.MaxStorageMB}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.MaxStorageMB}
                  helperText={errors.MaxStorageMB}
                />
              </div>

              <div class="col-xl-6 mb-3 mt-3">
              
                <TextField
                  label="Max Companies"
                  variant="outlined"
                  required
                  className="form-control form-control-sm"
                  name="maxCompanies"
                  value={formData.maxCompanies}
                  onChange={handleInputChange}
                  size="small"
                      error={!!errors.maxCompanies}
                      helperText={errors.maxCompanies}
                />
              </div>
              <div class="col-xl-6 mb-3 mt-3">
                <FormControl fullWidth>
                
                  <TextField
                    id="outlined-select-type"
                    select
                    label="Type"
                    variant="outlined"
                    required
                    name="PackageTypeId"
                    value={formData.PackageTypeId}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.PackageTypeId}
                    defaultValue={formData.PackageTypeId}
                    helperText={errors.PackageTypeId}
                  >
                    {packageOptions?.map((option) => (
                      <MenuItem
                        key={option.PackageTypeId}
                        value={option.PackageTypeId}
                      >
                        {option.Package}
                      </MenuItem>
                    ))}
                  </TextField>
                 
                </FormControl>
              </div>
              <div class="col-xl-6 mb-3 mt-3">
                
                <TextField
                  label="Monthly Price"
                  variant="outlined"
                  required
                  className="form-control form-control-sm"
                  name="Price"
                  value={formData.Price}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Price}
                  helperText={errors.Price}
                />
              </div>
              <div className="col-xl-12 mb-3 mt-3">
              
                <TextField
                  label="Description"
                  variant="outlined"
                  required
                  className="form-control form-control-sm"
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Description}
                  helperText={errors.Description}
                  multiline
                  rows={3}
                />


              </div>

            </div>
            <div className="row align-items-center mt-5">
              <div className="col-xl-6 ">

                <div className="form-check form-switch">
                  <label
                    className="form-check-label mb-0"
                    style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        isActive: !formData.isActive
                      }));
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
                      }));
                    }}
                  />
                </div>

              </div>
              <div className="col-xl-6">
                <div style={{ textAlign: "end" }} >
                  <button className="btn btn-primary me-1" onClick={handleSubmit} disabled={loader}>
                    {selectedId === 0 ? "Add" : "Update"}
                  </button>



                  <button
                    className="btn btn-danger light ms-1 cancel-btn"
                    onClick={() => {
                      setOpenForm(false);
                      setSelectedId(0);
                      const offcanvasEl =
                        document.getElementById("offcanvasExample");
                      const bsOffcanvas =
                        Offcanvas.getInstance(offcanvasEl) ||
                        new Offcanvas(offcanvasEl);
                      bsOffcanvas.hide();
                      setErrors({});
                      setFormData({
                        name: "",
                        maxUser: "",
                        MaxStorageMB: "",
                        maxCompanies: "",
                        Description: "",
                        isActive: true,
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
        <TitleBar icon={<DescriptionOutlinedIcon />} title="Packages" />
      
        <div className="container-fluid">
          <DashbaordCardTenantCard total={employeesData?.Data?.length} color="info" textColor="#fff" title="Total Packages" icon={<DescriptionOutlinedIcon style={{ color: "#7b9b43", fontSize: "25px" }} />} active={employeesData?.Data?.filter(item => item.isActive).length || 0} inactive={employeesData?.Data?.filter(item => !item.isActive).length || 0} />
          <div className="row table-space" >
            <div className="col-xl-12">
              <div className="card shadow-sm rounded-card "  >
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className=" d-flex justify-content-between align-items-center mb-2 pt-3 ">
                      <TextField
                        label="Search Package"
                        variant="outlined"
                        className="serch-package"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        style={{ minWidth: 200 }}
                      />



                      <button
                        className="btn btn-primary btn-sm add-package-btn"
                        onClick={() => {
                          setSelectedId(0);
                          setFormData({
                            name: "",
                            maxUser: "",
                            MaxStorageMB: "",
                            Price: "",
                            maxCompanies: "",
                            Description: "",
                            isActive: true,
                          });
                          const offcanvasEl =
                            document.getElementById("offcanvasExample");
                          const bsOffcanvas = new Offcanvas(offcanvasEl);
                          bsOffcanvas.show();
                        }}
                      >
                        + Add Package
                      </button>



                    </div>
                    <table id="employees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="text-center">Max User</th>
                          <th className="text-center">max Storage(MB) </th>
                          <th className="text-center">Monthly Price</th>
                          <th className="text-center">Max Companies</th>
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
                        ) : employeesData?.Data?.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          employeesData?.Data?.map((emp, index) => (
                            <tr
                              key={index}
                              onClick={(e) => {
                                if (e.target.closest('.delete-icon')) return;
                                setSelectedId(emp.PackageId);
                                setFormData({
                                  name: emp.Name,
                                  maxUser: emp.MaxUser || "",
                                  MaxStorageMB: emp.MaxStorageMB || "",
                                  Price: emp.Price || "",
                                  maxCompanies: emp.MaxCompanies || "",
                                  PackageTypeId: emp.PackageTypeId,
                                  Description: emp.Description || "",
                                  isActive: emp.isActive,
                                });
                                setContent(emp.Description || "");
                                const offcanvasEl =
                                  document.getElementById("offcanvasExample");
                                const bsOffcanvas = new Offcanvas(offcanvasEl);
                                bsOffcanvas.show();
                              }}
                            >
                              <td>
                                <div className="products">
                                  <h6>{emp.Name}</h6>
                                </div>
                              </td>
                              <td className="text-center">
                                <span>{emp.MaxUser ?? 0}</span>
                              </td>
                              <td className="text-center">
                                <span>{emp.MaxStorageMB ?? 0}</span>
                              </td>
                              <td className="text-center">
                                <span>{`$${emp.Price || 0}`}</span>
                              </td>
                              <td className="text-center">
                                <span>{emp.MaxCompanies ?? 0}</span>
                              </td>
                              <td className="text-center">
                                <span style={{
                                  padding: "2px 10px", fontSize: "11px", borderRadius: "4px", backgroundColor: emp.isActive ? '#28A745' :
                                    emp.isActive === false ? '#FFC107' :
                                      '#000000', color: "#fff"
                                }}>
                                  {emp.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                             
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-end align-items-center p-3">
                      <Pagination
                        count={Math.ceil(totalCount / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color=""
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
