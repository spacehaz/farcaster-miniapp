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
    appId: "0x0f2f2d881788da125748552385af4677604717b4bfbe5f20504bc842aa8e1e1d",
    mode: "dev",
    redirectUrl: getRedirectUrl(platform),
  });
}
