import type { ProductPricingTier } from "@/data/productTypes";

export type ServiceLocation = {
  id: string;
  name: string;
  address: string;
  description: string;
  pricingTier: ProductPricingTier;
};

export const serviceLocations: ServiceLocation[] = [
  {
    id: "sidney",
    name: "Sidney",
    address: "Sidney, BC",
    description: "Local lesson support for Sidney learners with practical coastal and town-route experience.",
    pricingTier: "standard",
  },
  {
    id: "victoria",
    name: "Victoria",
    address: "Victoria, BC",
    description: "Lessons available across Victoria with flexible scheduling for city routes and real-world traffic practice.",
    pricingTier: "standard",
  },
  {
    id: "colwood",
    name: "Colwood",
    address: "Colwood, BC",
    description: "Serving Colwood residents with convenient lesson pickups and local route practice.",
    pricingTier: "standard",
  },
  {
    id: "langford",
    name: "Langford",
    address: "Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1",
    description: "Our main office and primary training hub, centrally located in the Westshore area.",
    pricingTier: "standard",
  },
  {
    id: "metchosin",
    name: "Metchosin",
    address: "Metchosin, BC",
    description: "Calm rural roads ideal for building early driving confidence and fundamentals.",
    pricingTier: "regional",
  },
  {
    id: "sooke",
    name: "Sooke",
    address: "Sooke, BC",
    description: "Rural and highway driving practice for students in the Sooke region.",
    pricingTier: "regional",
  },
  {
    id: "duncan",
    name: "Duncan",
    address: "Duncan, BC",
    description: "Serving Duncan students with focused driving instruction and flexible pickup options.",
    pricingTier: "regional",
  },
  {
    id: "salt-spring-island",
    name: "Salt Spring Island",
    address: "Salt Spring Island, BC",
    description: "Driving lessons available for Salt Spring Island learners with personalized local guidance.",
    pricingTier: "island",
  },



];

export const serviceLocationsById = Object.fromEntries(serviceLocations.map((location) => [location.id, location])) as Record<
  string,
  ServiceLocation
>;

export const officeLocation = serviceLocations.find((location) => location.id === "langford") ?? serviceLocations[0];
export const publicServiceLocations = serviceLocations.filter((location) => location.id !== officeLocation.id);

