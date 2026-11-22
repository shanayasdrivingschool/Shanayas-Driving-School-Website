import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { featuredGoogleReviews } from "@/data/googleReviews";
import PaidLandingPage from "./PaidLandingPage";
import { paidLandingPages } from "@/data/paidLandingPages";
import { submitFreeTrialLead } from "@/lib/leadService";
import { getCaptchaVerification } from "@/lib/captcha";

vi.mock("@/lib/leadService", () => ({ submitFreeTrialLead: vi.fn() }));
vi.mock("@/lib/captcha", () => ({ getCaptchaVerification: vi.fn() }));

const renderPage = (pageId: "road-test" | "beginner" = "road-test") => render(
  <MemoryRouter initialEntries={[paidLandingPages.find((page) => page.id === pageId)!.path]}>
    <PaidLandingPage pageId={pageId} />
  </MemoryRouter>,
);
const openForm = () => fireEvent.click(screen.getAllByRole("button", { name: "Request a Callback", exact: true })[0]);
const fillForm = () => {
  fireEvent.focus(screen.getByLabelText(/Full name/));
  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Test Learner" } });
  fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: "2505550123" } });
  fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: "learner@example.com" } });
  fireEvent.change(screen.getByLabelText(/Notes/), { target: { value: "My test is next month." } });
};
const conversions = () => window.dataLayer.filter((event: { event?: string }) => event.event === "lead_submit");

