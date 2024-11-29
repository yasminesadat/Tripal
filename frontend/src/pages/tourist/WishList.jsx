import React from "react";
import WishList from "@/components/tourist/Wishlist";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Wishlist || Tripal",
  description: "Wishlist || Tripal",
};

export default function WishListPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <WishList />
      </main>
    </>
  );
}
