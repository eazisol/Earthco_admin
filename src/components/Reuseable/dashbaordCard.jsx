export const DashbaordCardTenantCard = ({ total, active, inactive, title,icon ,Active="Active",Inactive="Inactive"}) => {
    const activePercentage = total ? (active / total) * 100 : 0;
    const inactivePercentage = total ? (inactive / total) * 100 : 0;

    return (
      <div className="col-xl-3 col-lg-6 col-sm-6" style={{ cursor: "pointer" }}>
        <div className="card" style={{borderRadius:"5px"}}>
          <div className="card-body">
            <div className="students d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex align-items-center w-100 justify-content-between">
                <div className="d-flex align-items-center">
                <div style={{ fontSize: "20px", color: "#7b9b43" ,marginBottom: "10px"}}>{icon}</div>
                <h5 style={{ color: "#6c757d",marginLeft: "10px" }}>{title}</h5>
                </div>
                <h4 style={{ color: "#091c74" }}>{total ?? 0}</h4>
              </div>
              {/* Progress bar with active/inactive labels */}
              <div className="w-100 mt-2">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "12px" }}>
                  <span style={{ color: "#7b9b43" }}>{Active}: {active ?? 0}</span>
                  <span style={{ color: "#dc3545" }}>{Inactive}: {inactive ?? 0}</span>
                </div>
                <div className="progress" style={{ height: "5px", width: "100%" ,backgroundColor:"#CCCDC6"}}>
                  <div
                    className="progress-bar "
                    role="progressbar"
                    style={{ width: `${activePercentage}%`, backgroundColor: "#7b9b43" }}
                    aria-valuenow={activePercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                  <div
                    // className="progress-bar bg-danger"
                    // role="progressbar"
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
                <div className="d-flex align-items-center mb-1">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "25px" }}>
                    {icon}
                  </span>
                  <h5 className="mb-0 text-white">
                     {`Total ${title} :   `} <span style={{ color:"#091c74" }}>{total ?? 0}</span> 
                  </h5>
                </div>
  
                {/* Active Row */}
                <div className="d-flex align-items-center  mb-1">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "20px" }}>
                    {activeIcon}
                  </span>
                  <span className="mb-0 text-white">
                    {`Active :   `} <span style={{ color:"#091c74",fontSize: "20px" }}>{activeAmount ?? 0}</span>
                  </span>
                </div>
  
                {/* Inactive Row */}
                <div className="d-flex align-items-center  mb-1">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "20px" }}>
                    {inactiveIcon}
                  </span>
                  <span className="mb-0 text-white">
                    {`Inactive :   `} <span style={{ color: "#091c74",fontSize: "20px" }}>{inactiveAmount ?? 0}</span>
                  </span>
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
    textColor = "#000"
  }) => {
    return (
      <div className={`col-xl-3 col-lg-6 col-sm-6 `}>
        <div className={`card  bg-${color}`} onClick={onClick}  style={{  cursor: "pointer" }}>
          <div className="card-body" style={{ padding: "20px" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center mb-2">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>{icon}</span>
                  <h5 style={{ margin: "0", color: '#fff' }}>{title}</h5>
                </div>
                <h4 style={{ margin: "0 0 0 34px", color: textColor }}>{total ?? 0}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }   