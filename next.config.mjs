/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first, WebP second, original last. A hero photograph is the
    // largest thing on the page and the one that decides LCP; AVIF is
    // typically 30-50% smaller than the WebP Next would otherwise serve,
    // which matters most on the phone connections this audience uses.
    formats: ["image/avif", "image/webp"],
    // Long cache: these files are content, not code, and are replaced by
    // name rather than edited in place.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};
export default nextConfig;
