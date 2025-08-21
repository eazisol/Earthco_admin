import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout/DashboardLayout"
import TitleBar from "../TitleBar"
import { createRole, createRolePermission, deleteRole, 	getRolePermission, getTenantRole } from "../../APIS/auth";
import { toast } from "react-toastify";
import {ConfirmationModal} from "../Reuseable/ConfirmationModal";

export const RoleAndPermission = () => {
	const [roleName, setRoleName] = useState("");
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [getRolesLoading, setGetRolesLoading] = useState(false);
	const [getPermissionLoading, setGetPermissionLoading] = useState(false);
	const [rolePermission, setRolePermission] = useState([]);
	const [accessLoading, setAccessLoading] = useState(false);
	const [roleId, setRoleId] = useState(0);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const getRoles = async () => {
		setGetRolesLoading(true);
		const response = await getTenantRole();
		setRoles(response.data);
		setGetRolesLoading(false);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await createRole({ RoleId: roleId, Role: roleName, isActive: true });
		setLoading(false);
		if (response.status === 200) {
			toast.success(response.data.Message);
			await getRoles();
			setRoleName("");
			setRoleId(0);
		} else if (response.status == 409) {
			toast.error(response.response.data);
			setLoading(false);
		}
	};

	useEffect(() => {
		getRoles();
	}, []);

	const getRolePermissionData = async (id) => {
		setGetPermissionLoading(true);
		const response = await getRolePermission(id);
		setRolePermission(response?.data);
		setGetPermissionLoading(false);
	}

	const handleSendPermission = async (e) => {
		e.preventDefault();
		setAccessLoading(true);
		const menuList = rolePermission?.SelectedMenuAccess;
		const payload = menuList.map(menu => ({
			AccessId: 0,
			EditAccess: false,
			DeleteAccess: false,
			CreateAccess: false,
			MenuId: menu.menuid,
			RoleId: roleId,
			isActive: document.getElementById(`customCheckBox${menu.menuid}2`).checked
		}));
		const response = await createRolePermission(payload);
		if (response.status === 200) {
			toast.success(response.data.Message);
		} else {
			toast.error(response.response.data);
		}
		setAccessLoading(false);
	}

	const handleDeleteRole = async (id) => {
		const response = await deleteRole(id,false	);
		
		if (response.status === 200) {
			toast.success(response.data.Message);
			await getRoles();
			setShowConfirmation(false);
			setRoleId(0);
		}
	}

	return (
		<DashboardLayout>
			<ConfirmationModal
				modalOpen={showConfirmation}
				setModalOpen={setShowConfirmation}
				title="Delete Role"
				description="Are you sure you want to delete this role?"
				onConfirm={()=>{handleDeleteRole(roleId)}}
				confirmText="Delete"
				cancelText="Cancel"
			/>
		
			<div className="content-body">
				<TitleBar title="Roles & Permissions" />

				<div class="container-fluid">
					<div class="row">
						<div class="col-xl-3 col-xxl-4" style={{ position: "fixed", zIndex: 1 }}>
							<div class="card shadow-sm rounded-card h-auto">
								<div class="card-header p-2" >
									<h4 class="heading mb-0" style={{paddingLeft: "10px"}}>Roles </h4>
								</div>
								<div class="card-body" style={{ maxHeight: "75vh", overflowY: "auto" }}>
									<form class="finance-hr row" onSubmit={handleSubmit} >
										<div class="form-group mb-3 col-8 ">
											<label class="text-secondary font-w500">Add New Role<span class="text-danger">*</span>
											</label>
											<input type="text" class="form-control" placeholder="Role Name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
										</div>
										<div class="form-group mb-3 col-4 ">
										<label class="text-white d-block">. 
										</label>
											<button type="submit" class="btn btn-primary " disabled={!roleName || loading}>{loading ? "Loading..." : "Confirm"}</button>
										</div>
									</form>
									{getRolesLoading ? (
										<div>Loading...</div>
									) : roles.length === 0 ? (
										<div>No Roles Found</div>
									) : (
										<div class="card-body px-0 pt-0">
											<ul class="personal-info">
												{roles.map((role) => (
													<li
														key={role.RoleId}
														onClick={() => {
															getRolePermissionData(role.RoleId);
															setRoleId(role.RoleId);
															setRoleName(role.Role)
														}}
														className={roleId === role.RoleId ? "active-role" : ""}
														style={roleId === role.RoleId ? { backgroundColor: "#f0f0f0", borderRadius: "5px", cursor: "pointer", position: "relative" } : { cursor: "pointer", position: "relative" }}
														onMouseEnter={(e) => {
															e.currentTarget.style.backgroundColor = "#e0e0e0";
															e.currentTarget.querySelector('.role-icons').style.display = 'inline';
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.backgroundColor = roleId === role.RoleId ? "#f0f0f0" : "";
															e.currentTarget.querySelector('.role-icons').style.display = 'none';
														}}
													>
														{role.Role}
														<div className="role-icons" style={{ display: 'none', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
															<i className="fas fa-edit" style={{ marginRight: '10px', cursor: 'pointer' }} onClick={(e)=>{ e.stopPropagation(); setRoleName(role.Role); setRoleId(role.RoleId); }}></i>
															<i className="fas fa-trash" style={{ cursor: 'pointer', color: "red" }} onClick={(e)=>{ e.stopPropagation(); setShowConfirmation(true); setRoleId(role.RoleId); }}></i>
														</div>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
						<div class="col-xl-8" style={{ marginLeft: "30%", overflowY: "auto"}}>
							<div class="card shadow-sm rounded-card">
								<div class="card-body">
									<table className="table">
										<thead>
											<tr>
												<th>Module</th>
												<th>Assign Permissions</th>
											</tr>
										</thead>
										<tbody>
											{getPermissionLoading ? (
												<tr>
													<td colSpan="2" style={{ textAlign: "center" }}>Loading...</td>
												</tr>
											) : rolePermission?.SelectedMenuAccess?.length === 0 || rolePermission?.SelectedMenuAccess == null ? (
												<tr>
													<td colSpan="2" style={{ textAlign: "center" }}>Select a role to view permissions</td>
												</tr>
											) : (
												rolePermission?.SelectedMenuAccess?.map((menu, index) => {
													return (
														<tr key={index}>
															<td>{menu?.menu?.Name}</td>
															<td>
																<div className="form-check custom-checkbox checkbox-primary">
																	<input
																		type="checkbox"
																		className="form-check-input"
																		id={`customCheckBox${menu.menuid}2`}
																		checked={menu.isactive}
																		onChange={(e) => {
																			const updatedPermissions = [...rolePermission.SelectedMenuAccess];
																			updatedPermissions[index].isactive = e.target.checked;
																			setRolePermission({
																				...rolePermission,
																				SelectedMenuAccess: updatedPermissions
																			});
																		}}
																	/>
																</div>
															</td>
														</tr>
													);
												})
											)}
											{rolePermission?.SelectedMenuAccess?.length >= 1 && (
												<tr>
													<td colSpan="2" style={{ textAlign: "right", borderBottom: "none" }}>
														<button
															className="btn btn-primary"
															style={{ padding: "10px" }}
															onClick={handleSendPermission}
															disabled={accessLoading}
														>
															{accessLoading ? "Loading..." : "Submit"}
														</button>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	)
}