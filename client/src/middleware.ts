import { type NextRequest, NextResponse } from "next/server";
import { LoginUserDto, TokenResponse } from "./types/auth.type";
import { ErrorResponse } from "./types/error.type";
import { serialize } from "cookie";

const API_URL = process.env.API_URL;

function isTokenResponse(
  data: TokenResponse | ErrorResponse,
): data is TokenResponse {
  return (data as TokenResponse).access_token !== undefined;
}

export async function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.url);

  // Login/Register requests
  if (
    req.nextUrl.pathname === "/api/auth/login" ||
    req.nextUrl.pathname === "/api/auth/register"
  ) {
    try {
      const body = await req.json();

      const response = await fetch(`${API_URL}${req.nextUrl.pathname}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body as LoginUserDto),
      });

      const data: TokenResponse | ErrorResponse = await response.json();

      if (response.ok && isTokenResponse(data)) {
        // Set HTTP-Only cookies
        const accessTokenCookie = serialize("access_token", data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: data.access_token_expires_in,
          path: "/",
        });

        const res = new Response(
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          }),
          {
            status: response.status,
          },
        );
        res.headers.append("Set-Cookie", accessTokenCookie);

        // Return user data without tokens
        return res;
      }

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error during auth request:", error);
      return new Response(
        JSON.stringify({
          message: "Internal Server Error",
          statusCode: 500,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  // Logout request
  if (req.nextUrl.pathname === "/api/auth/logout") {
    const clearAccessToken = serialize("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    const res = new Response(null, {
      status: 204,
    });

    res.headers.append("Set-Cookie", clearAccessToken);

    return res;
  }

  // API calls other than login/register/logout
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const targetUrl = new URL(`${API_URL}${req.nextUrl.pathname}`);
    targetUrl.search = req.nextUrl.search; // Preserve query parameters
    console.log("Proxying request to backend URL:", targetUrl);

    // Get token from HTTP-Only cookie
    const accessToken = req.cookies.get("access_token")?.value;
    // const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const headers = new Headers(req.headers);
    headers.set("host", targetUrl.host);

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Forward request to backend
    const res = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
      redirect: "manual",
    });

    // If access token is expired, try to refresh it
    if (res.status === 401 || res.status === 403) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Valid access token, return backend response
    return new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
  }

  // Protected pages
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const accessToken = req.cookies.get("access_token")?.value;
    // const refreshToken = req.cookies.get("refresh_token")?.value;

    console.log("Attempting to access protected page: ", req.url);

    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
