'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BugIcon,
  LogOutIcon,
  MailIcon,
  PhoneCallIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PackageIcon,
  MoreVerticalIcon, // Changed to MoreVerticalIcon for hamburger
  UserIcon, // Added for View as Public
  SettingsIcon // Added for Settings
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator // Added for visual separation
} from "@/components/ui/dropdown-menu"; // Assuming you have these UI components

import Footer from "@/app/components/common/footer";
import { Header } from "@/app/components/common/header";
import { useAuth } from "@/app/components/contexts/auth-context";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { User, Product as ProductType, Category, Zone } from '@/lib/types';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation


// ----------- Type for a full Seller User, inheriting from the base 'User' type -----------
type SellerUser = User & {
  phone: string;
  address: string;
  zone: string;
  businessDescription: string;
  sellerStatus: string;
  kycStatus: string;
  trustedUserSince: string;
  trustScore: number;
  createdAt: string;
  updatedAt: string;
  role: "seller";
  emailVerified: boolean;
  isTrustedUser: boolean;
  businessName: string;
  businessLicense: string;
  sellerAppliedAt: string;
  sellerApprovedAt: string;
  reviewCount: number;
  submissionCount: number;
  helpfulVotesReceived: number;
  kycDocuments: string[];
  twoFactorAuth: {
    enabled: boolean;
    backupCodes: string[];
  };
  __v: number;
  lastLogin: string;
  authProviders: string[];
  isActive: boolean;
  favoriteBrokers: string[];
  favoritePropFirms: string[];
};


// ----------- Sample fallback user with seller info -----------
const fallbackUser: SellerUser = {
  _id: "68e3af18bd6fde6e554feb13",
  email: "seller2@example.com",
  firstName: "Fatima",
  lastName: "Khatun",
  phone: "+8801722222222",
  address: "Agrabad, Chittagong",
  zone: "Chittagong",
  authProviders: [],
  isActive: true,
  emailVerified: true,
  role: "seller",
  kycStatus: "approved",
  isTrustedUser: true,
  trustedUserSince: "2024-01-18T00:00:00.000Z",
  trustScore: 78,
  favoriteBrokers: [],
  favoritePropFirms: [],
  sellerStatus: "approved",
  businessName: "Khatun Fashion House",
  businessLicense: "BL-CTG-2024-002",
  businessDescription: "Premium clothing and fashion accessories for wholesale distribution",
  sellerAppliedAt: "2024-01-10T00:00:00.000Z",
  sellerApprovedAt: "2024-01-18T00:00:00.000Z",
  reviewCount: 0,
  submissionCount: 0,
  helpfulVotesReceived: 0,
  kycDocuments: [],
  twoFactorAuth: {
    enabled: false,
    backupCodes: []
  },
  __v: 0,
  createdAt: "2025-10-06T11:59:20.258Z",
  updatedAt: "2025-10-19T00:06:04.762Z",
  lastLogin: "2025-10-19T00:06:04.761Z"
};


