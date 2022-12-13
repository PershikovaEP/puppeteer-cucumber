const { clickElement, getText } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

let choiceOfDate = function (day) {
  const dateTomorrow = new Date().setDate(new Date().getDate() + day);
  const dateFormat = new Date(dateTomorrow);
  return (
    dateFormat.getDate() +
    "-" +
    (dateFormat.getMonth() + 1) +
    "-" +
    dateFormat.getFullYear()
  );
};

describe("qamid.tmweb.ru tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru/client/");
  });

  test("Booking of 1 ticket to the movie logan for tomorrow at 23.45", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      "section:nth-child(1) > div:nth-child(3) > ul > li"
    );
    await clickElement(page, "div:nth-child(3) > span:nth-child(1)");
    await clickElement(page, "button");
    const actualH2 = await getText(page, "h2");
    const actualDate = await getText(page, "p:nth-child(4) > span");
    const actualPlace = await getText(page, "p:nth-child(2) > span");
    const actualTime = await getText(page, "p:nth-child(5) > span");
    expect(actualH2).toEqual("Вы выбрали билеты:");
    expect(actualDate).toEqual(choiceOfDate(1));
    expect(actualPlace).toEqual("3/1");
    expect(actualTime).toEqual("23:45");
  });

  test("Booking 2 tickets to the Movie 3 the day after tomorrow at 14.00", async () => {
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
    const actualDate = await getText(page, "p:nth-child(4) > span");
    const actualPlace = await getText(page, "p:nth-child(2) > span");
    const actualTime = await getText(page, "p:nth-child(5) > span");
    expect(actualH2).toEqual("Вы выбрали билеты:");
    expect(actualDate).toEqual(choiceOfDate(2));
    expect(actualPlace).toEqual("3/5, 3/6");
    expect(actualTime).toEqual("14:00");
  });

  test("Booking an already booked seat", async () => {
    //сначала бронируем место, потом пробуем еще раз это же место забронировать
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      "section:nth-child(2) > div:nth-child(3) > ul > li > a"
    );
    await clickElement(page, "div:nth-child(1) > span:nth-child(4)");
    await clickElement(page, "button");
    await clickElement(page, "button");

    await page.goto("http://qamid.tmweb.ru/client/");
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      "section:nth-child(2) > div:nth-child(3) > ul > li > a"
    );
    await clickElement(page, "div:nth-child(1) > span:nth-child(4)");
    await clickElement(page, "button");
    //(await page.$("button[disabled]")) === true; //проверка expect
    const actual = await getText(page, "h2");
    const actualSeat = await page.$eval(
      "div:nth-child(1) > span:nth-child(4)",
      (link) => link.getAttribute("class")
    );
    const actualButton = await page.$eval("button", (link) =>
      link.getAttribute("disabled")
    );
    expect(actual).toEqual("Фильм 3");
    expect(actualSeat).toContain("buying-scheme__chair_taken");
    expect(actualButton).toBeTruthy();
  });
});
