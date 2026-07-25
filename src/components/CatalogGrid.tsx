import { catalog } from '#/lib/catalog'

function displayHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function CatalogGrid() {
  return (
    <div className="shelf">
      {catalog.map((co) => (
        <article key={co.id} className="cart">
          <div className={`cart-label ${co.color}`}>
            <span>{co.id}</span>
            <span>{co.years}</span>
          </div>
          <div className="cart-body">
            <h3>{co.name}</h3>
            <p>{co.description}</p>
            {co.url ? (
              <a
                className="cart-link"
                href={co.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {displayHost(co.url)} →
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
