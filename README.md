<p align="center">
  <img src="https://i.imgur.com/p4VkrJB.jpg" width="auto">
</p>


# Abstract
Visualizations are usually designed for desktop monitors, and suffer from various mobile friendly problems when they are viewed with mobile devices. Due to the mobile device's pervasiveness in society today, it makes sense to design visualizations that can be displayed efficiently and effectively on mobile devices.
The parallel coordinate or paracoord visualization, which requires a lot of space, is especially tough to display on mobile devices. We set out to design a technique to meet this challenge. The chosen dataset was amounts of different kinds of waste generated by the countries in the EU.

By researching existing literature on mobile friendly problems, their root causes and some solutions, we came up with a guide of design rules to design by. After weeks of the protoyping, critiquing and discussions, we created a prototype that displays amounts of 17 kinds of waste for 37 entities.

Our main takeaways from this project are:
- The process of prototyping-reviewing-prototyping is important!
- Set clear design rules before implementation to keep on track.
- Explicit design brings more efficiency than adapted design, in the case of designing for mobile.

___

<p align="center">
  <img src="https://i.imgur.com/hdDCJoV.jpg" width="100%" height="200" style="position: absolute; left 0;">
  <img src="https://i.imgur.com/TrKYm1Z.jpg" width="600" style="position: absolute;">
	<button>test</button>
</p>


