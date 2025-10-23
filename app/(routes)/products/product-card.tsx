import Link from "next/link";
import Image from "next/image";
interface ProductCardProps{
    _id:string;
    variant:'small' |'medium'| 'large';
    url:string;
    name:string;
    price:number;
    imageUrl:string[]|string;
    discount?:number;
    currency?:string;
    zone?:string;
    category?:string;
}
const ProductCard:React.FC<ProductCardProps> = ({variant,url,imageUrl,name}) => {
    {variant==='small'&&(
        <Link href={url}>
            <Image src={''} alt={name} width={100} height={100} />
            <h3>Product Name</h3>
            <p>$99.99</p>
        </Link>
    )}
        
    return null}


 
export default ProductCard;