import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/contacts",
  "/companies",
  "/deals",
  "/pipeline",
  "/tasks",
  "/activities",
  "/emails",
  "/reports",
  "/ai-assistant",
  "/settings",
];

const authPaths = ["/login", "/register"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
