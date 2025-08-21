import { CircularProgress } from "@mui/material";

export const RecentTransactionTable = ({ loading, stats }) => {
  return (
    <div className="col-xl-6">
      <div className="card shadow-sm" style={{ borderRadius: "13px", border: "none" }}>
        <div className="card-header border-0 pb-0 " >
          <div className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
            <h4 className="heading mb-0 me-auto " >
              Latest Transactions
            </h4>
          </div>

        </div>
        <div className="card-body p-0" >
          <div className="table-responsive  style-1" style={{ padding: "0px 15px" }}>
            <table id="employees-tblwrapper" className="table">

              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Amount</th>
                  <th>Paid Date</th>
                  <th>Status</th>
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
                          <h6>{transaction?.tblTenant?.PackageName}</h6>
                        </div>
                      </td>

                      <td>
                        <span className="text-center"> {`$${transaction.Price}`}</span>
                      </td>

                      <td>
                        <span>{transaction.PaidDate ? new Date(transaction.PaidDate).toLocaleDateString() : '-'}</span>
                      </td> <td className="text-center">
                        <span style={{
                          padding: "2px 10px", fontSize: "11px", borderRadius: "12px", backgroundColor: transaction.Status === 'paid' ? '#c2ded1' :
                            transaction.Status === 'Pending' ? '#fff3cd' :
                              transaction.Status === 'incomplete' ? '#f8d7da' :
                                '#e2e3e5', color: transaction.Status === 'paid' ? '#03543f' :
                                  transaction.Status === 'Pending' ? '#664d03' :
                                    transaction.Status === 'incomplete' ? '#842029' :
                                      '#41464b'
                        }}>
                          {transaction.Status.charAt(0).toUpperCase() + transaction.Status.slice(1)}
                        </span>

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
  return (
    <div className="col-xl-6">
      <div className="card shadow-sm" style={{ borderRadius: "13px", border: "none" }}>
        <div className="card-header border-0 pb-0 " >
          <div className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
            <h4 className="heading mb-0 me-auto " >
              Latest Registered
            </h4>
          </div>

        </div>
        <div className="card-body p-0">

          <div className="table-responsive  style-1" style={{ padding: "0px 15px" }}>
            <table id="employees-tblwrapper" className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="text-center">Username</th>
                  <th className="text-center">Phone No</th>
                  {/* <th className="text-center">Role</th> */}
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr>
                  <td colSpan={6} className="text-center py-5">
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
                        <td >
                          <h6>{emp.CompanyName}</h6>
                        </td>
                        <td className="text-center" >
                          <span>{emp.SubDomain}</span>
                        </td>

                        <td className="text-center" >
                          <span>{emp.PhoneNo}</span>
                        </td>
                        {/* <td className="text-center">
                              <h6>{emp.Role}</h6>
                            </td> */}

                        <td className="text-center">
                          <span style={{
                            padding: "2px 10px", fontSize: "11px", borderRadius: "12px", backgroundColor: emp.isActive ? '#c2ded1' :
                              emp.isActive === false ? '#f8d7da' :
                                '#e2e3e5', color: emp.isActive ? '#03543f' :
                                  emp.isActive === false ? '#842029' :
                                    '#41464b'
                          }}>
                            {emp.isActive ? "Active" : "Inactive"}
                          </span>


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
