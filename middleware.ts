import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/learn", "/onboarding"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));

  // Only run Supabase auth middleware where authentication is actually required.
  // This keeps the public landing/login pages available even if Vercel env vars
  // are temporarily missing or Supabase is unavailable.
  if (!isProtected) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "supabase_env_missing");
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list: { name: string; value: string; options: CookieOptions }[]) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    // Never let a Supabase/network/configuration failure produce a Vercel
    // MIDDLEWARE_INVOCATION_FAILED page. Send the user back to login instead.
    console.error("Supabase middleware error:", error);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "auth_unavailable");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*", "/onboarding/:path*"],
};
