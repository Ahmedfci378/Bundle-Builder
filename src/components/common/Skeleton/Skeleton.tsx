/**
 * Loading placeholders shown while CatalogContext.status === 'loading'.
 * Pure markup, no props — one skeleton shape per real component shape below.
 */

export function ProductCardSkeleton() {
  return (
    <div className="card h-100" aria-hidden="true">
      <div className="placeholder-glow p-3">
        <div className="placeholder col-12" style={{ height: 140 }} />
      </div>
      <div className="card-body d-flex flex-column gap-2 pt-0 placeholder-glow">
        <span className="placeholder col-7" />
        <span className="placeholder col-10" />
        <span className="placeholder col-5" />
        <div className="d-flex justify-content-between mt-auto pt-2">
          <span className="placeholder col-4" />
          <span className="placeholder col-3" />
        </div>
      </div>
    </div>
  );
}

export function ReviewItemSkeleton() {
  return (
    <div className="d-flex align-items-center gap-3 py-2 placeholder-glow" aria-hidden="true">
      <span className="placeholder rounded" style={{ width: 40, height: 40 }} />
      <span className="placeholder col-5" />
      <span className="placeholder col-2 ms-auto" />
    </div>
  );
}
