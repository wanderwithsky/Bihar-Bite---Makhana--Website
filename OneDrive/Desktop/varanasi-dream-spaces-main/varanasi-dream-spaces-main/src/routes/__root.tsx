import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Best Interior Designer in Varanasi | Build My Interior" },
      { name: "description", content: "Looking for the best interior designer in Varanasi? Build My Interior specializes in modular kitchens, luxury home interiors, commercial interiors, wardrobe design, and turnkey interior solutions." },
      { name: "author", content: "Build My Interior" },
      { name: "keywords", content: "Interior Designer in Varanasi, Best Interior Designer, Modular Kitchen Varanasi, Kitchen Designer, Home Interior, Commercial Interior, Luxury Interior Design" },
      { property: "og:site_name", content: "Build My Interior" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Best Interior Designer in Varanasi | Build My Interior" },
      { name: "twitter:title", content: "Best Interior Designer in Varanasi | Build My Interior" },
      { property: "og:description", content: "Looking for the best interior designer in Varanasi? Build My Interior specializes in modular kitchens, luxury home interiors, commercial interiors, wardrobe design, and turnkey interior solutions." },
      { name: "twitter:description", content: "Looking for the best interior designer in Varanasi? Build My Interior specializes in modular kitchens, luxury home interiors, commercial interiors, wardrobe design, and turnkey interior solutions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d852b02e-19a5-4fcb-9f9b-5d92ddabd350/id-preview-a7041dff--cbbfd4ed-d616-405b-a52a-833c8bb054c5.lovable.app-1782541663383.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d852b02e-19a5-4fcb-9f9b-5d92ddabd350/id-preview-a7041dff--cbbfd4ed-d616-405b-a52a-833c8bb054c5.lovable.app-1782541663383.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Poppins:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Build My Interior",
          image: "/og-image.jpg",
          telephone: "+91 7309754967",
          address: {
            "@type": "PostalAddress",
            streetAddress: "4th Floor, Nate Patel Nagar, Nadesar",
            addressLocality: "Varanasi",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
          openingHours: "Mo-Su 10:00-19:00",
          priceRange: "₹₹",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "31" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
