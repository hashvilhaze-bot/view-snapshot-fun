import village from '@/assets/pilot/nepal-ghandruk-daylight.webp.asset.json';
import lake from '@/assets/pilot/nepal-phewa-daylight.webp.asset.json';
import mountain from '@/assets/pilot/nepal-annapurna-daylight.webp.asset.json';

// Licensed photographs from Wikimedia Commons; display the attribution beside the controls.
export const heroPhotos = [
  { src: village.url, name: 'גנדרוק והרי אנאפורנה', alt: 'הרי אנאפורנה המושלגים בשמש מעל בתי הכפר גנדרוק בנפאל', author: 'Bijaya2043', source: 'https://commons.wikimedia.org/wiki/File:Ghandruk_(1).JPG', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', position: 'village' },
  { src: lake.url, name: 'אגם פווה בפוקרה', alt: 'סירות צבעוניות באגם פווה בפוקרה באור יום, מול מדרונות ירוקים', author: 'Sushan116', source: 'https://commons.wikimedia.org/wiki/File:Beautiful_Day_at_Phewa_Lake_08.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', position: 'lake' },
  { src: mountain.url, name: 'אנאפורנה באור יום', alt: 'פסגת אנאפורנה המוארת ושביל מושלג עם מטיילים בנפאל', author: 'Sthasourik', source: 'https://commons.wikimedia.org/wiki/File:Mount_Annapurna_1.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', position: 'mountain' },
] as const;