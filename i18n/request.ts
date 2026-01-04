import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Read locale from cookies, default to 'ar'
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ar";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
