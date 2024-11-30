import TourGuideHeader from "@/components/layout/header/TourGuideHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import CreateItineraryForm from "@/components/itinerary/CreateItineraryForm";

const ItineraryCreationPage = () => {
    return (
        <div className="page-wrapper">
        <TourGuideHeader />
        <main className="page-content">
            <div className="admin-content-details">
            <CreateItineraryForm/>
            </div>
        </main>
        <FooterThree />
        </div>
    );
}
export default ItineraryCreationPage;