import type { Job } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import { chromium, type Page } from "playwright";

const TOKEN = process.env.BROWSERLESS_TOKEN;

export async function scrapeGlints(query: string) {
  const browser = await chromium.connect(
    `wss://production-sfo.browserless.io/chromium/playwright?token=${TOKEN}`,
  );

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    await page.goto(
      `https://glints.com/id/opportunities/jobs/explore?keyword=${query}&country=ID&locationName=All+Cities%2FProvinces`,
      {
        waitUntil: "networkidle",
      },
    );

    // Scroll to trigger lazy loading
    await autoScroll(page);

    // Wait longer for job cards
    await page.waitForSelector("div[aria-label^='Job:']", { timeout: 15000 });

    // Scrape jobs
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll("div[aria-label^='Job:']");
      const result: Job[] = [];

      jobCards.forEach((card) => {
        // Ensure `card` is properly typed
        const element = card as HTMLElement;

        const title = element.querySelector("h2")?.textContent?.trim() ?? "";

        const compSpan = element.querySelector(
          "span[data-cy='company_name_job_card']",
        );

        const compText = compSpan?.textContent?.trim() ?? "";

        let company = "";
        let location = "";

        // Use exec() to extract with parentheses first
        const parenRegex = /^(.+\))(.+)$/;
        const parenMatch = parenRegex.exec(compText);

        if (parenMatch?.[1] && parenMatch?.[2]) {
          company = parenMatch[1].trim();
          location = parenMatch[2].trim();
        } else {
          // Fallback: lowercase-uppercase transition
          const fallbackRegex = /^(.*?[a-z])([A-Z].*)$/;
          const fallbackMatch = fallbackRegex.exec(compText);

          if (fallbackMatch?.[1] && fallbackMatch?.[2]) {
            company = fallbackMatch[1].trim();
            location = fallbackMatch[2].trim();
          } else {
            company = compText;
            location = "";
          }
        }

        const tagElements = element.querySelectorAll(
          ".TagStyle__TagContentWrapper-sc-r1wv7a-1",
        );

        const tags: string[] = Array.from(tagElements)
          .map((el) => el.textContent?.trim() ?? "")
          .filter((text) => text && text !== "Perusahaan Premium")
          .slice(0, 3);

        const anchor = element.querySelector("a");
        const linkPath = anchor?.getAttribute("href") ?? "";
        const link = linkPath.startsWith("http")
          ? linkPath
          : `https://glints.com${linkPath}`;

        const textContent = element.innerText ?? "";
        const salaryLine = textContent
          .split("\n")
          .find((line) => line.trim().startsWith("Rp"));

        const salary = salaryLine?.trim() ?? "Not specified";

        if (title && company) {
          result.push({
            title,
            company,
            location,
            salary,
            tags,
            link,
          });
        }
      });

      return result.slice(0, 8);
    });

    return jobs;

    // Helper to scroll and load more content
    async function autoScroll(page: Page) {
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 500;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve(null);
            }
          }, 300);
        });
      });
    }
  } finally {
    await browser.close();
  }
}
