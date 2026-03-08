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
    appId: "0xb40616be97ea14752972587757eed5c4b82a1c0a9be016f14fd492b78891a827",
    mode: "dev",
    redirectUrl: getRedirectUrl(platform),
  });
}
