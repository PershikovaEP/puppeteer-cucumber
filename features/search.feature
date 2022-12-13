Feature: qamid.tmweb.ru tests
    Scenario: Booking of 1 ticket to the movie Logan for tomorrow at 23:45
        Given user selects movie for "tomorrow" at "23:45"
        When user books one ticket at seat "3/1"
        Then user has booked the next tickets: seat "3/1" at "23:45"

    Scenario: Booking of 1 ticket to the Movie 3 the day after tomorrow at 14:00
        Given user selects movie for "day after tomorrow" at "14:00"
        When user books two tickets at seats "3/5" and "3/6"
        Then user has booked the next tickets: seat "3/5, 3/6" at "14:00"

    Scenario: Booking an already booked seat
        Given user booked for Movie 3 of 1 ticket for "tomorrow" at "10:00" seat "1/6"
        When user is booking an already booked for Movie 3 of 1 ticket for "tomorrow" at "10:00" seat "1/6"
        Then seat "1/6" is unclickable, book button is disabled, user is left on the movie booking page "Фильм 3"