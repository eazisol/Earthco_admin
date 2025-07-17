import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { getPackages } from "../../APIS/packages";
import { AddTenant, getTenant, getTenantRole } from "../../APIS/auth";

export const TenantScreen = () => {
  const employees = [
    {
      id: 1001,
      name: "Liam Antony",
      email: "abc@gmail.com",
      entityName: "dnhey34",
    },
    {
      id: 1002,
      name: "Noah Oliver",
      email: "abc@gmail.com",
      entityName: "dnhey34",
    },
    {
      id: 1003,
      name: "Elijah James",
      email: "abc@gmail.com",
      entityName: "dnhey34",
    },
    {
      id: 1004,
      name: "James Antony",
      email: "abc@gmail.com",
      entityName: "dnhey34",
    },
    {
      id: 1005,
      name: "William Sokli",
      email: "abc@gmail.com",
      entityName: "dnhey34",
    },
  ];

  const [employeesData, setEmployeesData] = useState(employees);
  const [packagesData, setPackagesdata] = useState({});
  const [role, setRole] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [packages, setpackegs] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [openForm, setOpenForm] = useState(false);
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
    TenantId: 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      confirmPassword, // exclude
      PackageId, // exclude
      ...filteredFormData // keep everything else
    } = formData;
    const obj = {
      ...filteredFormData,
      tblUserpackages: [
        {
          UserPackageId: formData?.PackageId,
          PackageId: packagesData?.PackageId,
          TenantId: formData?.TenantId,
          Name: packagesData?.Name,
          PackageTypeId: packagesData?.PackageTypeId,
          MaxUsers: packagesData?.MaxUser,
          MaxStorageMB: packagesData?.MaxStorageMB,
          MaxCompanies: packagesData?.MaxCompanies,
          Price: packagesData?.Price,
        },
      ],
    };
    try {
      const data = await AddTenant(obj);
      if (data.status === 200) {
        const offcanvasEl = document.getElementById("offcanvasExample");
        const bsOffcanvas =
          Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
        bsOffcanvas.hide();
      }
      setFormData({
        FirstName: "",
        LastName: "",
        PhoneNo: "",
        Email: "",
        Password: "",
        confirmPassword: "",
        RoleId: 1,
        SubDomain: "",
        PackageId: 0,
        TenantId: 0,
        CompanyName: "",
      });
      setOpenForm(false);
      setSelectedId(0);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
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
  const fetchTenants = async () => {
    const response = await getTenant({
      Search: "",
      DisplayStart: 1,
      DisplayLength: 10,
    });

    setTenants(response?.Data);
  };
  const getRole = async () => {
    const response = await getTenantRole();
    setRole(response?.data);
  };
  useEffect(() => {
    fetchTenants();
    fetchPackages();
    getRole();
  }, []);
  return (
    <DashboardLayout>
      <div
        class="offcanvas offcanvas-end customeoff"
        tabindex="-1"
        id="offcanvasExample"
      >
        <div class="offcanvas-header">
          <h5 class="modal-title" id="#gridSystemModal">
            Add Tenant
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
              setFormData({
                FirstName: "",
                LastName: "",
                PhoneNo: "",
                Email: "",
                Password: "",
                confirmPassword: "",
                RoleId: 1,
                SubDomain: "",
              });
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="container-fluid">
            {/* <form > */}
            <div class="row">
              <div className="col-xl-6 mb-3">
                <label className="form-label">First Name</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div className="col-xl-6 mb-3">
                <label className="form-label">Last Name</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div className="col-xl-6 mb-3">
                <label className="form-label">Email</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">Comapny Name</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">Mobile</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <FormControl fullWidth>
                  <label className="form-label">
                    Role<span className="text-danger">*</span>
                  </label>
                  <Select
                    name="RoleId"
                    value={formData.RoleId}
                    onChange={handleInputChange}
                    style={{ height: "2.5rem" }}
                  >
                    {role.map((option) => {
                      return (
                        <MenuItem
                          key={option.RoleId}
                          value={option.RoleId}
                          // disabled={option.disabled || false}
                        >
                          {option.Role}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">username</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="SubDomain"
                  value={formData.SubDomain}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              {/* <div class="col-xl-6 mb-3">
                <div className="col-xl-6 mb-3">
                  <label className="form-label">
                    Package<span className="text-danger">*</span>
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      name="PackageId"
                      value={formData.PackageId}
                      onChange={handleInputChange}
                      className="form-select form-select-sm"
                      displayEmpty
                    >
                      {packages.map((option) => (
                        <MenuItem
                          key={option.PackageId}
                          value={option.PackageId}
                          // disabled={option.disabled || false}
                        >
                          {option.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div> */}
              <div class="col-xl-6 mb-3">
                <FormControl fullWidth margin="normal">
                   <label className="form-label">
                    use SSL<span className="text-danger">*</span>
                  </label>
                  <Select
                    labelId="email-ssl-label"
                    name="EmailSSL"
                    value={formData.EmailSSL ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        EmailSSL: e.target.value === "true",
                      }))
                    }
                    label="Use SSL"
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Password<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  size="small"
                  type="password"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  ConfirmPassword<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  size="small"
                  type="password"
                />
              </div>
              {/* <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Entity Name<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="entityName"
                  value={formData.entityName}
                  onChange={handleInputChange}
                  size="small"
                />
              </div> */}
            </div>
            <div style={{ textAlign: "end" }}>
              <button className="btn btn-primary me-1 " onClick={handleSubmit}>
                {selectedId === 0 ? "Add" : "Update"}
              </button>
              <button
                className="btn btn-danger light ms-1"
                onClick={() => {
                  setOpenForm(false);
                  setSelectedId(0);
                  const offcanvasEl =
                    document.getElementById("offcanvasExample");
                  const bsOffcanvas =
                    Offcanvas.getInstance(offcanvasEl) ||
                    new Offcanvas(offcanvasEl);
                  bsOffcanvas.hide();

                  setFormData({
                    FirstName: "",
                    LastName: "",
                    PhoneNo: "",
                    Email: "",
                    Password: "",
                    confirmPassword: "",
                    RoleId: 1,
                    SubDomain: "",
                  });
                }}
              >
                Cancel
              </button>

              {selectedId !== 0 && (
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => {
                    setEmployeesData(
                      employeesData.filter((emp) => emp.id !== selectedId)
                    );
                    setSelectedId(0);
                    setFormData({
                      FirstName: "",
                      LastName: "",
                      PhoneNo: "",
                      Email: "",
                      Password: "",
                      confirmPassword: "",
                      RoleId: 1,
                      SubDomain: "",
                    });
                    const offcanvasEl =
                      document.getElementById("offcanvasExample");
                    const bsOffcanvas =
                      Offcanvas.getInstance(offcanvasEl) ||
                      new Offcanvas(offcanvasEl);
                    bsOffcanvas.hide();

                    setOpenForm(false);
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            {/* </form> */}
          </div>
        </div>
      </div>
      <div className="content-body">
        <div className="page-titles">
          <ol className="breadcrumb">
            {/* <li><h5 className="bc-title">Employee</h5></li> */}
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
                Tenant{" "}
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
                      <h4 className="heading mb-0">Tenant</h4>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedId(0);
                          setFormData({
                            FirstName: "",
                            LastName: "",
                            PhoneNo: "",
                            Email: "",
                            Password: "",
                            confirmPassword: "",
                            RoleId: 1,
                            SubDomain: "",
                          });

                          const offcanvasEl =
                            document.getElementById("offcanvasExample");
                          const bsOffcanvas = new Offcanvas(offcanvasEl);
                          bsOffcanvas.show();
                        }}
                      >
                        + Add Tenant
                      </button>
                    </div>
                    <table id="employees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email Address</th>
                          <th>Entity Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeesData.map((emp, index) => (
                          <tr
                            key={index}
                            onClick={() => {
                              setSelectedId(emp.id);
                              setFormData({
                                name: emp.name,
                                email: emp.email || "",
                                Password: emp.Password || "",
                                confirmPassword: emp.confirmPassword || "",
                                entityName: emp.entityName || "",
                              });

                              // Show the offcanvas properly
                              const offcanvasEl =
                                document.getElementById("offcanvasExample");
                              const bsOffcanvas = new Offcanvas(offcanvasEl);
                              bsOffcanvas.show();
                            }}
                          >
                            <td>
                              <h6>{emp.name}</h6>
                            </td>

                            <td>
                              <span className="text-primary">{emp.email}</span>
                            </td>
                            <td>
                              <span>{emp.entityName}</span>
                            </td>
                          </tr>
                        ))}
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
