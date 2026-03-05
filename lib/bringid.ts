import { BringID } from "bringid";

const FARCASTER_REDIRECT_URL = "https://farcaster.xyz/miniapps/1NIui4yTg5jf/bringid";
const DEFAULT_REDIRECT_URL = "https://farcaster-miniapp-pi.vercel.app";

export function createBringID(isFarcaster: boolean) {
  return new BringID({
    appId: "0xa89cce22e034c0d7b00e91ad59dee7ffc41367a957fe39eb0d98ea7233387584",
    mode: "dev",
    redirectUrl: isFarcaster ? FARCASTER_REDIRECT_URL : DEFAULT_REDIRECT_URL,
  });
}
