import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  buildCartItems,
  getCartItemKey,
  getCartItemCount,
  getCartPricingSummary,
  sanitizeCartEntries,
  type CartPricingSummary,
  type CartItemType,
  type CartEntry,
  type CartEntryCustomization,
} from "@/lib/cart";
import { officeLocation } from "@/data/serviceLocations";

type AddPackageInput = {
  packageId: string;
  locationId?: string;
  customization?: CartEntryCustomization;
};

type AddCourseInput = {
  courseId: string;
  locationId?: string;
  quantity?: number;
  customization?: CartEntryCustomization;
};

type AddExtraInput = {
  extraId: string;
  locationId?: string;
};

type CartContextValue = {
  entries: CartEntry[];
  items: ReturnType<typeof buildCartItems>;
  itemCount: number;
  pricingSummary: CartPricingSummary;
  subtotal: number;
  estimatedTaxes: number;
  total: number;
  addCourse: (input: AddCourseInput) => void;
  addExtra: (input: AddExtraInput) => void;
  addPackage: (input: AddPackageInput) => void;
  removeItem: (entryKey: string) => void;
  updateQuantity: (entryKey: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const readCartEntries = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return sanitizeCartEntries(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<CartEntry[]>(readCartEntries);

  const addEntry = useCallback(
    (
      itemType: CartItemType,
      productId: string,
      locationId = officeLocation.id,
      options?: {
        customization?: CartEntryCustomization;
        mode?: "increment" | "replace";
        quantity?: number;
      },
    ) => {
      const quantity =
        typeof options?.quantity === "number" && Number.isFinite(options.quantity)
          ? Math.max(1, Math.floor(options.quantity))
          : 1;
      const mode = options?.mode ?? "increment";

      setEntries((current) => {
        const existingIndex = current.findIndex(
          (entry) =>
            entry.itemType === itemType &&
            entry.productId === productId &&
            entry.locationId === locationId,
        );

        if (existingIndex === -1) {
          return [
            ...current,
            {
              itemType,
              productId,
              locationId,
              quantity,
              customization: options?.customization,
            },
          ];
        }

        return current.map((entry, index) =>
          index === existingIndex
            ? {
                ...entry,
                quantity: mode === "replace" ? quantity : entry.quantity + quantity,
                customization: mode === "replace" ? options?.customization : options?.customization ?? entry.customization,
              }
            : entry,
        );
      });
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (entries.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) {
        return;
      }

      setEntries(readCartEntries());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addPackage = useCallback(({ packageId, locationId = officeLocation.id, customization }: AddPackageInput) => {
    addEntry("package", packageId, locationId, {
      customization,
      mode: customization ? "replace" : "increment",
    });
  }, [addEntry]);

  const addCourse = useCallback(
    ({ courseId, locationId = officeLocation.id, quantity, customization }: AddCourseInput) => {
      addEntry("course", courseId, locationId, {
        customization,
        mode: quantity || customization ? "replace" : "increment",
        quantity,
      });
    },
    [addEntry],
  );

  const addExtra = useCallback(({ extraId, locationId = officeLocation.id }: AddExtraInput) => {
    addEntry("extra", extraId, locationId);
  }, [addEntry]);

  const removeItem = useCallback((entryKey: string) => {
    setEntries((current) =>
      current.filter((entry) => getCartItemKey(entry.itemType, entry.productId, entry.locationId) !== entryKey),
    );
  }, []);

  const updateQuantity = useCallback((entryKey: string, quantity: number) => {
    setEntries((current) => {
      if (quantity <= 0) {
        return current.filter(
          (entry) => getCartItemKey(entry.itemType, entry.productId, entry.locationId) !== entryKey,
        );
      }

      return current.map((entry) =>
        getCartItemKey(entry.itemType, entry.productId, entry.locationId) === entryKey
          ? { ...entry, quantity: Math.max(1, Math.floor(quantity)) }
          : entry,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setEntries([]);
  }, []);

  const items = useMemo(() => buildCartItems(entries), [entries]);
  const itemCount = useMemo(() => getCartItemCount(items), [items]);
  const pricingSummary = useMemo(() => getCartPricingSummary(items), [items]);
  const { subtotal, estimatedTaxes, total } = pricingSummary;

  const value = useMemo(
    () => ({
      entries,
      items,
      itemCount,
      pricingSummary,
      subtotal,
      estimatedTaxes,
      total,
      addCourse,
      addExtra,
      addPackage,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      addCourse,
      addExtra,
      addPackage,
      clearCart,
      entries,
      estimatedTaxes,
      itemCount,
      items,
      pricingSummary,
      removeItem,
      subtotal,
      total,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
};
