import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './styles/globals.css';

export const metadata: Metadata = {
  title: "Bookeez",
  description: "A platform to buy and sell Books",
};

// className={`antialiased`}[77.9vh]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased `}>
        <Navbar/>     
        <div className=" min-h-[83.4vh]">{children}</div>        
        <Footer/>
      </body>
    </html>
  );
}
