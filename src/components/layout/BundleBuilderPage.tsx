import { useCatalog } from '../../context/catalog/useCatalog';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BREAKPOINTS } from '../../utils/breakpoints';
import { Accordion } from '../accordion/Accordion';
import { CategoryAccordionSection } from '../category/CategoryAccordionSection';
import { ReviewPanelContainer } from '../review/ReviewPanelContainer';

/**
 * The page's own two grid slots (accordion / review) already use plain
 * Bootstrap col-lg-* classes below — that part is pure CSS, no JS needed.
 * The one thing CSS alone can't express is telling the Review Panel to
 * render its INTERNAL contents differently depending on which of those two
 * slots it landed in (a full, narrow sidebar vs. a full-width block) — so
 * that one decision is made here, once, and passed down as a `layout` prop.
 */
export function BundleBuilderPage() {
  const catalog = useCatalog();
  const isSidebarLayout = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);

  if (catalog.status === 'error') {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Couldn't load the product catalog{catalog.error ? `: ${catalog.error}` : '.'} Please refresh the page.
        </div>
      </div>
    );
  }

  const isLoading = catalog.status === 'idle' || catalog.status === 'loading';
  const categories = catalog.data ? [...catalog.data.categories].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="container py-3 py-md-4">
      <h1 className="h3 fw-bold mb-3 mb-md-4"></h1>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <Accordion ariaLabel="Build your security system">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border-bottom py-3 placeholder-glow">
                    <span className="placeholder col-4" />
                  </div>
                ))
              : categories.map((category, index) => (
                  <CategoryAccordionSection
                    key={category.id}
                    category={category}
                    products={catalog.data!.products.filter(p => p.categoryId === category.id)}
                    stepNumber={index + 1}
                    totalSteps={categories.length}
                  />
                ))}
          </Accordion>
        </div>

        <div className="col-12 col-lg-4">
          {!isLoading && <ReviewPanelContainer layout={isSidebarLayout ? 'sidebar' : 'stacked'} />}
        </div>
      </div>
    </div>
  );
}
