export const DashbaordCard = ({total,title,icon,color="info",onClick}) => {
    return (
        <div class="col-xl-3  col-lg-6 col-sm-6" onClick={onClick} style={{cursor:"pointer"}}>
        <div class={`card bg-${color}`}>
            <div class="card-body">	
                <div class="students d-flex align-items-center justify-content-between flex-wrap">
                    <div>
                        <h4>{total??0}</h4>
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