# JavaScript Coding Conventions
## Variables -
  - Use camelCase to name variables.
  - Names of private members start with underscore
    ```
    _privateMember = 2;
    ```
  - Declare all vars at the top of the function.
  - let can also be used to declare variables.
  - Constants are declared in UPPERCASE, with `_` between words.
  - Use meaningful names for variables. This increases readability. It is okay if the name becomes a bit long, but not excessively so.
## Coding -
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
- `===` checks both value and type. `1=== ‘1’ // false`
- Use *semicolons* after each command.
- Use *indentations* and line breaks for readability.
## Strings -
- Use single-quotes for string literals.
```
var string1 = ‘string’;
```
- When a string contains single quotes, they need to be escaped with a backslash `(\)`.

# Running the server.
- Server command: python -m http.server [port_number] --bind [ip]
- Replace [ip] with computer's ip adress in startserver before running. Both mobile and computer need to be on the same network. 
- Run the batch file. Browse in mobile with http://[ip]:[port_number]
