import TouristHeader from "@/components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import WishList from "@/components/tourist/WishList";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Wishlist || Tripal",
  description: "Wishlist || Tripal",
};

export default function WishListPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TouristHeader />
      <main>
        <WishList />
      </main>
      <FooterThree />
    </>
  );
}
