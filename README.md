# Dota 2 Simple Replay
A visualization tool to view simplified Dota 2 replays. Developed using [clarity-examples](https://github.com/skadistats/clarity-examples). This project was developed for a class project, so don't expect too much. :)

# Changelog
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
