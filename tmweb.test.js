const { clickElement, getText } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("qamid.tmweb.ru tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru/client/");
  });

  test("Booking of 1 ticket for tomorrow to the movie logan at 23.45", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      "section:nth-child(1) > div:nth-child(3) > ul > li"
    );
    await clickElement(page, "div:nth-child(3) > span:nth-child(1)");
    await clickElement(page, "button");
    const actualH2 = await getText(page, "h2");
    const actualPlace = await getText(page, "p:nth-child(2) > span");
    const actualTime = await getText(page, "p:nth-child(5) > span");
    expect(actualH2).toEqual("Вы выбрали билеты:");
    expect(actualPlace).toEqual("3/1");
    expect(actualTime).toEqual("23:45");
  });

  test("Booking 2 tickets the day after tomorrow at 14.00", async () => {
    await clickElement(page, "a:nth-child(3)");
    await clickElement(
      page,
      "section:nth-child(2) > div:nth-child(2) > ul > li > a"
    );
    await clickElement(
      page,
      "div:nth-child(3) > span.buying-scheme__chair.buying-scheme__chair_vip"
    );
    await clickElement(page, "div:nth-child(3) > span:nth-child(6)");
    await clickElement(page, "button");
    const actualH2 = await getText(page, "h2");
    const actualPlace = await getText(page, "p:nth-child(2) > span");
    const actualTime = await getText(page, "p:nth-child(5) > span");
    expect(actualH2).toEqual("Вы выбрали билеты:");
    expect(actualPlace).toEqual("3/5, 3/6");
    expect(actualTime).toEqual("14:00");
  });

  test("Booking an already booked seat", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      "section:nth-child(2) > div:nth-child(3) > ul > li > a"
    );
    await clickElement(page, "div:nth-child(1) > span:nth-child(7)");
    await clickElement(page, "button");
    await clickElement(page, "button");
    const actualH2 = await getText(page, "h2");
    expect(actualH2).toEqual("Электронный билет");

    await page.goto("http://qamid.tmweb.ru/client/");
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      "section:nth-child(2) > div:nth-child(3) > ul > li > a"
    );
    await clickElement(page, "div:nth-child(1) > span:nth-child(7)");
    await clickElement(page, "button");
    const isDisabled = (await page.$("button[disabled]")) !== null;
  });

  /*test("Should look for a course", async () => {
  await page.goto("https://netology.ru/navigation");
  await putText(page, "input", "тестировщик");
  const actual = await page.$eval("a[data-name]", (link) => link.textContent);
  const expected = "Тестировщик ПО";
  expect(actual).toContain(expected);
});

test("Should show warning if login is not email", async () => {
  await page.goto("https://netology.ru/?modal=sign_in");
  await putText(page, 'input[type="email"]', generateName(5));*/
});
