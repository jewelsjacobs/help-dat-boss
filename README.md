# help-dat-boss

The challenge: untangle some spaghetti JS code with homegrown HTML template _language_

**How did I work this spaghetti you ask?**

### Fix complexity ###
I decided to grab the blocks in the condition statements and separate them into testable CommonJS modules. 
I set up webpack-dev-server with hotloader, mocha and type checking with [flow check](http://gcanti.github.io/flowcheck/) plugins using a test html file and json data file.

### Getting started ###
While picking this apart I noticed:

There are lots of references to functions / methods that don't exist anywhere. 

These are NOT core JavaScript API functions / methods:
- getTemplateParams (line 109)
- setElementProperties (line 349)
- setTableProperties (line 350)

Then of course there are the milk and the mje methods:
- milk.fullDot (lines 36, 145),
- mje.swap (line 48),
- mje.presetSplit (lines 205, 228, 325, 402), not to be confused with
- milk.presetSplit (lines 49, 157, 166, 250, 258),
- milk.randomId (line 117),
- milk.getType (lines 140, 357, 398)

But I'm guessing despite this my bud is supposed to figure this out. So moving on . . .

### Replace non existing methods and functions with existing ones ###
I'm going to take a guess as to what these are doing and replace them

### Remove non referenced variables and arguments ###
Just because