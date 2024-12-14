import ActivityForm from "../../components/activity/CreateActivityForm";
import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";
import FooterThree from '@/components/layout/footers/FooterThree';

const CreateActivity = () => {

  return (
    <div>
      <AdvertiserHeader />
      <ActivityForm />
      <FooterThree />
    </div>
  );
};

export default CreateActivity;
