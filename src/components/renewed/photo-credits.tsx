import { journalPhotos } from "@/lib/journal/photos";

export function PhotoCredits() {
  return (
    <details className="p-photo-credits">
      <summary>קרדיטים לצילומים</summary>
      <ul>
        {Object.values(journalPhotos).map((photo) => (
          <li key={photo.src}>
            <a href={photo.source}>{photo.name}</a> של <bdi>{photo.author}</bdi>
            {" · "}
            <a href={photo.licenseUrl}>
              <bdi>{photo.license}</bdi>
            </a>
          </li>
        ))}
      </ul>
      <p>הצילומים הותאמו בגודל ובחיתוך לתצוגה באתר.</p>
    </details>
  );
}
