import { heroPhotos } from "@/lib/home-hero-photos";

export function PhotoCredits() {
  return (
    <details className="p-photo-credits">
      <summary>קרדיטים לצילומי הפתיחה</summary>
      <ul>
        {heroPhotos.map((photo) => (
          <li key={photo.src}>
            <a href={photo.source}>{photo.name}</a> של <bdi>{photo.author}</bdi>
            {" · "}<a href={photo.licenseUrl}><bdi>{photo.license}</bdi></a>
          </li>
        ))}
      </ul>
      <p>הצילומים הותאמו בגודל ובחיתוך לתצוגה באתר.</p>
    </details>
  );
}
