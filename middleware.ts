import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    if (!(await isAuthenticated(request))) {
        // Respond with JSON indicating an error message
        return NextResponse.redirect(new URL('/login', request.url))

    }
}

async function isAuthenticated(request: NextRequest) {
    try {
        let auth = request.headers.get('authorization');
        if (!auth) {
            auth = getAuthFromCookies(request.headers);
        }
        const { payload } = await jwtVerify(auth ?? "", new TextEncoder().encode(process.env.SECRET));
    }
    catch (e: any) {
        // jwtVerify failed -> token is not valid
        return false;
    }

    return true;
}

export const config = {
    matcher: ['/api/post/:path*', '/drafts', '/profile', '/p/:path*']
};

const getAuthFromCookies = (headers: any) => {
    return headers.get("cookie")?.split(';')
        .find((cookie: any) => cookie.trim().startsWith('FrontEndToken='))
        ?.split('=')[1];
}

