import DashboardLayout from "../DashboardLayout/DashboardLayout";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState,useRef } from "react";
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

export const PackagesScreen = () => {
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
  });
  const editor = useRef(null);
	const [content, setContent] = useState('');

	const config = useMemo(() => ({
			readonly: false,
			placeholder: ''
		}),
		[]
	);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirmation",
    description: "Are you sure you want to delete this package?",
    onConfirm: () => {},
    confirmText: "Delete", 
    cancelText: "Cancel",
  });

  // Pagination and search state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [ "MaxStorageMB", "Price", 'maxCompanies','maxUser'];

    if (name === "name") {
      // Validate name field
      const isValid = /^[a-zA-Z0-9\s_-]{0,50}$/.test(value);
      if (!isValid) return;

      if (value.length > 50) return;
    }

    if (numericFields.includes(name)) {
      if (name === "Price") {
        // Allow numbers and commas for Price field
        const isValid = /^[\d.]*$/.test(value);
        if (!isValid) return;
      } else {
        // Only allow numbers for other numeric fields
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
    if (!formData.Description) newErrors.Description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoader(false);
      // toast.error("Please fill all required fields");
      return;
    }

    setErrors({});

    try {
      const response = await addPackage({
        ...formData,
        PackageId: selectedId,
        Description: content
      });
console.log('response',response)
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

  // Update fetchPackages to use search, page, pageSize
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

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePackage(id);
      if (response?.status === 200) {
        const offcanvasEl = document.getElementById("offcanvasExample");
        const bsOffcanvas = Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
        bsOffcanvas.hide();
        setSelectedId(0);
        fetchPackages();
        setOpenForm(false);
        toast.success(response?.data?.Message || "Package deleted successfully");
      } else {
        toast.error(response?.data?.Message || "Error deleting package");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.Message || "Error deleting package");
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
                maxStorage: "",
                monthlyPrice: "",
                maxCompanies: "",
                Description: "",
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
                <label className="form-label">Name<span class="text-danger">*</span></label>
                <TextField
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
                <label class="form-label">Max User<span class="text-danger">*</span></label>

                <TextField
                  className="form-control form-control-sm"
                  name="maxUser"
                  value={formData.maxUser}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.maxUser}
                  helperText={errors.maxUser}
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Max Storage(MB)<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="MaxStorageMB"
                  value={formData.MaxStorageMB}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.MaxStorageMB}
                  helperText={errors.MaxStorageMB}
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Monthly Price<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="Price"
                  value={formData.Price}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Price}
                  helperText={errors.Price}
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Max Companies<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="maxCompanies"
                  value={formData.maxCompanies}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.maxCompanies}
                  helperText={errors.maxCompanies}
                />
              </div>
              <div class="col-xl-6 mb-3">
                <FormControl fullWidth>
                  <label className="form-label">
                    Type<span className="text-danger">*</span>
                  </label>
                  <Select
                    name="PackageTypeId"
                    value={formData.PackageTypeId}
                    onChange={handleInputChange}
                    style={{ height: "2.5rem" }}
                    error={!!errors.PackageTypeId}
                  >
                    {packageOptions?.map((option) => (
                      <MenuItem
                        key={option.PackageTypeId}
                        value={option.PackageTypeId}
                      >
                        {option.Package}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.PackageTypeId && (
                    <div className="text-danger small">{errors.PackageTypeId}</div>
                  )}
                </FormControl>
              </div>
              <div className="col-xl-12 mb-3">
                <label className="form-label">
                  Description<span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control form-control-sm ${errors.Description ? "is-invalid" : ""}`}
                  name="Description"
                  rows="7"
                  value={formData.Description}
                  onChange={handleInputChange}
                ></textarea>
                {errors.Description && (
                  <div className="text-danger small">{errors.Description}</div>
                )}
              </div>
             
            </div>
            <div style={{ textAlign: "end" }} className="mt-5">
              <button className="btn btn-primary me-1" onClick={handleSubmit}>
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
                    maxStorage: "",
                    monthlyPrice: "",
                    maxCompanies: "",
                    Description: "",
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
                Packages{" "}
              </a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
          <div className="row table-space" >
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className="tbl-caption d-flex justify-content-between align-items-center mb-2 pt-3">
                    <TextField
                     className="serch-package"
                        size="small"
                        placeholder="Search Packages..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ minWidth: 200, marginRight: "15px" }}
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
                                // Prevent row click if delete icon is clicked
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
                                <i
                                  className="fa-solid fa-trash text-danger cursor-pointer delete-icon"
                                  title="Delete Package"
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalOpen(true);
                                    setModalConfig({
                                      title: "Confirmation",
                                      description: "Are you sure you want to delete this package?",
                                      onConfirm: () => {
                                        handleDelete(emp.PackageId);
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
                    {/* Pagination Controls */}
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
