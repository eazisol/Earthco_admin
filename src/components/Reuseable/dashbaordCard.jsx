export const DashbaordCardTenantCard = ({ total, active, inactive, title }) => {
    const activePercentage = total ? (active / total) * 100 : 0;
    const inactivePercentage = total ? (inactive / total) * 100 : 0;

    return (
      <div className="col-xl-3 col-lg-6 col-sm-6" style={{ cursor: "pointer" }}>
        <div className="card" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <div className="card-body">
            <div className="students d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex align-items-center w-100 justify-content-between">
                <h5 style={{ color: "#6c757d" }}>{title}</h5>
                <h4 style={{ color: "#091c74" }}>{total ?? 0}</h4>
              </div>
              <div className="d-flex align-items-center w-100 justify-content-between">
                <h5 style={{ color: "#6c757d",fontSize:"12px" }}>Active</h5>
                <h4 style={{ color: "#091c74" }}>{active ?? 0}</h4>
              </div>
              <div className="d-flex align-items-center w-100 justify-content-between">
                <h5 style={{ color: "#6c757d",fontSize:"12px" }}>Inactive</h5>
                <h4 style={{ color: "#091c74" }}>{inactive ?? 0}</h4>
              </div>
              <div className="progress" style={{ height: "10px", width: "100%"}}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${activePercentage}%` }}
                  aria-valuenow={activePercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
                <div
                  role="progressbar"
                  style={{ width: `${inactivePercentage}%` }}
                  aria-valuenow={inactivePercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export const DashbaordCardCompany = ({
    total,
    title,
    activeAmount,
    inactiveAmount,
    icon,
    color = "info",
    onClick,
    activeIcon,
    inactiveIcon
  }) => {
    return (
      <div
        className="col-xl-3 col-lg-6 col-sm-6"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className={`card bg-${color}`}>
          <div className="card-body">
            <div className="students d-flex align-items-start justify-content-between flex-wrap">
              <div>
                {/* Total Row */}
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "25px" }}>
                    {icon}
                  </span>
                  <h5 className="mb-0 text-white">
                     {`Total ${title} :   `} <span style={{ color:"#091c74" }}>{total ?? 0}</span> 
                  </h5>
                </div>
  
                {/* Active Row */}
                <div className="d-flex align-items-center  mb-2">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "20px" }}>
                    {activeIcon}
                  </span>
                  <h6 className="mb-0 text-white">
                    {`Active :   `} <span style={{ color:"#091c74" }}>{activeAmount ?? 0}</span>
                  </h6>
                </div>
  
                {/* Inactive Row */}
                <div className="d-flex align-items-center  mb-2">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "20px" }}>
                    {inactiveIcon}
                  </span>
                  <h6 className="mb-0 text-white">
                    {`Inactive :   `} <span style={{ color: "#091c74"}}>{inactiveAmount ?? 0}</span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export const DashbaordCardTenant = ({
    total,
    title,
    icon,
    color = "info",
    percentageChange,
    onClick,
  }) => {
    return (
      <div className="col-xl-3 col-lg-6 col-sm-6" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="card" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <div className="card-body" style={{ padding: "20px" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span style={{ fontSize: "20px"}}>{icon}</span>
                <h5 style={{ margin: "10px 0", color: "#6c757d" }}>{title}</h5>
                <h4 style={{ margin: "0", color: "#091c74" }}>{total ?? 0}</h4>
                {/* <p style={{ margin: "0", color: "#6c757d" }}>Last 30 days</p> */}
              </div>
                {/* <div style={{ display: "flex", alignItems: "center", backgroundColor: "#e0f7fa", borderRadius: "5px", padding: "5px 10px" }}>
                  <span style={{ color: "#00796b", fontSize: "14px" }}>{percentageChange ?? 0}%</span>
                </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }   