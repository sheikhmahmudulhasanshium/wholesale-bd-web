'use server'
import TermsAndConditionsPage from './body';
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  const title = "Terms & Conditions - Wholesale BD";
  const description = "Read the terms and conditions for using our website and services.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}
const TermsPage = () => {
  return (
    <>
      <TermsAndConditionsPage />
    </>
  );
};

export default TermsPage;