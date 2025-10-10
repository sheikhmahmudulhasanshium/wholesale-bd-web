// app/profile/[id]/settings/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// No changes needed in your data fetching function
async function getProfileData(id: string) {
  try {
    if (id === "46568yhdusw67" || id === "123") { // Added '123' for testing
      return {
        id: id,
        name: "Mirza Showvik",
        description: "Building the future of web applications with Next.js.",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

// --- FIX #1: Correct the function signature for generateMetadata ---
type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = await getProfileData(params.id);

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${profile.name}'s Settings`,
    description: `Manage settings for ${profile.name}. ${profile.description}`,
  };
}


// --- FIX #2: Correct the function signature for the Page Component ---
export default async function ProfileSettingsPage({ params }: PageProps) {
  const profile = await getProfileData(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div>
      {/* For simplicity, I'm removing the client component for now.
          You can add it back as needed. The main fix is above. */}
      <h1 className="text-3xl font-bold">Settings for {profile.name}</h1>

      <div id="appearance" className="mt-8">
        <h2 className="text-2xl">Appearance Settings</h2>
        <p>Theme, layout, and more...</p>
      </div>
      
      <div id="account" className="mt-8">
        <h2 className="text-2xl">Account Settings</h2>
        <p>Username, password, etc...</p>
      </div>
    </div>
  );
}