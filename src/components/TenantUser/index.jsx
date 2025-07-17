import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import useApi from "../../hooks/useApi";
import { getTenant } from "../../hooks/APIS/TenantApi";

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
  const packageOptions = [
    { value: "", label: "Please select", disabled: true },
    { value: 1, label: "Monthly" },
    { value: 2, label: "Year" },
    { value: 3, label: "Other" },
  ];
  useEffect(() => {
    const data = getTenant();
    console.log("🚀 ~ useEffect ~ data:", data);
  }, []);
  const [employeesData, setEmployeesData] = useState(employees);
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
    Password: "",
    confirmPassword: "",
    entityName: "",
  });
  console.log("🚀 ~ TenantScreen ~ formData:", formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedId === 0) {
      // Create new
      const newId = Math.max(...employeesData.map((emp) => emp.id)) + 1;
      setEmployeesData([
        ...employeesData,
        {
          ...formData,
        },
      ]);
    } else {
      // Update
      const updated = employeesData.map((emp) =>
        emp.id === selectedId ? { ...emp, ...formData } : emp
      );
      setEmployeesData(updated);
    }
    const offcanvasEl = document.getElementById("offcanvasExample");
    const bsOffcanvas =
      Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl);
    bsOffcanvas.hide();

    setOpenForm(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      entityName: "",
    });
    setSelectedId(0);
  };

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
                name: "",
                maxUser: "",
                maxStorage: "",
                monthlyPrice: "",
                maxCompanies: "",
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
                <label className="form-label">Name</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">Email</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">Mobile</label>
                <span class="text-danger">*</span>
                <TextField
                  className="form-control form-control-sm"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <FormControl fullWidth>
                  <label class="form-label">
                    Package<span class="text-danger">*</span>
                  </label>

                  <Select
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    style={{ height: "2.5rem" }}
                  >
                    {packageOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled || false}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Password<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="password"
                  value={formData.password}
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
              <div class="col-xl-6 mb-3">
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
              </div>
            </div>
              <div style={{textAlign:"end"}}>
                <button
                  className="btn btn-primary me-1 "
                  onClick={handleSubmit}
                >
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
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      entityName: "",
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
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        entityName: "",
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
                            name: "",
                            maxUser: "",
                            maxStorage: "",
                            monthlyPrice: "",
                            maxCompanies: "",
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
                                password: emp.password || "",
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
