import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { TextField } from "@mui/material";
import { useState } from "react";
import { Offcanvas } from "bootstrap";

export const EmailScreen = () => {
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

    const numericFields = [
      "maxUser",
      "maxStorage",
      "monthlyPrice",
      "maxCompanies",
    ];

    if (numericFields.includes(name)) {
      const isValid = /^\d*$/.test(value);
      if (!isValid) return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedId === 0) {
      const newId = Math.max(...employeesData.map((emp) => emp.id)) + 1;
      setEmployeesData([
        ...employeesData,
        {
          ...formData,
        },
      ]);
    } else {
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
            Add Email
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
                    const offcanvasEl =
                      document.getElementById("offcanvasExample");
                    const bsOffcanvas =
                      Offcanvas.getInstance(offcanvasEl) ||
                      new Offcanvas(offcanvasEl);
                    bsOffcanvas.hide();

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
            </div>
            {/* </form> */}
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
                Email Settings{" "}
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
                      <h4 className="heading mb-0">Email Settings</h4>
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
                        + Add Email
                      </button>
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
