import Provider from "@/components/Provider/Provider";
import "./globals.css";

import { Metadata } from "next";
import {
  getStoreIdFromDomainApi,
  generateUUIDApi,
  signUpLoginApi,
} from "@/components/StoreData/storeData.container";

// export async function generateMetadata(): Promise<Metadata> {
//   const location = decodeURIComponent(global?.window?.location?.href);
//   const WebsiteUrl = location.split("/");
//   const storeId = await getStoreIdFromDomainApi(WebsiteUrl[2]);
//   global?.localStorage?.setItem("StoreId", storeId);

//   let token;
//   if (global?.localStorage?.getItem("token")) {
//     token = global?.localStorage?.getItem("token");
//   } else {
//     token = await generateUUIDApi();
//     global?.localStorage?.setItem("token", token);
//   }

//   const loginData = await signUpLoginApi({
//     language: "english",
//     deviceToken: token,
//     storeId: storeId,
//   });

//   return {
//     title: loginData?.storeName ?? "Ecom",
//     icons: {
//       icon: {
//         url: loginData?.logo,
//         href: loginData?.logo,
//       },
//     },
//   };
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full bg-[#f3f0f0]">
        <Provider child={children} />
      </body>
    </html>
  );
}
