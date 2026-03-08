import { BringID } from "bringid";

export const FARCASTER_REDIRECT_URL = "https://farcaster.xyz/miniapps/1NIui4yTg5jf/bringid";
export const COINBASE_REDIRECT_URL = "https://base.app/app/farcaster-miniapp-pi.vercel.app";
const DEFAULT_REDIRECT_URL = "https://farcaster-miniapp-pi.vercel.app";

export function getRedirectUrl(platform: 'farcaster' | 'base' | 'unknown' | null): string {
  if (platform === 'farcaster') return FARCASTER_REDIRECT_URL;
  if (platform === 'base') return COINBASE_REDIRECT_URL;
  return DEFAULT_REDIRECT_URL;
}

export function createBringID(platform: 'farcaster' | 'base' | 'unknown' | null) {
  return new BringID({
    appId: "0xf1b103f0b98bd5efcf2ff247b26ed9c7248e3a61cdc50f60ec19114ef21aa6f8",
    mode: "dev",
    redirectUrl: getRedirectUrl(platform),
  });
}
