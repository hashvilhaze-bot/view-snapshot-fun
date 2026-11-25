import panoramaSmall from "@/assets/pilot/pokhara-hills-3-480.webp.asset.json";
import panoramaLarge from "@/assets/pilot/pokhara-hills-3-960.webp.asset.json";
import villageSmall from "@/assets/pilot/villages-2-480.webp.asset.json";
import villageLarge from "@/assets/pilot/villages-2-960.webp.asset.json";
import cultureSmall from "@/assets/pilot/kathmandu-3-480.webp.asset.json";
import cultureLarge from "@/assets/pilot/kathmandu-3-960.webp.asset.json";
import trailSmall from "@/assets/pilot/villages-3-480.webp.asset.json";
import trailLarge from "@/assets/pilot/villages-3-960.webp.asset.json";
import { galleries } from "@/lib/galleries";
export const homePhotos = [
  { photo: galleries["pokhara-hills"]?.[2], small: panoramaSmall.url, large: panoramaLarge.url },
  { photo: galleries["villages"]?.[1], small: villageSmall.url, large: villageLarge.url },
  { photo: galleries["kathmandu"]?.[2], small: cultureSmall.url, large: cultureLarge.url },
  { photo: galleries["villages"]?.[2], small: trailSmall.url, large: trailLarge.url },
].flatMap(({ photo, small, large }) =>
  photo ? [{ ...photo, src: large, srcSet: `${small} 480w, ${large} 960w` }] : [],
);
