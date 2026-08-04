import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import HomeAdmin from "../../../components/Layouts/Admin/HomeAdmin/HomeAdmin";

const Home = () => {
  return (
      <SidebarAdmin> 
    <MainAdmin 
        title='Dashboard'
        subtitle = 'Overview dan statistik bisnis'
        content = {<HomeAdmin />}
    />
    </SidebarAdmin>
  );
};

export default Home;