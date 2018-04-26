# Dota 2 Simple Replay
A visualization tool to view simplified Dota 2 replays. Developed using [clarity-examples](https://github.com/skadistats/clarity-examples). This project was developed for a class project, so don't expect too much. :)

# Changelog
* [**2018-04-26**]
  * Added a scoreboard which shows player stats for the current time frame.
  * Clicking the circle icons toggles the icons and trails on the map for that hero.
  * Added play/pause button to automatically increment time frame, play speed can be adjusted with a slider from 0 to 30.
  * Data parser can grab creep data now, outputs to a separate csv.
* [**2018-04-25**]
  * Data parser can grab all data now instead of only grabbing changes in data (switched from SimpleRunner to ControllableRunner).
  * Added a bunch of values parsed, including player name, KDA, net worth.
  * As a result of these changes, the legend now groups the heroes by team!
  * Added text fields to input time and trail length.
* [**2018-04-23**]
  * Drawing dots and trails is more efficient now, but requires a ~4 second preload time of the page (need to implement loading text). Trails can go up to max length now.
* [**2018-04-23**]
  * Added trails behind each player, defaults to length of 5 seconds, can be adjusted with a slider from 0 to 20.
  * The time is now displayed in mm:ss format.
* [**2018-04-18**]
  * Dots are bordered green or red depending on team.
  * Dots no longer disappear if the player hasn't moved.
  * Dots become squares when player HP is 0.
  * Changed the color scheme of the dots.
* [**2018-04-19**] Initial commit. All we have is a minimap background with 10 colored circles, one for each hero, overlayed to indicate player positions. A slider at the top lets the user control time.
