import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { TextField } from "@mui/material";
import { useState } from "react";
import { Offcanvas } from "bootstrap";

export const TransactionsScreen = () => {
  const employees = [
    {
      id: 1001,
      name: "Liam Antony",
      maxUser: 20,
      maxStorage: 3,
      monthlyPrice: 5,
      maxCompanies: 23,
    },
    {
      id: 1002,
      name: "Noah Oliver",
      maxUser: 20,
      maxStorage: 3,
      monthlyPrice: 5,
      maxCompanies: 23,
    },
    {
      id: 1003,
      name: "Elijah James",
      maxUser: 20,
      maxStorage: 3,
      monthlyPrice: 5,
      maxCompanies: 23,
    },
    {
      id: 1004,
      name: "James Antony",
      maxUser: 20,
      maxStorage: 3,
      monthlyPrice: 5,
      maxCompanies: 23,
    },
    {
      id: 1005,
      name: "William Sokli",
      maxUser: 20,
      maxStorage: 3,
      monthlyPrice: 5,
      maxCompanies: 23,
    },
  ];
  const [employeesData, setEmployeesData] = useState(employees);
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
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

    setOpenForm(false);
    setFormData({
      name: "",
      maxUser: "",
      maxStorage: "",
      monthlyPrice: "",
      maxCompanies: "",
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
            Add Transaction
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="container-fluid">
            {/* <form > */}
            <div class="row">
              <div className="col-xl-6 mb-3">
                <label className="form-label">Name</label>
                <TextField
                  className="form-control form-control-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label class="form-label">Max User</label>
                <TextField
                  className="form-control form-control-sm"
                  name="maxUser"
                  value={formData.maxUser}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>

              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Max Storage<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="maxStorage"
                  value={formData.maxStorage}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div class="col-xl-6 mb-3">
                <label for="exampleFormControlInput10" class="form-label">
                  Monthly Price<span class="text-danger">*</span>
                </label>
                <TextField
                  className="form-control form-control-sm"
                  name="monthlyPrice"
                  value={formData.monthlyPrice}
                  onChange={handleInputChange}
                  size="small"
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
                />
              </div>
            </div>
            <div>
              <div>
                <button className="btn btn-primary me-1" onClick={handleSubmit}>
                  {selectedId === 0 ? "Add" : "Update"}
                </button>
                <button
                  className="btn btn-danger light ms-1"
                  onClick={() => {
                    setOpenForm(false);
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
                        maxUser: "",
                        maxStorage: "",
                        monthlyPrice: "",
                        maxCompanies: "",
                      });
                      setOpenForm(false);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
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
          <div className="row"  style={{marginLeft:"0.5px"}}>
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <div className="tbl-caption">
                      <h4 className="heading mb-0">Transactions</h4>
                     
                    </div>
                    <table id="employees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Max User</th>
                          <th>max Storage</th>
                          <th>Monthly Price</th>
                          <th>Max Companies</th>
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
                                maxUser: emp.maxUser || "",
                                maxStorage: emp.maxStorage || "",
                                monthlyPrice: emp.monthlyPrice || "",
                                maxCompanies: emp.maxCompanies || "",
                              });

                              // Show the offcanvas properly
                              const offcanvasEl =
                                document.getElementById("offcanvasExample");
                              const bsOffcanvas = new Offcanvas(offcanvasEl);
                              bsOffcanvas.show();
                            }}
                          >
                            <td>
                              <div className="products">
                                <h6>{emp.name}</h6>
                              </div>
                            </td>
                            <td>
                              <span>{emp.maxUser}</span>
                            </td>
                            <td>
                              <span>{emp.maxStorage}</span>
                            </td>
                            <td>
                              <span>{`$${emp.monthlyPrice}`}</span>
                            </td>
                            <td>
                              <span>{emp.maxCompanies}</span>
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
