/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARNING !!
    // Mengizinkan build produksi sukses meskipun
    // proyek Anda memiliki kesalahan TypeScript.
    // !! WARNING !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
