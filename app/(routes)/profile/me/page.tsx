import Body from "./body";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Wholesale BD",
  description: "Manage your profile, view your products, and update your information.",
  robots: {
    index: false, // Prevent search engines from indexing this private page
    follow: false,
  },
};

const MyProfilePage = () => {
    return <Body />;
}
 
export default MyProfilePage;