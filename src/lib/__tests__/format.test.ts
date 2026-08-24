import { describe, it, expect } from "vitest";
import { fcfa, fmtDate, fmtDateShort, abidjanTime, buildICS } from "../format";

describe("fcfa", () => {
  it("formats zero", () => {
    expect(fcfa(0)).toBe("0 F");
  });

  it("formats a small number with French spacing", () => {
    const result = fcfa(45000);
    expect(result).toBe("45 000 F");
  });

  it("formats a large number", () => {
    const result = fcfa(180000);
    expect(result).toBe("180 000 F");
  });

  it("formats one million", () => {
    const result = fcfa(1000000);
    expect(result).toBe("1 000 000 F");
  });
});

describe("fmtDate", () => {
  it("formats a date in French long format", () => {
    const result = fmtDate("2026-08-24");
    expect(result).toBe("lun. 24 août 2026");
  });

  it("formats January 1st", () => {
    const result = fmtDate("2026-01-01");
    expect(result).toBe("jeu. 1 janv. 2026");
  });

  it("formats a date in March", () => {
    const result = fmtDate("2026-03-15");
    expect(result).toBe("dim. 15 mars 2026");
  });

  it("formats a date in December", () => {
    const result = fmtDate("2026-12-25");
    expect(result).toBe("ven. 25 déc. 2026");
  });
});

describe("fmtDateShort", () => {
  it("formats a date in short French format", () => {
    const result = fmtDateShort("2026-08-24");
    expect(result).toBe("24 août");
  });

  it("formats January 1st", () => {
    const result = fmtDateShort("2026-01-01");
    expect(result).toBe("1 janv.");
  });

  it("formats June 15th", () => {
    const result = fmtDateShort("2026-06-15");
    expect(result).toBe("15 juin");
  });
});

describe("abidjanTime", () => {
  it("returns a time string in HH:MM:SS format", () => {
    const result = abidjanTime(new Date("2026-08-24T14:30:45Z"));
    // Abidjan is UTC+0, so 14:30:45 UTC = 14:30:45 Abidjan
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

describe("buildICS", () => {
  it("generates a valid ICS string with BEGIN/END VCALENDAR", () => {
    const ics = buildICS({
      title: "Séjour — Suite Limaniya Golf",
      from: "2026-08-24",
      to: "2026-08-27",
      ref: "AZL-2026-TEST01",
      location: "Résidence Limaniya Golf, Riviera 4, Abidjan",
      description: "Test ICS",
    });

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });

  it("includes the reference in UID and SUMMARY", () => {
    const ics = buildICS({
      title: "Séminaire",
      from: "2026-09-01",
      to: "2026-09-03",
      ref: "AZL-2026-ABC123",
      location: "Le Phare",
      description: "Plénière",
    });

    expect(ics).toContain("UID:AZL-2026-ABC123@limaniya-golf.ci");
    expect(ics).toContain("SUMMARY:Séminaire — AZL-2026-ABC123");
  });

  it("sets DTSTART and DTEND correctly", () => {
    const ics = buildICS({
      title: "Test",
      from: "2026-08-24",
      to: "2026-08-27",
      ref: "REF",
      location: "Loc",
      description: "Desc",
    });

    expect(ics).toContain("DTSTART:20260824T140000");
    expect(ics).toContain("DTEND:20260827T120000");
  });

  it("includes LOCATION and DESCRIPTION", () => {
    const ics = buildICS({
      title: "Title",
      from: "2026-01-01",
      to: "2026-01-02",
      ref: "R",
      location: "Riviera 4, Rue E40",
      description: "Réf R · 2 pers.",
    });

    expect(ics).toContain("LOCATION:Riviera 4, Rue E40");
    expect(ics).toContain("DESCRIPTION:Réf R · 2 pers.");
  });

  it("uses CRLF line endings", () => {
    const ics = buildICS({
      title: "T",
      from: "2026-01-01",
      to: "2026-01-02",
      ref: "R",
      location: "L",
      description: "D",
    });

    expect(ics).toContain("\r\n");
    // Every line should end with \r\n
    const lines = ics.split("\r\n");
    expect(lines.length).toBeGreaterThan(5);
  });
});
