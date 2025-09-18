import { NextRequest, NextResponse } from 'next/server';

// Middleware untuk mengecek role dan token
export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');
    const roleCookie = req.cookies.get('role');
    const role = roleCookie ? roleCookie.value : null;

    const { pathname } = req.nextUrl;

    // Halaman publik yang tidak perlu proteksi
    const publicPaths = ['/login', '/', '/register'];
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Jika tidak ada token, redirect ke login
    if (!token) {
        const loginUrl = new URL('/', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Jika ada token tapi tidak ada role
    if (!role) {
        const loginUrl = new URL('/', req.url);
        loginUrl.searchParams.set('error', 'User data incomplete');
        return NextResponse.redirect(loginUrl);
    }

    // Proteksi halaman admin - hanya role 'admin' yang boleh akses
    if (pathname.startsWith('/admin')) {
        if (role !== 'admin') {
            const unauthorizedUrl = new URL('/', req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }
        return NextResponse.next();
    }

    // Proteksi halaman main - hanya role 'user' yang boleh akses
    if (pathname.startsWith('/main')) {
        if (role !== 'user') {
            const unauthorizedUrl = new URL('/', req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }
        return NextResponse.next();
    }

    // Untuk halaman lainnya yang membutuhkan autentikasi
    return NextResponse.next();
}

// Define paths where the middleware should be applied
export const config = {
    matcher: [
        '/admin/:path*',
        '/main/:path*',
    ],
};