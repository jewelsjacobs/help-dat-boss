# help-dat-boss

The challenge: untangle some spaghetti JS code with homegrown HTML template _language_

**How did I work this spaghetti you ask?**

### Fix complexity ###
I decided to grab the blocks in the condition statements and separate them into testable CommonJS modules. 
I set up webpack-dev-server with hotloader, mocha and type checking with [flow check](http://gcanti.github.io/flowcheck/) plugins using a test html file and json data file.
I'm using ES6 too cause it works better with flow although it will be a pain to refactor old spaghetti. Who knows.

# Install #

```bash
$ npm install
```

# Run #

```bash
$ npm start
$ open http://localhost:3000
```

# TDD / BDD #

```bash
$ npm test
```