There are two ways to open an instance of our project:
1. **Via Browser:**
You can open the application directly via [moin.vrsys.org](https://moin.vrsys.org/) in a browser app on your mobile device.
Doesn't matter if iOS or Android.
2. **Via APK:**
For Android users we also offer an APK which can be downloaded [here](https://moin.vrsys.org/MoInVisApp.apk).
The App accesses the in (1) mentioned web page and ensures a fullscreen.


# Useful Links and Video
**Authors:**
- Aalok Shashidhar Gokhale (aalok.shashidhar.gokhale@uni-weimar.de)
- Josef Roth (josef.roth@uni-weimar.de)
- Yen Lung Chen (yen.lung.chen@uni-weimar.de)
- Martin Unterreiner (martin.unterreiner@uni-weimar.de)

**University:**
- [This is the official web page](https://www.uni-weimar.de/de/medien/professuren/medieninformatik/vr/teaching/ws-202021/project-mobile-information-visualization/) of this university project.

**Video:**
- [This video](http://bit.ly/MoInVis) showcases the application *MoIn* developed by us.

___

# Introduction

___

# UI and UX Design Guide
As a group, we reviewed existing literature and studied about common problems while designing for mobile, such as the fat finger problem. This led to the formation of design rules which we would adhere to while designing and implementing our mobile visualization.
It was followed by a lot of paper-prototyping, critiquing and discussions, where we evaluated the designs against the design rules at every turn before we arrived at our final prototype.

## Design Rules
### 1. Portrait mode first
The visualisation is designed for portrait mode, since this is how most users hold their mobiles (and because designing for this aspect ratio was the challenge we wanted to overcome).
### 2. Colourblind-friendly palette
An option to switch to a color-blind friendly palette for the visual design is available, to increase inclusivity.
### 3. Scale contains maximum and minimum values
It is crucial that the scale ticks contain minimum and maximum value since it greatly affects how to perceive multivariable dataset. (However, this was left for future work. It is unimplemented at the moment)
### 4. Label positioned above this axis
Position labels above the axis to conserve space.

<p align="center">
  <img src="https://i.imgur.com/WR2GkPx.png" width="350">
</p>

### 5. Avoid gesture conflicts
When designing gesture interactions, avoid similar gestures on the same element, or same gestures that do different things in different areas. We focussed on commonly known gestures, as recommended by guidelines recommended by app developement bigshots like Google and Apple. But we recognise that other less commonly known/used gestures might be better suited for some interactions.

### 6. Design axes and their labels as interactable elements
The entire axis must be interactable to increase interactable area.
### 7. Minimise the context view and maximise the focus view
Because space is sore limited on mobile devices, focus view should be maximised while maintaining the perception of a minimised context view.
### 8. Animate transitions
Animation in transition is important to help users to perceive state switches.

## Design Guide
Certain design decisions had to be made to enhance the user experience of the system by solving mobile friendly problems usually prevalent in mobile visualisations, such as unreadable text due to inappropriate font, distorted layout, and the fat finger problem. 

### 1. Font choice and sizing
- A single font is used across all our tabs and overlays, for consistency.
- This font is web safe so that it will be rendered similarly across browsers and operating systems.
- The font size is set relatively to scale across different mobile screen sizes.
### 2. Avoid interference with system screen-edge gestures
Mobile devices usually have screen-edge gestures. To avoid interfering with these functionalities, we designed our visualization layout with margins.

<p align="center">
  <img src="https://i.imgur.com/WR2GkPx.png" width="350">
</p>



For issues like the fat finger problem, limited space of a mobile screen, lack of hover state due to touch interactions, more elaborate solutions are used.
### 3. Fat finger problem
The fat finger problem leads to inaccuracy of interactions and occluion of screen elements, and it can be solved by methods such as decoupling the gestures along unused axes, and by increasing the interactable area. 
#### Brushes
Brushes are created by with a pan gesture on the axis. The handles appear after the brush is created, and disappear after a while. The handles help edit the brush ends, and they can be reactivated on tapping on the brush.
The handles are positioned diagonally so that they do not clash when the brush is small.

<p align="center">
  <img src="https://i.imgur.com/P9cGfeI.png" width="350">
</p>

The interactable area of handles is not restricted only to the visual shape of the handle and is slightly larger for easier access.

When using the top handle, the axis will be occluded. This is avoided by decoupling the gesture along the y-axis. This means that after the gesture is started, the user is free to move their finger vertically without losing control of the handle, and then further adjust the brush without occlusion.

<p align="center">
  <img src="https://i.imgur.com/kqXc8BT.png" width="350">
</p>

Gesture decoupling is also done during creation of the brush.

For greater precision, a brush settings tab is available.

<p align="center">
  <img src="https://i.imgur.com/fflNLAG.png" width="350">
</p>

#### Axes reordering
The principle of increasing the interactable area is applied to reordring the axes. In reorder mode, the axis is dragged to reorder, and the user is free to start the gesture anywhere on the axis. The interactable area is also greater than the visible area.

### 4. Limited space
To deal with limited space, no unnecessary buttons are on the main visualisation, and a tab structure is used to contain configuration settings related to the items, attributes, brushes in separate tabs accessible by swiping left and right. Only two kinds of buttons are present:
- The axis label serves as a button to enter reorder mode and open the attribute detail view
- The context indicator serves as a button for easy movement of focus among axes.

To make use of all available space, the axis labels are placed on top of each axes. To deal with possible occlusion, a reasonable gap is present between the axis and the label. The label is also translucent to improve readability.
### 5. Lack of hover state
With touch interaction, the possibility to identify an item with hover is removed. This is accomplished with the attribute detail overview that displays an overview of the items for a particular attribute and also their values.

<p align="center">
  <img src="https://i.imgur.com/bK82M9Z.png" width="350">
</p>

This is activated on tapping the axis label. An item can then be identified using colour.
### 6. Dark mode vs Light mode
Both dark and light mode have their own qualities.
#### Light mode
1. Smaller fonts are easier to read with light mode.
2. For people with normal vision (or corrected-to-normal vision), visual performance tends to be better with light mode
3. Studies show that long term exposure to light mode might have adverse effects on sight.

Sources - 
- https://www.nngroup.com/articles/dark-mode/ 
- Cosima Piepenbrock, S. Mayr, A. Buchner (2013). Positive Display Polarity Is Particularly Advantageous for Small Character Sizes: Implications for Display Design. Human Factors. DOI: 10.1177/0018720813515509
- A. Aleman, M. Wang, and F. Schaeffel (2018). Reading and Myopia: Contrast Polarity Matters. Scientific Reports 8, 10840 (2018) doi:10.1038/s41598-018-28904-x

#### Dark mode
1. Dark-mode displays emit less light than light-mode ones (and, because of that, they might extend battery life)
2. Visual performance tends to be better with dark mode for people with disorders of cloudy ocular media like cataract. Dark mode might be a little bit more inclusive.
3. We felt the dark background allows entry lines to be better emphasized, and was more aesthetically pleasing.

The current implementation uses a dark mode theme. We recognise that providing an option to switch between light and dark mode would be the best approach to take.

Sources - 
- https://www.nngroup.com/articles/dark-mode/ 
- Rubin, G.S. & Legge, G.E. (1989) ‘Psychophysics of reading, VI: the role of contrast in low vision’, Vision Research, 29, 79–91
- Legge, G.E., Rubin, G.S., Pelli, D.G. & Schleske, M.M. (1985b) ‘Psychophysics of reading, II: low vision’, Vision Research, 25(2), 253–66
- K.S. Papadopoulos., D. B. Goudiras (2005). Accessibility Assistance for Visually-Impaired People in Digital Texts. British Journal of Visual Impairment. DOI: 10.1177/0264619605054779.
# Interaction gestures
Focussing on mobile devices we integrated several interaction gestures. In the following section the main interactions on the main view are presented.
## Navigation 
Three views are implemented. The main view with the paracoord, the attribute store and the entry tab. By swipping to the left or right these views can be entered.

<p align="center">
  <img src="https://i.imgur.com/iVH3iC3.png" width="100%">
</p>

## Navigation Scrolling
To navigate on the main in the parallel coord, a touch gesture was implemented. With this gesture the user can navigate the focus view by scrooling up or down, so that hidden axis are moving from the context area to the focus area (1).

<p align="center">
  <img src="https://i.imgur.com/7gOG7nz.png" width="90%">
</p>

Indicators show how many axis are hidden (2). With touching these indicators, the context area is switching from the context area to the focus area.
## Navigation Zooming by pinching
Too see greater details on the focus area, a pinch gesture is used. With a pinch in, more axis are shown in the focus area. By pinching out less axis are shown.

<p align="center">
  <img src="https://i.imgur.com/SbaEl0a.png" width="90%">
</p>

## Rearrange and hide axis
Access the reordering mode with a long press on a label (1). This is indicated by a wiggeling of the labels and the axis. Now, the axis can be reordered with a touch gesture (2-3). 

<p align="center">
  <img src="https://i.imgur.com/Vyj4diY.png" width="90%">
</p>

Also in the reordering mode (4), axis can be hided with a swipe to the left (5).


## Filtering
Items can be filtered by a brush with a left or right panning gesture. Handles, which disappear in some seconds, prevent the fat finger problem.

<p align="center">
  <img src="https://i.imgur.com/aTMkj7O.png" width="90%">
</p>

Double tab the highlighted filter to open the brush setting (1). In these settings the exact minimum and maximum can be set. Also a virtual keyboard can be opened to enter the exact values.

<p align="center">
  <img src="https://i.imgur.com/MuKyrzQ.png" width="90%">
</p>

Filters can be activated and deactivated (2). These settings are saved. So the user can switch inbetween the paracoord and the brush setting to analyse the data.
## Embed display information
To get further information about items about one attribute, the related label should be single tabbed. This opens the attribute detail view.

<p align="center">
  <img src="https://i.imgur.com/rnsIRQN.png" width="90%">
</p>

The items can be sorted by interest. Filtered items differs by the color and the opacity. To see the exact values, tab the attribute label.

<p align="center">
  <img src="https://i.imgur.com/3a47S9L.png" width="350">
</p>

# Discussion & Evaluation
Some aspects of our project discussed throughout the design phase and implementation phases such as the alternatives approach for certain features from our own empirical evaluation.
## Gesture conflicts
1.  Access to axis labels or brushing on axis

<p align="center">
  <img src="https://i.imgur.com/uBWWnri.png" width="90%">
</p>

Interaction gestures on the screen area where an axis close to its axis label may result in unexpected feedback, either accidentally single tapping into attribute detail view or activating brushing.

- Possible solutions are:
    - Move the attribute away dynamically
    - Configuration of hiding the axis labels
    - Increase space between attribute label and axis

2. Horizontal scroll v.s swipe

<p align="center">
  <img src="https://i.imgur.com/6NGIOe8.png" width="350">
</p>

Most of the interaction gestures and fat finger problem have been examined. In the implementation phase, we discovered an issue of how to fit long attribute name in small screen. 

- Possible solutions are:
    - horizontal scroll on each attribute name; however this  only give the swiping gesture to navigate to other tabs a small space in between and cause unexpected result
    - use the ellipsis to control the overflow. This approach works very well with this data set. 
    
## Navigation between tabs

<p align="center">
  <img src="https://i.imgur.com/Su55GKj.jpg" width="100%">
</p>

Various configurabilities lead the need of additional tab for application setting such as changing the font size, and the features of toggling the switching, and other features when the scale of this application becomes larger. 

How to navigate to different tabs sufficiently? Would a naive user know there is more than one tab just by looking at the main visualisation? To answer the question, more researches needed from users. Below is our expert arguments:

- Infinite loop (direct navigation from last to first tab possible)
    - Pros: user does not have to mentally. remember the direction of navigation.
    - Cons: user may not expect this behaviour.
- Sequential list (no direct navigation from last to first tab possible)
    - Pro: if the relations in tabs are semantically meaningful, this approach can be ideal.
    - Cons: navigation from end to end would be time consuming.
- Menu bar (instead of swiping only)
    - pros: allow additional navigation.
    - cons: need extra space.

## Modification of focus area in attribute tab

<p align="center">
  <img src="https://i.imgur.com/nCbBq9m.png" width="90%">
</p>

In the desgin phase, we discussed deploying pinch gesture(a) in the contrast of using button(b) in attribute tab. Despite of (a) approach would fit into the principle of direct manipulation; however, same gesture is used in main visulaisation for zooming which would change the viewport. This would lead to violation of mapping metaphor in design principle and inconsitency.

## Configurability 
Ideally this application should provide mode switching for our user. And the features discovered are following:

1. Dark & Light theme
2. Colorblind friendly palette

<p align="center">
  <img src="https://i.imgur.com/7A8CnQT.png" width="90%">
</p>

The rationale for providing different color palette:

From our own review, the diverging colors used for colorblind would be hard to be distinguished in small screen. For example the colors assigned to the Croatia, Cyprus, Czech public on the right figure using different hues are easier to be recognised.

3. Unit of measurement absolute  v.s relative data

<p align="center">
  <img src="https://i.imgur.com/KX3EENA.png" width="350">
</p>

We discovered that using absolute and relative data would affect how users perceive the data especially when data items are countries. Each countries have various population. For informative standpoint to reveal the facts, it is better to provide data per capita as well. For example, the plastic waste in UK and Germany generated similar amount of waste; however Germany has around 15 millions population more than UK, hence, Germany actually generated less plastic waste per person than UK.

4. Log scale for pattern comparison

<p align="center">
  <img src="https://i.imgur.com/LRyMGIX.png" width="90%">
</p>

Most of the items are clustered on the left side of scale. This affects users to perceive pattern. One of the potential solution instead of using linear scale is:
- log scale 
    - pros: for displaying numerical data over a very wide range of values in a compact way. Thus moving a unit of distance along the scale means the number has been multiplied by 3 shown in figure on the right. For example, if we look at the rubber waste and glass waste in the figure on the right. This would make the items distributed wider on the screen.

## Pattern comparison

<p align="center">
  <img src="https://i.imgur.com/L7CAhZ7.png" width="90%">
</p>

Consider the following user case:

>A user want to filter two ranges on plastic waste and see if the higher plastic waste countries would share a similar pattern to lower plastic waste countries?

At the moment, our application allow users to apply one brush on each axes. During the discussion within the group, we discover two issues of having multi-brushes on a single axis:

1. Due to the limitation of color choices, do we assign the colors to countries or brushing? 
2. A mechanism of logic is needed for which brush that the brushes of other attributes should follow. For example, which brushes on attribute 8 should the brush on attribute 9 would apply AND logic to?

## Usage of colors

<p align="center">
  <img src="https://i.imgur.com/ni16jG4.png" width="600">
</p>

In visualisation, colors often are used for identity channels. How to apply such limited choices to parallel coordinate system in small screen size? 

In the current version, the colors are assigned to each entries respectively and use the opacity to emphasize the selected entries while brushing. However, we discussed another usage in the case of applying different colors on brushes:

- Reserving 3 different hues for brushing, 
- The rest of the colors are used for items.
- Furthermore, assigning the hues by regions may help. For example assigning first hue to one group of items and the second hue for second group.

## Context & Focus
<p align="center">
  <img src="https://i.imgur.com/9gsh5kY.png" width="650">
</p>

- Current approach: hidden indicators on both end of visualisation to emphasise the concept of context & focus. 
- Additional feature: pinch gesture for zooming to realise the context & focus concept. And from our own expert review, we think the approach is sufficient and can be included in the future work if needed.

# Summary
A list of topics covered in this project
- Configurability
- Tab navigation
- Pattern comparison
- Context & Focus
- Legacy Bias
- Shareability
- Gesture conflict
- Smaller screen size
- Content overflow
- Use of common gestures
- Cluttered text
- Avoid system gestures
- Application Setting
- Fat-finger problem
- Unreadable font size
- Different aspect ratio
- Comparison of traditional desktop visualisation tool

# Future work

User research on the following fields before further implementation:

- Shareability
- Current implementation
- Legacy bias

Many aspects were discovered and tackled throughout the project, however we are still in the early age of discovering the use of mobile visualisation. More questions remain to be answered. And we can no longer just rely on our own expert review. however due to the time constraint, we were not able to conduct **user research on shareability** such as gathering requirement on how users would share their finding from the application. **Usability test for our current implementation** or using **think loud technique** where participants speak aloud any words in their mind as they complete a task. **Evaluation on different data set** to determine if one approach is sufficient or not is needed. Furthermore, visualisation tools on mobile devices contrast to traditional desktop station.users' gesture proposals are often biased by their experience with prior interfaces and technologies, particularly the WIMP (windows, icons, menus, and pointing) interfaces that have been standard on traditional PCs for the past two decades. The question of **is there better interaction gesture for visualisation tools on small screen** needed to be answered. 

In short, we’d like to encourage whoever would has interests in the future to conduct those research before going into another implementation phase.

# Codebase documentation
## Libraries used
- D3
- Hammer
- Vue
- Interact
- Sortable
## List of classes
- #### MoInVis.Paracoords.handler.main
    Entry point into the application. Prepares page for app-like usage feel for mobile.
- #### MoInVis.Paracoords.moin
    Moin Instance. Application parent class that creates the tabManager, tabs (main and overlay), and orders them.
- #### MoInVis.Paracoords.dataHandler
    Data Handler extracts and prepares data for easy use and handling.
- #### MoInVis.Paracoords.util
    Contains utility functions.
- #### MoInVis.Paracoords.tabManager
    Manages positions of tabs and transitions between tabs during switching.
- #### MoInVis.Paracoords.tab
    Base class for tabs. Does event handling, and provides an interface for tabManager to switch between tabs.
- #### MoInVis.Paracoords.paracoorder
    Handles drawing the UI and data for the paracoords tab. Inherits MoInVis.Paracoords.tab
- #### MoInVis.Paracoords.attributeStore
    Handles data and UI functionality for the attribute store tab. Inherits MoInVis.Paracoords.tab
- #### MoInVis.Paracoords.entryStore
    Handles data and UI functionality for the entry store tab. Inherits MoInVis.Paracoords.tab
- #### MoInVis.Paracoords.overlayTab
    Base class for Overlay tab. Does event handling, provides an interface for tabManager.
- #### MoInVis.Paracoords.axisDetailView
    Handles data and UI functionality for the axis detail view overlay tab. Inherits MoInVis.Paracoords.overlayTab.
- #### MoInVis.Paracoords.brushSetter
    Handles data and UI functionality for the brush setter overlay tab. Inherits MoInVis.Paracoords.overlayTab
- #### MoInVis.Paracoords.itemPath
    Contains data and representation of an item, as a path.
- #### MoInVis.Paracoords.axis
    Contains data and representation of an axis/attribute.
- #### MoInVis.Paracoords.axisInteractionManager
    Handles creation of interaction group, and handles events for axis brushing and reordering.
- #### MoInVis.Paracoords.brushManager
    Handles creation and management of brushes for an axis.
- #### MoInVis.Paracoords.axisBrush
    Class for an individual brush. Handles drawing and update of a brush, and its handles.
- #### MoInVis.Paracoords.contextIndicator
    Handles creation and drawing of a context indicator.
- #### MoInVis.Paracoords.actionManager
    Action Manager. Manages the actions to be done at a later point in time. (Used for the undo functionality in the attribute store tab)

## Additional Information
### JavaScript Coding Conventions
#### Variables
  - Use camelCase to name variables.
  - Names of private members start with underscore
    ```
    _privateMember = 2;
    ```
  - Declare all vars at the top of the function.
  - let can also be used to declare variables.
  - Constants are declared in UPPERCASE, with `_` between words.
  - Use meaningful names for variables. This increases readability. It is okay if the name becomes a bit long, but not excessively so.
#### Coding
- Use spaces liberally.
```
var foo = new typeObj( ‘Foo’ );
```
- No spaces in empty constructs.
```
var foo = new typeObj();
var foo = [];
```
- Open a curly brace on the same line.
```
if ( a === 10 ) {
	......
	}
```
- Always use `===` to check equality.
- `==` checks only value and not type. `1 == ‘1’ // true`
- `===` checks both value and type. `1 === ‘1’ // false`
- Use *semicolons* after each command.
- Use *indentations* and line breaks for readability.
#### Strings
- Use single-quotes for string literals.
```
var string1 = ‘string’;
```
- When a string contains single quotes, they need to be escaped with a backslash `(\)`.

### Running The Server
- Server command: python -m http.server [port_number] --bind [ip]
- Replace [ip] with computer's ip adress in startserver before running. Both mobile and computer need to be on the same network. 
- Run the batch file. Browse in mobile with http://[ip]:[port_number]



