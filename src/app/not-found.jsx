import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
    <div className="mx-auto p-4 text-white">Page not found</div>
    <div className="mx-auto p-4 text-white">Sorry we couldn't fine what you are looking for</div>
    <Link href="/" className="text-gray-300 text-4xl underline hover:text-gray-800 mx-2">Go back to home</Link>
    </div>
  );
}