import { Button } from "@/components/ui/button";
import { LucideChevronLeft, LucideShoppingCart,  } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
    return ( 
        <div className="shadow-accent shadow-2xl bg-accent flex flex-row items-center-safe justify-between">
                <Link href="/products" className="">
                    <Button className="relative inline-flex items-center justify-center p-3 m-2 rounded-full bg-primary text-accent hover:bg-secondary hover:scale-110 transition-all duration-300 ease-in-out shadow-lg transform">
                        <LucideChevronLeft className="m-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2" />
                        <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-all duration-300 ease-in-out"></span>
                    </Button>
                </Link>
                <p>Navbar elements</p>
                    <Button className="relative inline-flex items-center justify-center p-3 m-2 rounded-full bg-primary text-accent hover:bg-secondary hover:scale-110 transition-all duration-300 ease-in-out shadow-lg transform">
                        <LucideShoppingCart className="m-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2" />
                        <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-all duration-300 ease-in-out"></span>
                    </Button>
        </div>
        
     );
}
 
export default Navbar;
