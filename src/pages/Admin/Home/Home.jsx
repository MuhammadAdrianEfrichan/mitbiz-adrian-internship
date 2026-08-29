import { useEffect, useState } from "react";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SubscriptionRequiredScreen from "../../../components/Layouts/Admin/HomeAdmin/HomeAdmin";
import SummaryCard from "../../../components/fragments/Admin/SummaryCard/SummaryCard";
import ProdukTerLaris from "../../../components/fragments/Admin/ProdukTerLaris/ProdukTerLaris";
import TrenDataAdmin from "../../../components/fragments/Admin/TrendDataAdmin";
import PenjualanPerCabangAdmin from "../../../components/fragments/Admin/PenjualanPerCabangAdmin";
import PenjualanPerPembayaran from "../../../components/fragments/Admin/PenjualanPerPembayaran";
import { getDasboard } from "../../../services/Admin/dasboard.service";
import { environment } from "../../../constant/environment";

const Home = () => {
  const [subStatus, setSubStatus] = useState(null); // null = loading
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    // Cek status subscription dulu
    fetch(`${environment.API_URL}/subscriptions/my`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const isActive = data?.data?.hasActiveSubscription === true;
        setSubStatus(isActive);

        // Kalau aktif, ambil data dashboard sekalian
        if (isActive) {
          getDasboard()
            .then((res) => setDashboard(res?.data ?? res))
            .catch(() => setDashboard({}));
        }
      })
      .catch(() => setSubStatus(false));
  }, []);

  // Loading
  if (subStatus === null) {
    return (
      <SidebarAdmin>
        <MainAdmin
          title="Dashboard"
          subtitle="Overview dan statistik bisnis"
          content={
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              Memuat...
            </div>
          }
        />
      </SidebarAdmin>
    );
  }

  // Belum berlangganan → tampilkan layar pilih paket
  if (!subStatus) {
    return (
      <SidebarAdmin>
        <MainAdmin
          title="Dashboard"
          subtitle="Overview dan statistik bisnis"
          content={<SubscriptionRequiredScreen />}
        />
      </SidebarAdmin>
    );
  }

  // Sudah berlangganan → tampilkan dashboard lengkap
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Dashboard"
        subtitle="Overview dan statistik bisnis"
        content={
          <div>
            <SummaryCard summary={dashboard?.summary} />

            <TrenDataAdmin data={dashboard?.trend ?? []} />

            <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
              <PenjualanPerCabangAdmin data={dashboard?.perOutlet ?? dashboard?.perCabang ?? []} />
              <PenjualanPerPembayaran data={dashboard?.perPayment ?? []} />
            </div>

            <ProdukTerLaris
              products={dashboard?.topProducts ?? []}
              stocks={dashboard?.stocks ?? []}
            />
          </div>
        }
      />
    </SidebarAdmin>
  );
};

export default Home;