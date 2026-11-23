import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BranchBookingForm from "./BranchBookingForm";
import { branchLocations } from "@/data/branchLocations";
const submit = vi.hoisted(() => vi.fn());
vi.mock("@/lib/captcha", () => ({ getCaptchaVerification: vi.fn(async () => ({})) }));
vi.mock("@/lib/leadService", () => ({ submitFreeTrialLead: submit }));
afterEach(cleanup);
beforeEach(() => { submit.mockReset(); });
const fill = () => {
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Test Learner" } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "2505550123" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Pickup neighbourhood"), { target: { value: "James Bay" } });
};
describe("branch booking request", () => {
  it("sends the selected branch and source URL without implying a confirmed lesson", async () => {
    submit.mockResolvedValue(undefined);
    render(<MemoryRouter><BranchBookingForm branch={branchLocations[1]} /></MemoryRouter>);
    fill();
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("not booked until confirmed"));
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ intent: "lesson_booking", sourcePage: "/locations/victoria-james-bay/", serviceArea: "Victoria", marketingConsent: false, note: expect.stringContaining("Victoria Campus (James Bay)") }));
  });
  it("keeps entered details available after a failed submission", async () => {
    submit.mockRejectedValue(new Error("Unavailable"));
    render(<MemoryRouter><BranchBookingForm branch={branchLocations[0]} /></MemoryRouter>);
    fill();
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("could not be sent"));
    expect(screen.getByLabelText("Full name")).toHaveValue("Test Learner");
    expect(screen.getByRole("button", { name: "Send booking request" })).toBeEnabled();
  });
});
