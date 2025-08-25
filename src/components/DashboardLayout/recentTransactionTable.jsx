import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const RecentTransactionTable = ({ loading, stats }) => {
  const navigate = useNavigate();
  return (
    <div className="col-xl-6">
      <div className="card shadow-sm" style={{ borderRadius: "5px", border: "none" }}>
        <div className="card-header border-0 pb-1 pt-3 " style={{backgroundColor: "#7b9b43",borderTopLeftRadius:"5px",borderTopRightRadius:"5px"}}>
          <div className="d-flex align-items-center mb-2" style={{ width: "100%" }}>
            <h4 className="heading mb-0 me-auto text-white" >
           Transactions
            </h4>
          </div>

        </div>
        <div className="card-body p-0" >
          <div className="table-responsive  style-1 p-0" >
            <table id="employees-tblwrapper" className="table">

              <thead  style={{backgroundColor: "#D3DEE6"}}>
                <tr>
                  <th style={{padding: "5px",fontSize:"14px"}}>Package Name</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>Amount</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>Paid Date</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>Status</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>View</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <CircularProgress />
                    </td>
                  </tr>
                ) : stats?.RecentTransactions?.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">No data found</td></tr>
                ) : (
                  stats?.RecentTransaction?.map((transaction, index) => {
                    return (<tr key={index}>

                      <td>
                        <div className="products">
                          <h6>{transaction?.Name}</h6>
                        </div>
                      </td>

                      <td>
                        <span className="text-center"> {`$${transaction.Price}`}</span>
                      </td>

                      <td>
                        <span>{transaction.PaidDate ? new Date(transaction.PaidDate).toLocaleDateString() : '-'}</span>
                      </td> <td >
                        <span style={{
                          padding: "2px 10px", fontSize: "11px", borderRadius: "4px", backgroundColor: transaction.Status === 'paid' ? '#28A745' :
                            transaction.Status === 'Pending' ? '#FFC107' :
                              transaction.Status === 'incomplete' ? '#000000' :
                                '#FF7676', color:'#fff'
                        }}>
                          {transaction.Status.charAt(0).toUpperCase() + transaction.Status.slice(1)}
                        </span>

                      </td>
                      <td className="text-center">
                          <a
                            href="/transaction"
                            style={{ cursor: "pointer", color: "#7b9b43", textDecoration: "underline" }}
                            onClick={e => {
                              e.preventDefault();
                              navigate('/transaction');
                            }}
                          >
                            View
                          </a>
                        </td>


                    </tr>);
                  }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export const RecentRegisteredTable = ({ loading, stats }) => {
  const navigate = useNavigate();
  return (
    <div className="col-xl-6">
      <div className="card shadow-sm" style={{ borderRadius: "5px", border: "none" }}>
        <div className="card-header border-0 pb-1 pt-3" style={{backgroundColor: "#7b9b43",borderTopLeftRadius:"5px",borderTopRightRadius:"5px"}}>
          <div className="d-flex align-items-center mb-2" style={{ width: "100%" }}>
            <h4 className="heading mb-0 me-auto text-white" >
             Registered
            </h4>
          </div>

        </div>
        <div className="card-body p-0">

          <div className="table-responsive  style-1 p-0" >
            <table id="employees-tblwrapper" className="table">
              <thead  style={{backgroundColor: "#D3DEE6" }}>
                <tr >
                  <th style={{padding: "5px",fontSize:"14px"}}>Name</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>Username</th>
                  <th style={{padding: "5px",fontSize:"14px"  }}>Phone No</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>Status</th>
                  <th style={{padding: "5px",fontSize:"14px"}}>View</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr>
                  <td colSpan={6} className="text-center ">
                    <CircularProgress />
                  </td>
                </tr>
                  : stats?.RecentTenant?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">No data found</td>
                    </tr>
                  ) : stats?.RecentTenant?.map((emp, index) => {

                    return (
                      <tr key={index} >
                        <td className="products">
                          <h6>{emp.CompanyName}</h6>
                        </td>
                        <td className="text-center" >
                          <span>{emp.SubDomain}</span>
                        </td>

                        <td className="text-center" >
                          <span>{emp.PhoneNo}</span>
                        </td>
                       

                        <td >
                          <span style={{
                            padding: "2px 10px", fontSize: "11px", borderRadius: "4px", backgroundColor: emp.isActive ? '#28A745' :
                              emp.isActive === false ? '#FFC107' :
                                '#000000', color: "#fff"
                          }}>
                            {emp.isActive ? "Active" : "Inactive"}
                          </span>


                        </td>
                        <td className="text-center">
                          <a
                            href="/tenant"
                            style={{ cursor: "pointer", color: "#7b9b43", textDecoration: "underline" }}
                            onClick={e => {
                              e.preventDefault();
                              navigate('/tenant');
                            }}
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
