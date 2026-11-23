import { describe, it, expect } from "vitest";
import { branchLocations, buildBranchGraph, branchId, BRAND_ORIGIN } from "./branchLocations";

describe("physical branch identity", () => {
  it.each(branchLocations)("gives $id its own entity even with shared contact details", branch => {
    const graph = buildBranchGraph(branch.path)["@graph"];
    const localNodes = graph.filter(node => node["@type"] === "LocalBusiness");
    expect(localNodes).toHaveLength(1);
    expect(localNodes[0]).toMatchObject({
      "@id": branchId(branch),
      url: `${BRAND_ORIGIN}${branch.path}`,
      telephone: "+1-250-542-3673",
      address: { streetAddress: branch.street, postalCode: branch.postalCode, addressCountry: "CA" },
      geo: branch.coordinates,
      parentOrganization: { "@id": `${BRAND_ORIGIN}/#organization` },
    });
    expect(graph.find(node => node["@type"] === "Organization")).not.toHaveProperty("address");
    expect(graph.find(node => node["@type"] === "WebPage")).toMatchObject({ mainEntity: { "@id": branchId(branch) } });
    expect(branch.title.length).toBeLessThan(60);
    expect(branch.description.length).toBeLessThan(155);
    expect(branch.faqs).toHaveLength(4);
  });
  it("keeps both locations distinct on shared site pages", () => {
    const nodes = buildBranchGraph("/")["@graph"].filter(node => node["@type"] === "LocalBusiness");
    expect(nodes).toHaveLength(2);
    expect(new Set(nodes.map(node => node["@id"])).size).toBe(2);
    expect(branchLocations[1].coordinates).toEqual({ latitude: 48.4136212, longitude: -123.3754353 });
    expect(JSON.stringify(nodes)).not.toContain('"DrivingSchool"');
  });
});
