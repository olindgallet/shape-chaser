shape-chaser
============

A brief attempt at making a game where the goal is to match as many shapes as possible in 60 seconds. Still buggy.

Most notably is clearInterval not working for removing the animation loop when a player replays.  I don't know
if this is a coding bug, hardware issue, or what, but it doesn't work on my Android tablet.

============
And on with the game description:

Sample menu-screen:

Find the [color] [shape]

[timer bar]
[number matched]
[1] [2] [3]
[4] [5] [6]
[7] [8] [9]

Goal is to match the shape spelled out to the literal shape on the grid.  No negative feedback if the wrong shape
is clicked/touched.  A point is added to number matched if the shapes do match.

Once time runs out (60 seconds), the player can choose to play again or click a non-functioning no button.

=============

Technologies used:

CSS3/HTML5
Easel.js
Phonegap (currently only Android is used)