import ProfileInfo from "@/components/Profile/ProfileInfo";
import RecentActivity from "@/components/Profile/RecentActivity";
import Header from "@/components/Header";

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header backUrl="/" title="User Profile" />
      <ProfileInfo />
      <RecentActivity />
    </main>
  );
}
