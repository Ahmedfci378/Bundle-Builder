import { AccordionItem } from '../accordion/AccordionItem';
import { ProductCardContainer } from '../product/ProductCardContainer';
import { ProductCardSkeleton } from '../common/Skeleton/Skeleton';
import { Button } from '../common/Button/Button';
import { useAccordionSection } from '../../hooks/useAccordionSection';
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation';
import type { Category, Product } from '../../types/catalog.types';

export interface CategoryAccordionSectionProps {
  category: Category;
  products: Product[];
  stepNumber: number;
  totalSteps: number;
  isLoading?: boolean;
}

/**
 * Wires one catalog category to the Accordion UI. All the "how many are
 * selected," "is this step satisfied," and "what's next" logic comes from
 * hooks — this component only arranges what they return into markup.
 */
export function CategoryAccordionSection({
  category,
  products,
  stepNumber,
  totalSteps,
  isLoading = false,
}: CategoryAccordionSectionProps) {
  const { isExpanded, progress, toggle } = useAccordionSection(category.id);
  const { getNextCategory, goToNext } = useCategoryNavigation();

  const nextCategory = getNextCategory(category.id);
  const productIds = products.map(p => p.id);

  // The Cameras section alone follows the reference mockup's horizontal
  // card design; every other category keeps its original vertical tile.
  const isCameraSection = category.slug === 'cameras';
  const cameraColumnClass = 'col-12 col-md-6';
  const defaultColumnClass = 'col-12 col-md-6 col-xl-4';

  return (
    <AccordionItem
      id={category.id}
      title={category.name}
      icon={category.icon}
      eyebrow={`Step ${stepNumber} of ${totalSteps}`}
      meta={progress.selectedQuantity > 0 ? `${progress.selectedQuantity} selected` : undefined}
      isOpen={isExpanded}
      onToggle={toggle}
    >
      {category.description && <p className="text-body-secondary small mb-3">{category.description}</p>}

<div
  className={`row ${
    isCameraSection
      ? 'g-3 g-lg-4 row-cols-1 row-cols-md-2 row-cols-xxl-5'
      : 'g-3'
  }`}
>

        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div className={isCameraSection ? cameraColumnClass : defaultColumnClass} key={i}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, index) => {
              // With an odd product count, the last card in the Cameras
              // grid centers itself in its own row (2 / 2 / 1 centered),
              // matching the reference mockup — pure Bootstrap utilities,
              // no layout math required for any other category or count.
              const isLastOdd = index === products.length - 1 && products.length % 2 === 1;
              const columnClass = isCameraSection
                ? `${cameraColumnClass}${isLastOdd ? ' mx-md-auto' : ''}`
                : defaultColumnClass;

              return (
                <div className={columnClass} key={product.id}>
                  <ProductCardContainer
                    product={product}
                    selectionMode={category.selectionMode}
                    siblingProductIds={productIds.filter(id => id !== product.id)}
                    layout={isCameraSection ? 'camera' : 'default'}
                  />
                </div>
              );
            })}
      </div>


      {nextCategory && (
         <div className="d-flex justify-content-center mt-3">
     <Button variant="outline" onClick={() => goToNext(category.id)}>
       Next: {nextCategory.name}
     </Button>
   </div>
      )}
    </AccordionItem>
  );
}
