import { Link } from "@tanstack/react-router";
import { contentTrail, type Collection } from "@/lib/navigation-meta";

export function Breadcrumbs({
  group,
  slug,
  name,
}: {
  group: Collection;
  slug: string;
  name: string;
}) {
  const trail = contentTrail(group, slug, name);
  return (
    <nav className="site-frame content-trail" aria-label="פירורי לחם">
      <ol>
        {trail.map((item, i) => (
          <li key={item.path}>
            {i > 0 && (
              <span className="crumb-divider" aria-hidden="true">
                ‹
              </span>
            )}
            {i === trail.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link to={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function MatchLink() {
  return (
    <Link className="p-btn p-btn-primary" to="/match">
      לשאלון ההכוונה
    </Link>
  );
}
export function MatchPrompt() {
  return (
    <aside className="match-prompt">
      <div>
        <h2 className="p-h3">איזה מסלול מתאים לכם?</h2>
        <p>ספרו כמה זמן יש לכם ומה תרצו לחוות, וקבלו כיוונים לטיול שלכם בנפאל.</p>
      </div>
      <MatchLink />
    </aside>
  );
}
