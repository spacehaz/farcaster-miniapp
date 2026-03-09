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
    appId: "0x1a5493681e47c12c01a9765ecc9fbd629039c18ff2788dadd07b64adc2cc9041",
    mode: "dev",
    redirectUrl: getRedirectUrl(platform),
  });
}
