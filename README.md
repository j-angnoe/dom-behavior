# DOM Behaviors

Define lazy/upfront click/create behaviors on elements, defined by css-selectors. 

Works independently of frameworks/view libraries.
Works on dynamically added DOM nodes. (dynamically added by javascript, fetched via ajax, or whatever).

- Work in progress

# Example:

```
behavior('click', '.some-fancy-item', function(event) {
    alert("Fancy item was clicked");
});

behavior('create', '.some-item', function () {
    // Any time a .some-item is added to DOM this will be
    // fired. Thus giving you a change to define certain behaviors.
})

```