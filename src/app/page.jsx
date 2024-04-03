import Image from "next/image";
import "./globals.css";
import Link from "next/link";

const Home = () => {
  

return (
  <div className="h-screen flex justify-center items-center">
    <div className="flex justify-center items-center h-full w-full">

    <Image src="/all.svg" alt="logo" width={400} height={400} style={{ color: 'red' }} />
    </div>
    <div className="flex items-center h-full w-full flex-col justify-evenly">
    <div>Create a new touranement</div>
    <Link href={"/tournaments"}>Create</Link>
    </div>


  </div>
)

};

export default Home;