beforeEach(() => {
  vi.resetAllMocks();
  // jsdom has no layout observers; carousel gestures are checked in a real browser.
  const observer = class { observe() {} unobserve() {} disconnect() {} };
  vi.stubGlobal("IntersectionObserver", observer);
  vi.stubGlobal("ResizeObserver", observer);
  window.sessionStorage.clear();
  window.dataLayer = [];
  window.history.replaceState({}, "", "/?gclid=test-click&utm_campaign=test-campaign&adgroup=road-test");
  vi.mocked(getCaptchaVerification).mockResolvedValue({ provider: null, token: null, action: null });
  vi.mocked(submitFreeTrialLead).mockResolvedValue(undefined);
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("paid landing callbacks", () => {
  it.each(paidLandingPages)("keeps the landing-page structure and intent-specific pricing on $id", (config) => {
    const view = render(<MemoryRouter initialEntries={[config.path]}><PaidLandingPage pageId={config.id} /></MemoryRouter>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(config.hero.h1);
    expect(view.container.querySelectorAll("main > section")).toHaveLength(8);
    expect(view.container.querySelector("footer")).toBeTruthy();
    expect(screen.getAllByRole("figure")).toHaveLength(featuredGoogleReviews.length);
    expect(screen.getByRole("button", { name: "Next reviews" })).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: config.pricingHeading })).toBeInTheDocument();
    expect(view.container.querySelectorAll("#pricing-heading")).toHaveLength(1);
    openForm();
    const dialog = screen.getByRole("dialog", { name: "Request a Callback" });
    expect(dialog.querySelectorAll("input[required]")).toHaveLength(3);
    expect(within(dialog).getByLabelText(/Notes/)).not.toBeRequired();
    expect(screen.queryByLabelText(/Preferred callback time/)).not.toBeInTheDocument();
  });

  it("stores email, optional notes and attribution, and counts only a stored lead", async () => {
    let resolveLead!: () => void;
    vi.mocked(submitFreeTrialLead).mockReturnValue(new Promise<void>((resolve) => { resolveLead = resolve; }));
    renderPage();
    openForm();
    fillForm();
    const form = screen.getByRole("form", { name: "Request a callback" });
    fireEvent.submit(form);
    fireEvent.submit(form);
    await waitFor(() => expect(submitFreeTrialLead).toHaveBeenCalledTimes(1));
    expect(conversions()).toHaveLength(0);
    expect(submitFreeTrialLead).toHaveBeenCalledWith(expect.objectContaining({
      fullName: "Test Learner", phone: "2505550123", email: "learner@example.com", goal: "road-test", intent: "lesson_plan_request",
      note: "Free callback requested. Notes: My test is next month.",
      marketingConsent: false,
      attribution: expect.objectContaining({ gclid: "test-click", utmCampaign: "test-campaign", adGroup: "road-test", landingPageId: "road-test" }),
    }));
    await act(async () => resolveLead());
    expect(within(screen.getByRole("dialog")).getByRole("status")).toHaveTextContent("You’ll receive a call shortly");
    expect(conversions()).toHaveLength(1);
    expect(window.dataLayer.filter((event: { event?: string }) => event.event === "form_start")).toHaveLength(1);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(within(within(screen.getByRole("dialog")).getByRole("status")).getByRole("link", { name: /Call/ })).toHaveAttribute("href", "tel:+12505423673");
    expect(conversions()[0]).toMatchObject({ lead_email_provided: true });
    fireEvent.click(screen.getByRole("button", { name: "Close", exact: true }));
    openForm();
    expect(within(screen.getByRole("dialog")).getByRole("status")).toHaveTextContent("You’ll receive a call shortly");
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("retains form progress on CTA clicks and failed requests, and reuses the lead ID on retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(submitFreeTrialLead).mockRejectedValueOnce(new Error("offline"));
    renderPage();
    openForm();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Close", exact: true }));
    fireEvent.click(screen.getAllByRole("button", { name: "Check Availability" })[0]);
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Test Learner");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not send your request");
    expect(conversions()).toHaveLength(0);
    expect(screen.getByLabelText(/Notes/)).toHaveValue("My test is next month.");
    expect(screen.getByLabelText(/Email address/)).toHaveValue("learner@example.com");
    const firstId = vi.mocked(submitFreeTrialLead).mock.calls[0][0].leadId;
    fireEvent.submit(screen.getByRole("form"));
    await within(screen.getByRole("dialog")).findByRole("status");
    expect(vi.mocked(submitFreeTrialLead).mock.calls[1][0].leadId).toBe(firstId);
    expect(conversions()).toHaveLength(1);
  });

  it("does not submit invalid contact details or count captcha failures as conversions", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderPage();
    openForm();
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("form"));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your full name");
    expect(submitFreeTrialLead).not.toHaveBeenCalled();
    fillForm();
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: "invalid" } });
    fireEvent.submit(screen.getByRole("form"));
    expect(screen.getByRole("alert")).toHaveTextContent("valid email address");
    expect(submitFreeTrialLead).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: "learner@example.com" } });
    vi.mocked(getCaptchaVerification).mockRejectedValueOnce(new Error("captcha unavailable"));
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("We could not send"));
    expect(submitFreeTrialLead).not.toHaveBeenCalled();
    expect(conversions()).toHaveLength(0);
  });

  it("accepts an enquiry without notes", async () => {
    renderPage();
    openForm();
    fillForm();
    fireEvent.change(screen.getByLabelText(/Notes/), { target: { value: "" } });
    fireEvent.submit(screen.getByRole("form"));
    await within(screen.getByRole("dialog")).findByRole("status");
    expect(submitFreeTrialLead).toHaveBeenCalledWith(expect.objectContaining({
      email: "learner@example.com", note: "Free callback requested.",
    }));
  });

  it("shows the correct road-test options and tracks calls separately", () => {
    const { container } = renderPage();
    const cards = [...container.querySelectorAll("article")];
    expect(cards).toHaveLength(3);
    expect(within(cards[0]).getByText("$133.50")).toBeInTheDocument();
    expect(within(cards[1]).getByText("$120")).toBeInTheDocument();
    expect(within(cards[1]).getByText(/\$150 CAD.*90 minutes/)).toBeInTheDocument();
    expect(within(cards[2]).getByText("$250")).toBeInTheDocument();
    expect(within(cards[2]).getByText(/Optional 60-minute practice lessons: \$89/)).toBeInTheDocument();
    const callLink = screen.getAllByRole("link", { name: /Call \(250\)/ })[0];
    callLink.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(callLink);
    expect(window.dataLayer.filter((event: { event?: string }) => event.event === "click_to_call")).toHaveLength(1);
    expect(conversions()).toHaveLength(0);
  });
});