const sampleProducts: ProductType[] = [
  {
    _id: "68f0a7eba47c85d7b631c89a",
    name: "Amazing Multipurpose Gift Box",
    description: "Present your products with the quality they deserve.",
    images: [],
    categoryId: { _id: "68e3af17bd6fde6e554feb07", name: "Clothing & Fashion", description: "Apparel, shoes, accessories for men, women, and children" },
    zoneId: { _id: "68e3af17bd6fde6e554feb00", name: "Dhaka", code: "DHA", description: "Capital city and largest commercial hub of Bangladesh" ,isActive:true, sortingOrder:1},
    sellerId: { _id: "someSellerId1", email: "seller1@example.com", firstName: "Test", lastName: "Seller", businessName: "Test Business" }, // Mock sellerId
    pricingTiers: [
      { minQuantity: 100, pricePerUnit: 100 },
      { minQuantity: 500, pricePerUnit: 95 },
    ],
    minimumOrderQuantity: 50,
    stockQuantity: 1000,
    unit: "piece",
    brand: "Dunder Mifflin Paper Box",
    model: "GB-5675vy54f",
    status: "active",
    isActive: true,
    viewCount: 1,
    createdAt: "2025-10-16T08:08:11.219Z",
    updatedAt: "2025-10-16T08:08:11.219Z",
  },
  {
    _id: "68e3af18bd6fde6e554feb1e",
    name: "Denim Jeans Collection",
    description: "Trendy denim jeans for men and women in multiple fits and washes",
    images: [],
    categoryId: { _id: "68e3af17bd6fde6e554feb07", name: "Clothing & Fashion", description: "Apparel, shoes, accessories for men, women, and children" },
    zoneId: { _id: "68e3af17bd6fde6e554feb01", name: "Chittagong", code: "CTG", description: "Major port city and commercial center" ,isActive:true, sortingOrder:2},
    sellerId: { _id: "68e3af18bd6fde6e554feb13", email: "seller2@example.com", firstName: "Fatima", lastName: "Khatun", zone: "Chittagong", businessName: "Khatun Fashion House" },
    pricingTiers: [
      { minQuantity: 20, maxQuantity: 99, pricePerUnit: 1200 },
      { minQuantity: 100, maxQuantity: 299, pricePerUnit: 1100 },
      { minQuantity: 300, pricePerUnit: 1000 }
    ],
    minimumOrderQuantity: 20,
    stockQuantity: 800,
    unit: "piece",
    brand: "DenimCraft",
    model: "DC-DJ500",
    specifications: "98% Cotton, 2% Elastane, Slim/Regular/Relaxed Fit",
    status: "active",
    viewCount: 3,
    isActive: true,
    createdAt: "2025-10-06T11:59:20.458Z",
    updatedAt: "2025-10-16T10:32:24.923Z"
  }
];


// ----------- Type guard for seller user -----------
function isSellerUser(user: User | null | undefined): user is SellerUser {
  return (
    user !== null &&
    user !== undefined &&
    user.role === "seller" &&
    typeof (user as SellerUser).phone === "string" &&
    typeof (user as SellerUser).address === "string" &&
    typeof (user as SellerUser).zone === "string" &&
    typeof (user as SellerUser).businessDescription === "string" &&
    typeof (user as SellerUser).sellerStatus === "string" &&
    typeof (user as SellerUser).kycStatus === "string" &&
    typeof (user as SellerUser).trustedUserSince === "string" &&
    typeof (user as SellerUser).trustScore === "number" &&
    typeof (user as SellerUser).createdAt === "string" &&
    typeof (user as SellerUser).updatedAt === "string"
  );
}

// ----------- Native JS date formatter -----------
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

