# Healthcare Call Offset WebApp
Javascript application to show multiple timezones and calendar offsets

### Functional Overview
This application is designed to be a quick reference for remote healthcare advocates when scheduling future call queues. 

The major US timezones are represented on the top row of the application, with a clock highlighted in green if the associated time matches the user's local time.

On the lower half of the screen various dates are listed, starting with the user's current date. From there, four offsets from the original time are generated (7 days, 30 days, 42 days, & 90 days) and adjusted to avoid weekends by decreasing the offset date. Additionally, the app is linked to Google's US Calendar via API fetch to further decrease the date offset if the original offset or previously adjust offset happens to fall on a holiday. The holiday is then reported to the user.

### Future Updates
#### Calendar
Currently, the US Holiday calendar includes holidays that are not applicable to the healthcare advocates workflow. Moving the dates closer is not negatively impactful, but having a curated calendar would be a much better user experience, especially when major holidays fall on weekends and substitue weekdays are used. Ideally, we would be able to integrate with a third-party managed calendar, but that possibility is TBD.
