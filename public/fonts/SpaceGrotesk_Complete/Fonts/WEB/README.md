# Installing Webfonts
Follow these simple Steps.

## 1.
Put `space-grotesk/` Folder into a Folder called `fonts/`.

## 2.
Put `space-grotesk.css` into your `css/` Folder.

## 3. (Optional)
You may adapt the `url('path')` in `space-grotesk.css` depends on your Website Filesystem.

## 4.
Import `space-grotesk.css` at the top of you main Stylesheet.

```
@import url('space-grotesk.css');
```

## 5.
You are now ready to use the following Rules in your CSS to specify each Font Style:
```
font-family: SpaceGrotesk-Light;
font-family: SpaceGrotesk-Regular;
font-family: SpaceGrotesk-Medium;
font-family: SpaceGrotesk-SemiBold;
font-family: SpaceGrotesk-Bold;
font-family: SpaceGrotesk-Variable;

```
## 6. (Optional)
Use `font-variation-settings` rule to controll axes of variable fonts:
wght 300.0

Available axes:
'wght' (range from 300.0 to 700.0