// ----------- Component -----------
const Body = () => {
  const { user, logout } = useAuth();
  const [simulateError, setSimulateError] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const userData: User | SellerUser = (!user || simulateError) ? fallbackUser : user;

  if (!user && !simulateError) {
    return (
      <BasicPageProvider header={<Header />} footer={<Footer />}>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
          <Skeleton className="p-8 space-y-4 max-w-sm mx-auto text-center rounded-lg shadow-md">
            <Avatar className="mx-auto w-16 h-16">
              <AvatarFallback className="bg-red-200">
                <BugIcon className="h-8 w-8 text-red-600 animate-bounce" />
              </AvatarFallback>
            </Avatar>
            <p className="text-red-600 font-semibold text-lg">
              Something went wrong. Please try to login again.
            </p>
            <Button onClick={logout} variant="destructive" className="mx-auto flex items-center gap-2">
              Log Out <LogOutIcon className="w-5 h-5" />
            </Button>
          </Skeleton>
        </div>
      </BasicPageProvider>
    );
  }

  const fullName = `${userData.firstName} ${userData.lastName}`;
  const isCurrentUserSeller = isSellerUser(userData);

  const handleViewPublicProfile = () => {
    // Navigate to the public profile page using the user's ID
    router.push(`/profile/${userData._id}`);
  };

  const handleSettings = () => {
    router.push('/profile/me/settings');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="bg-accent px-4 py-12 sm:py-16 relative"> {/* Added relative for dropdown positioning */}
        {/* Dropdown Menu */}
        <div className="absolute top-4 right-4 z-10"> {/* Positioned top-right */}
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 text-primary p-2"> {/* Removed "Options" text */}
                <MoreVerticalIcon className="w-5 h-5" /> {/* Hamburger icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem onClick={handleViewPublicProfile}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>View as Public</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Avatar className="w-32 h-32 border-4 border-white bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg">
              <AvatarFallback>
                <ShieldCheckIcon className="h-12 w-12 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-3 right-0 bg-white rounded-full p-1 shadow-md">
              <CheckCircleIcon className="text-green-500 w-6 h-6" />
            </div>
          </motion.div>

          <div className="flex-1 text-center sm:text-left space-y-4">
            <h1 className="text-4xl font-extrabold text-cyan-600">{fullName}</h1>

            {/* Show businessDescription only if user is seller */}
            {isCurrentUserSeller && (
              <p className="text-lg text-gray-100 max-w-xl mx-auto sm:mx-0">
                {userData.businessDescription}
              </p>
            )}

            {/* Contact & seller details */}
            {isCurrentUserSeller ? (
              <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-gray-200 text-sm">
                <div className="flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-cyan-400" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCallIcon className="w-5 h-5 text-cyan-400" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-cyan-400" />
                  <span>{userData.address}, {userData.zone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-cyan-400" />
                  <span>Trusted since {formatDate(userData.trustedUserSince)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span>Trust score: {userData.trustScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                  <span>KYC: {userData.kycStatus}</span>
                </div>
              </div>
            ) : (
              // If not seller, show minimal info:
              <div className="text-gray-200 text-sm">
                <p>Email: {userData.email}</p>
                {/* Use optional chaining for phone and businessName as they might not exist on a generic User */}
                {userData.phone && <p>Phone: {userData.phone}</p>}
                {userData.businessName && <p>Business: {userData.businessName}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products & profile details */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Profile card - only show if current user is a seller */}
          {isCurrentUserSeller && (
            <Card className="flex-1 p-6">
              <CardHeader>
                <CardTitle className="text-cyan-600 text-2xl">Seller Profile</CardTitle>
                <CardDescription className="text-accent-foreground">
                  Details about the seller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><strong>Status:</strong> <span className="capitalize">{userData.sellerStatus}</span></p>
                <p><strong>Joined:</strong> {formatDate(userData.createdAt)}</p>
                <p><strong>Last updated:</strong> {formatDate(userData.updatedAt)}</p>
              </CardContent>
            </Card>
          )}

          {/* Products list */}
          <Card className="flex-1 p-6">
            <CardHeader>
              <CardTitle className="text-cyan-600 text-2xl flex items-center gap-2">
                <PackageIcon className="w-6 h-6" /> My Products
              </CardTitle>
              <CardDescription className="text-accent-foreground">
                Products you have added or sold
              </CardDescription>
            </CardHeader>

            <CardContent>
              {sampleProducts.length === 0 ? (
                <p className="text-gray-600 italic">No product/s added/sold yet.</p>
              ) : (
                <div className="space-y-4">
                  {sampleProducts.map((product) => (
                    <Card key={product._id} className="border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-cyan-700">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Category: {product.categoryId.name}</p>
                        <p className="text-sm text-gray-500">Location: {product.zoneId.name}</p>
                        <p className="mt-2 text-sm font-medium">
                          Price from {product.pricingTiers[0]?.pricePerUnit} per {product.unit} (MOQ: {product.minimumOrderQuantity})
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Simulate error button */}
        <div className="text-center mt-8">
          <Button
            variant={simulateError ? "destructive" : "default"}
            onClick={() => setSimulateError(prev => !prev)}
          >
            {simulateError ? "Simulate Success" : "Simulate Error"}
          </Button>
        </div>
      </main>
    </BasicPageProvider>
  );
};

export default Body;
