// app/(routes)/profile/me/components/body.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/components/contexts/auth-context";
import { useRouter } from "next/navigation";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarDays, Camera, Edit, Mail, Phone, ShieldCheck, Tag, MoreHorizontal, Eye, Images as ImagesIcon, PlusCircle } from "lucide-react";
import { PublicUserProfile, Product, GroupedMedia } from "@/lib/types";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useLanguage } from "@/app/components/contexts/language-context";
import { UploadImageModal } from "@/app/components/modals/upload-image-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductCard } from "../../home/product-card";
// --- THIS IMPORT PATH IS CORRECTED FOR CONSISTENCY ---

export default function Body() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();

  const [publicProfile, setPublicProfile] = useState<PublicUserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [myUploads, setMyUploads] = useState<GroupedMedia | null>(null);
  const [isLoadingUploads, setIsLoadingUploads] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'profile' | 'background'>('profile');

  const fetchPublicProfile = () => {
    if (user?._id) {
      setIsProfileLoading(true);
      apiClient.users.getPublicProfileById(user._id)
        .then(res => setPublicProfile(res.data))
        .catch(err => console.error("Failed to fetch public profile", err))
        .finally(() => setIsProfileLoading(false));
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchPublicProfile();

    if (user?._id) {
      setIsLoadingProducts(true);
      apiClient.products.getBySellerIdPublic(user._id)
        .then(res => setMyProducts(res.data))
        .catch(err => console.error("Failed to fetch user products", err))
        .finally(() => setIsLoadingProducts(false));
      
      setIsLoadingUploads(true);
      apiClient.users.getMyUploads()
        .then(res => setMyUploads(res.data))
        .catch(err => console.error("Failed to fetch user uploads", err))
        .finally(() => setIsLoadingUploads(false));
    }
  }, [user?._id, isAuthenticated, isAuthLoading, router]);

  const handleUploadClick = (type: 'profile' | 'background') => {
    setUploadType(type);
    setIsModalOpen(true);
  };
  
  const handleUploadSuccess = () => {
    fetchPublicProfile();
  };

  if (isAuthLoading || !isAuthenticated || !user) {
    return (
      <BasicPageProvider header={<Header />} footer={<Footer />}>
        <div className="container mx-auto py-8"><Skeleton className="h-[50vh] w-full" /></div>
      </BasicPageProvider>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const getInitials = (firstName?: string, lastName?: string) => `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  const memberSinceFormatted = publicProfile?.memberSince ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(publicProfile.memberSince)) : null;
  const backgroundStyle = publicProfile?.backgroundPicture ? { backgroundImage: `url(${publicProfile.backgroundPicture})` } : {};

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
       <UploadImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        uploadType={uploadType}
      />
      <main className="container mx-auto max-w-5xl py-8 px-4">
        <div className="relative mb-[-4rem] h-48 md:h-64 rounded-t-lg bg-muted bg-cover bg-center" style={backgroundStyle}>
            <Button onClick={() => handleUploadClick('background')} size="sm" variant="secondary" className="absolute bottom-2 right-2">
                <Camera className="mr-2 h-4 w-4" /> Change Cover
            </Button>
        </div>
        <Card className="pt-16 md:pt-20">
          <CardHeader className="flex flex-col md:flex-row items-start gap-6 px-6">
            <div className="relative -mt-32">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                <AvatarImage src={publicProfile?.profilePicture ?? undefined} alt={fullName} />
                <AvatarFallback className="text-4xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
                <Button onClick={() => handleUploadClick('profile')} size="icon" variant="secondary" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 w-full space-y-2">
              <div className="flex w-full items-start justify-between gap-4">
                <h1 className="text-3xl font-bold">{publicProfile?.displayName || fullName}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="flex-shrink-0">
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">Profile options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Public Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {user.businessName && <p className="text-lg text-muted-foreground">{fullName}</p>}
              {publicProfile?.isTrustedUser && <Badge variant="secondary" className="border-green-500 text-green-600"><ShieldCheck className="mr-2 h-4 w-4" /> Trusted Seller</Badge>}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {user.email}</div>
                {publicProfile?.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {publicProfile.phone}</div>}
                {memberSinceFormatted && <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Member since {memberSinceFormatted}</div>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user.businessDescription && <p className="mt-4">{user.businessDescription}</p>}
          </CardContent>
        </Card>

        <Separator className="my-8" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3"><Tag className="h-6 w-6 text-primary"/> My Products</h2>
            {user.role === 'seller' && (
              <Button asChild>
                {/* --- LINK FIXED HERE --- */}
                <Link href="/products/add-product">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Product
                </Link>
              </Button>
            )}
          </div>

          {isLoadingProducts && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}</div>}
          
          {!isLoadingProducts && myProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {myProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  language={language}
                  isEditable={true}
                />
              ))}
            </div>
          )}
          
          {!isLoadingProducts && myProducts.length === 0 && (
            <div className="text-center py-10 border-dashed border-2 rounded-lg">
              <p className="text-muted-foreground">You have not listed any products yet.</p>
              {user.role === 'seller' && (
                <Button asChild className="mt-4">
                  {/* --- LINK FIXED HERE --- */}
                  <Link href="/products/add-product">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    List Your First Product
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator className="my-8" />
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><ImagesIcon className="h-6 w-6 text-primary"/> My Media</h2>
          {isLoadingUploads && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-md" />)}
            </div>
          )}
          {!isLoadingUploads && myUploads?.images && myUploads.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
              {myUploads.images.map(image => (
                <div key={image._id} className="relative aspect-square overflow-hidden rounded-md group">
                   <Image 
                     src={image.url} 
                     alt={image.originalName || 'Uploaded media'} 
                     fill 
                     sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                     className="object-cover transition-transform duration-300 group-hover:scale-105" 
                   />
                </div>
              ))}
            </div>
          )}
          {!isLoadingUploads && (!myUploads?.images || myUploads.images.length === 0) && (
            <p className="text-muted-foreground">You have not uploaded any media yet.</p>
          )}
        </div>
      </main>
    </BasicPageProvider>
  );
}