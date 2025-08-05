# Favicon Generation Instructions

## Required Favicon Files

The following favicon files need to be generated from the `favicon.svg` source file:

### Standard Favicons
- `favicon.ico` (16x16, 32x32, 48x48 multi-size)
- `favicon-16x16.png`
- `favicon-32x32.png`

### Apple Touch Icons
- `apple-touch-icon.png` (180x180)

### Android Chrome Icons
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Windows Tiles
- `mstile-70x70.png`
- `mstile-150x150.png`
- `mstile-310x150.png`
- `mstile-310x310.png`

## How to Generate

### Option 1: Online Generator (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload the `favicon.svg` file
3. Follow the wizard to customize settings
4. Download the generated package
5. Replace the placeholder files with the generated ones

### Option 2: Manual Generation
Use ImageMagick or similar tools:

```bash
# Install ImageMagick
sudo apt-get install imagemagick

# Generate different sizes
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 android-chrome-192x192.png
convert favicon.svg -resize 512x512 android-chrome-512x512.png

# Create ICO file with multiple sizes
convert favicon.svg -resize 16x16 favicon-16.png
convert favicon.svg -resize 32x32 favicon-32.png
convert favicon.svg -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

## HTML Integration

The following HTML meta tags should be added to the `<head>` section of all pages:

```html
<!-- Favicons -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">

<!-- Windows Tiles -->
<meta name="msapplication-TileColor" content="#1e3a8a">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Theme Colors -->
<meta name="theme-color" content="#1e3a8a">
```

## File Locations

All favicon files should be placed in the root directory of the website:
- `/favicon.ico`
- `/favicon.svg`
- `/favicon-16x16.png`
- `/favicon-32x32.png`
- `/apple-touch-icon.png`
- `/android-chrome-192x192.png`
- `/android-chrome-512x512.png`
- `/mstile-*.png`
- `/browserconfig.xml`
- `/manifest.json`
- `/site.webmanifest`