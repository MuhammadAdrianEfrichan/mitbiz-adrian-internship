import SideBarSuper from "../../../components/fragments/SuperAdmin/SideBarSuper";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import DashboardSuperAdmin from "../../../components/Layouts/SuperAdmin/DashboardSuperAdmin";

const Dashboard = () => {
    return (
        <SideBarSuper>
            <MainAdmin
                title="Dashboard"
                subtitle="Overview dan statistik bisnis"
                content={<DashboardSuperAdmin />}
            />
        </SideBarSuper>
    );
};

export default Dashboard