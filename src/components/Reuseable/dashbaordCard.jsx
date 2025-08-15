export const DashbaordCardTransaction = ({ total, title, icon, color = "info" }) => {
    return (
        <div class="col-xl-3  col-lg-6 col-sm-6">
            <div class={`card bg-${color}`}>
                <div class="card-body">
                    <div class="students d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h4>{total ?? 0}</h4>
                            <h5>{title}</h5>
                        </div>
                        <div>
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
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
                    {`Total ${title}: ${total}`}
                  </h5>
                </div>
  
                {/* Active Row */}
                <div className="d-flex align-items-center mb-1">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "20px" }}>
                    {activeIcon}
                  </span>
                  <h6 className="mb-0 text-white">
                    {`Active: ${activeAmount}`}
                  </h6>
                </div>
  
                {/* Inactive Row */}
                <div className="d-flex align-items-center">
                  <span className="me-2 d-flex align-items-center" style={{ fontSize: "20px" }}>
                    {inactiveIcon}
                  </span>
                  <h6 className="mb-0 text-white">
                    {`Inactive: ${inactiveAmount}`}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  