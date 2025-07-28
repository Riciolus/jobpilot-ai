import puppeteer, { type Page } from "puppeteer";

interface JobPosting {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  link: string;
}

export async function scrapeGlints() {
  const browser = await puppeteer.launch({ headless: true }); // Watch it work

  try {
    const page = await browser.newPage();

    // Set user-agent to look human
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    );

    const query = "frontend+developer";
    // Go to Glints
    await page.goto(
      `https://glints.com/id/opportunities/jobs/explore?keyword=${query}&country=ID&locationName=All+Cities%2FProvinces&lowestLocationLevel=1`,
      {
        waitUntil: "networkidle2",
      },
    );

    // Scroll to trigger lazy loading
    await autoScroll(page);

    // Wait longer for job cards
    await page.waitForSelector("div[aria-label^='Job:']", { timeout: 15000 });

    // Scrape jobs
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll("div[aria-label^='Job:']");
      const result: JobPosting[] = [];

      jobCards.forEach((card) => {
        // Ensure `card` is properly typed
        const element = card as HTMLElement;

        const title = element.querySelector("h2")?.textContent?.trim() ?? "";

        const compSpan = element.querySelector(
          "span[data-cy='company_name_job_card']",
        );
        const compText = compSpan?.textContent?.trim() ?? "";

        const [company, ...locationParts] = compText.split("\n");
        const location = locationParts.join(", ").trim();

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
        const salaryMatch = textContent.match(/Rp\s?[0-9.\s\-a-zA-Z]+/g);
        const salary = salaryMatch ? salaryMatch[0].trim() : "Not specified";

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

      return result.slice(0, 9);
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
