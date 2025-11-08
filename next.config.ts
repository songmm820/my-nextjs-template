import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

/* This is the default configuration for the plugin. You can customize it as needed. */
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig);
