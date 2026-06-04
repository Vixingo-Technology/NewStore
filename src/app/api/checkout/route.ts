import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem, CheckoutRequestBody } from "@/types";
import { getDisplayPrice } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2025-08-27.basil",
});

const BKASH_BASE_URL =
    process.env.BKASH_BASE_URL || "https://checkout.sandbox.bka.sh/v1.2.0-beta";

type BkashTokenResponse = {
    id_token?: string;
    token?: string;
    access_token?: string;
};

type BkashCreatePaymentResponse = {
    bkashURL?: string;
    paymentURL?: string;
    redirectURL?: string;
    paymentID?: string;
    paymentId?: string;
    statusCode?: string;
    statusMessage?: string;
};

function getBaseUrl(request: NextRequest): string {
    return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
}

function getOrderAmount(items: CartItem[]): number {
    return items.reduce((total, item) => {
        return total + getDisplayPrice(item.product) * item.quantity;
    }, 0);
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

async function createBkashPayment(params: {
    amount: string;
    invoiceNumber: string;
    callbackUrl: string;
    customerEmail: string;
}) {
    const appKey = getRequiredEnv("BKASH_APP_KEY");
    const token = await getBkashToken();

    const response = await fetch(`${BKASH_BASE_URL}/checkout/payment/create`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: token,
            "X-APP-Key": appKey,
        },
        body: JSON.stringify({
            amount: params.amount,
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: params.invoiceNumber,
            callbackURL: params.callbackUrl,
            merchantAssociationInfo: params.customerEmail,
        }),
    });

    const data = (await response.json()) as BkashCreatePaymentResponse;

    if (!response.ok) {
        throw new Error(
            data.statusMessage || "Failed to create bKash payment session",
        );
    }

    const url = data.bkashURL || data.paymentURL || data.redirectURL;
    const paymentId = data.paymentID || data.paymentId;

    if (!url || !paymentId) {
        throw new Error("bKash payment response missing redirect details");
    }

    return { url, paymentId };
}

export async function POST(request: NextRequest) {
    try {
        const { items, customerEmail, paymentMethod }: CheckoutRequestBody =
            await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "No items in cart" },
                { status: 400 },
            );
        }

        const baseUrl = getBaseUrl(request);

        if (paymentMethod === "bkash") {
            const amount = getOrderAmount(items).toFixed(2);
            const invoiceNumber = `INV-${Date.now()}`;
            const callbackUrl = `${baseUrl}/api/bkash/execute-payment`;
            const bkashPayment = await createBkashPayment({
                amount,
                invoiceNumber,
                callbackUrl,
                customerEmail,
            });

            return NextResponse.json({
                url: bkashPayment.url,
                paymentId: bkashPayment.paymentId,
            });
        }

        // Create line items for Stripe
        const lineItems = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: `${item.product.title} (${item.size})`,
                    images: [item.product.images[0]],
                    description: item.product.description,
                },
                unit_amount: Math.round(getDisplayPrice(item.product) * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cart`,
            customer_email: customerEmail,
            metadata: {
                items: JSON.stringify(
                    items.map((item) => ({
                        id: item.id,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                ),
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 },
        );
    }
}
