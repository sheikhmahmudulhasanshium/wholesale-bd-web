'use client';

import Link from 'next/link';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Header } from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import { useLanguage } from '@/app/components/contexts/language-context';
import { termsContent } from '@/lib/data';

// --- UPDATED DETAILS for Wholesale BD ---
const companyDetails = {
  name: 'Wholesale BD',
  websiteName: 'Wholesale BD',
  websiteUrl: 'https://wholesalebd.com', // Replace with your actual URL
  contactEmail: 'support@wholesalebd.com', // Replace with your actual email
  address: 'Dhaka, Bangladesh', // Replace with your actual address
  phone: '+880 123 456 7890', // Replace with your actual phone
  lastUpdated: 'October 26, 2023',
};
// ------------------------------------

// Define props interface for type safety
interface TermsAndConditionsPageProps {
  className?: string;
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ className }) => {
  // Correctly get the language from the context
  const { language } = useLanguage();

  // Select the content object based on the current language ('en' or 'bn')
  const content = termsContent[language];

  // This function safely renders HTML strings
  const createMarkup = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <main className={`prose max-w-4xl mx-auto p-4 md:p-8 ${className || ''}`}>
        <h1>{content.title}</h1>
        <p className="text-sm text-gray-600">
          <strong>{content.lastUpdatedLabel}:</strong> {companyDetails.lastUpdated}
        </p>

        <p>{content.welcome}</p>
        <p>{content.agreement}</p>

        {/* Dynamically render all sections */}
        <section>
          <h2>{content.sections.general.title}</h2>
          <p dangerouslySetInnerHTML={createMarkup(content.sections.general.agreementToTerms)} />
          <p dangerouslySetInnerHTML={createMarkup(content.sections.general.changesToTerms)} />
        </section>

        <section>
          <h2>{content.sections.products.title}</h2>
          <p dangerouslySetInnerHTML={createMarkup(content.sections.products.descriptions)} />
          <p dangerouslySetInnerHTML={createMarkup(content.sections.products.pricing)} />
          <p dangerouslySetInnerHTML={createMarkup(content.sections.products.availability)} />
        </section>

        <section>
          <h2>{content.sections.orders.title}</h2>
          <p dangerouslySetInnerHTML={createMarkup(content.sections.orders.acceptance)} />
          <p dangerouslySetInnerHTML={createMarkup(content.sections.orders.payment)} />
        </section>
        
        <section>
          <h2>{content.sections.shipping.title}</h2>
          <p dangerouslySetInnerHTML={createMarkup(content.sections.shipping.policy)} />
          <p dangerouslySetInnerHTML={createMarkup(content.sections.shipping.riskOfLoss)} />
        </section>

        <section>
          <h2>{content.sections.returns.title}</h2>
          <p dangerouslySetInnerHTML={createMarkup(content.sections.returns.policy)} />
        </section>

        <section>
          <h2>{content.sections.ip.title}</h2>
          <p>{content.sections.ip.content}</p>
        </section>
        
        <section>
          <h2>{content.sections.prohibited.title}</h2>
          <p>{content.sections.prohibited.intro}</p>
          <ul>
            {content.sections.prohibited.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{content.sections.liability.title}</h2>
          <p>{content.sections.liability.content}</p>
        </section>

        <section>
          <h2>{content.sections.governingLaw.title}</h2>
          <p>{content.sections.governingLaw.content}</p>
        </section>

        <section>
          <h2>{content.sections.contact.title}</h2>
          <p>{content.sections.contact.intro}</p>
          <address className="not-italic">
            <strong>{companyDetails.name}</strong>
            <br />
            Email: <a href={`mailto:${companyDetails.contactEmail}`}>{companyDetails.contactEmail}</a>
            <br />
            Address: {companyDetails.address}
            <br />
            {companyDetails.phone && `Phone: ${companyDetails.phone}`}
          </address>
        </section>
      </main>
    </BasicPageProvider>
  );
};

export default TermsAndConditionsPage;