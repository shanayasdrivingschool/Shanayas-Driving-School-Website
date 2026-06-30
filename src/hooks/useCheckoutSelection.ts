import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/components/cart/CartProvider";
import { packageCatalog } from "@/data/packageCatalog";
import { officeLocation } from "@/data/serviceLocations";
import { clearCheckoutPaymentSession } from "@/lib/checkoutPaymentSession";
import {
  buildCartItems,
  getCartPricingSummary,
  sanitizeCartEntryCustomization,
} from "@/lib/cart";
import { buildCustomClassCustomization, readCustomClassPlan } from "@/lib/customClassPlan";
import type { LessonDurationMinutes } from "@/data/productTypes";

const CUSTOM_CLASS_COURSE_ID = "make-your-own-class";

const parseSelectionQuantity = (value: string | null) => {
  const quantity = value ? Number(value) : 1;
  return Number.isFinite(quantity) && quantity > 0 ? Math.min(20, Math.max(1, Math.floor(quantity))) : 1;
};

const parseLessonDuration = (value: string | null): LessonDurationMinutes | undefined => {
  const duration = value ? Number(value) : Number.NaN;
  return duration === 60 || duration === 90 ? duration : undefined;
};

export const useCheckoutSelection = () => {
  const { items: cartItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const packageId = searchParams.get("package")?.trim() ?? "";
  const courseId = searchParams.get("course")?.trim() ?? "";
  const invoiceToken = searchParams.get("invoice")?.trim() ?? "";
  const locationId = searchParams.get("location")?.trim() ?? officeLocation.id;
  const quantity = parseSelectionQuantity(searchParams.get("quantity"));
  const lessonDurationMinutes = parseLessonDuration(searchParams.get("duration"));
  const querySuffix = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const directSelectionItems = useMemo(
    () => {
      if (invoiceToken) {
        return [];
      }

      if (packageId) {
        return buildCartItems([
          {
            itemType: "package",
            productId: packageId,
            locationId,
            quantity: 1,
            customization: sanitizeCartEntryCustomization({ lessonDurationMinutes }),
          },
        ]);
      }

      if (!courseId) {
        return [];
      }

      const customClassPlan =
        courseId === CUSTOM_CLASS_COURSE_ID ? readCustomClassPlan(courseId, locationId) : null;
      const selectedQuantity = courseId === CUSTOM_CLASS_COURSE_ID ? quantity : 1;
      const customClassCustomization =
        customClassPlan && customClassPlan.quantity === selectedQuantity
          ? buildCustomClassCustomization(
              customClassPlan.learningObjective,
              lessonDurationMinutes ?? customClassPlan.lessonDurationMinutes,
            )
          : undefined;
      const courseCustomization =
        courseId === CUSTOM_CLASS_COURSE_ID
          ? customClassCustomization
          : sanitizeCartEntryCustomization({ lessonDurationMinutes });

      return buildCartItems([
        {
          itemType: "course",
          productId: courseId,
          locationId,
          quantity: selectedQuantity,
          customization: courseCustomization,
        },
      ]);
    },
    [courseId, invoiceToken, lessonDurationMinutes, locationId, packageId, quantity],
  );

  const isUsingDirectSelection = directSelectionItems.length > 0;
  const activeItems = isUsingDirectSelection ? directSelectionItems : cartItems;
  const activePrimaryItem = activeItems[0];
  const heroImage = activePrimaryItem?.image ?? packageCatalog[0]?.image;
  const pricingSummary = useMemo(() => getCartPricingSummary(activeItems), [activeItems]);
  const { subtotal, estimatedTaxes, total } = pricingSummary;
  const summaryHeading =
    activeItems.length === 1 ? activeItems[0].title : `${activeItems.length} items in your order`;

  const goToCart = () => {
    clearCheckoutPaymentSession();
    navigate("/cart");
  };

  const removeSummaryItem = (itemKey: string) => {
    if (isUsingDirectSelection) {
      return;
    }

    clearCheckoutPaymentSession();
    removeItem(itemKey);
  };

  const updateSummaryQuantity = (itemKey: string, quantity: number) => {
    if (isUsingDirectSelection) {
      return;
    }

    clearCheckoutPaymentSession();
    updateQuantity(itemKey, quantity);
  };

  return {
    activeItems,
    activePrimaryItem,
    estimatedTaxes,
    heroImage,
    isUsingDirectSelection,
    locationId,
    pricingSummary,
    goToCart,
    courseId,
    invoiceToken,
    packageId,
    querySuffix,
    removeSummaryItem,
    subtotal,
    summaryHeading,
    total,
    updateSummaryQuantity,
  };
};
