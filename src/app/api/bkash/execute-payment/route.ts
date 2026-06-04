import { NextRequest, NextResponse } from "next/server";

const BKASH_BASE_URL =
    process.env.BKASH_BASE_URL || "https://checkout.sandbox.bka.sh/v1.2.0-beta";

type BkashTokenResponse = {
    id_token?: string;
    token?: string;
    access_token?: string;
};

function getBaseUrl(request: NextRequest): string {
    return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
}

function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not configured`);
    }
    return value;
}

async function getBkashToken(): Promise<string> {
    const appKey = getRequiredEnv("BKASH_APP_KEY");
    const appSecret = getRequiredEnv("BKASH_APP_SECRET");
    const username = getRequiredEnv("BKASH_USERNAME");
    const password = getRequiredEnv("BKASH_PASSWORD");

    const response = await fetch(`${BKASH_BASE_URL}/checkout/token/grant`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            username,
            password,
        },
        body: JSON.stringify({
            app_key: appKey,
            app_secret: appSecret,
        }),
    });

    const data = (await response.json()) as BkashTokenResponse;

    if (!response.ok) {
        throw new Error("Failed to obtain bKash access token");
    }

    const token = data.id_token || data.token || data.access_token;
    if (!token) {
        throw new Error("bKash access token missing from response");
    }

    return token;
}

async function executePayment(paymentId: string): Promise<void> {
    const appKey = getRequiredEnv("BKASH_APP_KEY");
    const token = await getBkashToken();

    const response = await fetch(
        `${BKASH_BASE_URL}/checkout/payment/execute/${paymentId}`,
        {
            method: "POST",
            headers: {
                accept: "application/json",
                Authorization: token,
                "X-APP-Key": appKey,
            },
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to execute bKash payment");
    }
}

async function handleCallback(request: NextRequest): Promise<NextResponse> {
    const url = new URL(request.url);
    const paymentId =
        url.searchParams.get("paymentID") ||
        url.searchParams.get("paymentId") ||
        url.searchParams.get("payment_id");

    if (!paymentId) {
        return NextResponse.redirect(
            new URL(
                "/checkout?payment=bkash_missing_payment_id",
                getBaseUrl(request),
            ),
        );
    }

    try {
        await executePayment(paymentId);
        return NextResponse.redirect(
            new URL(
                `/checkout/success?payment_method=bkash&payment_id=${encodeURIComponent(paymentId)}`,
                getBaseUrl(request),
            ),
        );
    } catch (error) {
        console.error("Error executing bKash payment:", error);
        return NextResponse.redirect(
            new URL("/checkout?payment=bkash_failed", getBaseUrl(request)),
        );
    }
}

export async function GET(request: NextRequest) {
    return handleCallback(request);
}

export async function POST(request: NextRequest) {
    return handleCallback(request);
}
