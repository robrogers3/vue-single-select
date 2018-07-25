# Test Rail

## Display and Searching

### The supplied options show correctly
Given you have supplied options.

When you expect the options to display.

They display correctly.

### Matching options display when entering search text.

Given you have entered corresponding search text only matching options show as available.

### Changing an Option

Given you have selected an option,
When you focus on the selected option,
Then the search input is focused with the text of the previous option as the search text


## Selecting Options and Deselecting Options

### You can Select an Option

Given there are matching options, 
when you click on an option, or press enter
 the corresponding option will selected.

### A Selected Option is available to the Parent Component or Instance

When you have selected an option,
Then the selected option is set in the parent.

### The selected Option can be removed
Given you have selected an options.
When you click the 'deselect' icon, 
the selected option is removed.

### Deselected Options are reflected in the Parent component or Instance
Given you have deselected an option,
The selected option is deleted in the parent component or instance.

## KeyBoard Events

### You can navigate matching options by clicking the up or down arrow keys.
When matching options are displayed, 
You can move to an option for selection by clicking the up or down arrows.

### You can select an option by entering 'Enter' key while navigationg Options
Given there are matching options,
And you are either navigating options,
Upon hitting the Enter key
The corresponding option is selected.

### You can select the first matching option by clicking Enter key
Given there are matching options,
When you click enter without navigating
Then the first matching option is selected.

### You can dismiss the options by clicking the Tab or Escape keys.
Given you are focused on the search input,
when you click the Tab or Escape keys,
Then the options are dismissed and you move away from the seach input.

## CSS Classes, HTML Attributes

### You can overide the look of the component by supplying Classes

### You can provide these HTML attributes

* Required
* Tab Index
* The element Id
* The element name
* Default value for the search input
