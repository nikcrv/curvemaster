# Curve Finance Official Theme Colors

## Color Primitives

### Grays (Neutral Colors)
```
gray-10:  #fdfcfc
gray-20:  #fbfafa
gray-30:  #f8f7f7
gray-40:  #f5f4f3
gray-50:  #f1f0ef
gray-100: #e4e2e0
gray-200: #c9c5c1
gray-300: #adaaa5
gray-400: #928d87
gray-500: #767068
gray-600: #5e5a53
gray-700: #46433e
gray-800: #2f2e2a
gray-900: #201f1d
gray-950: #191815
gray-975: #191815
```

### Blues (Primary Colors)
```
blue-50:  #fefaef
blue-100: #f9edcc
blue-200: #f2dca7
blue-300: #ecc979
blue-400: #e7b652
blue-500: #e1a32d
blue-600: #c08724
blue-700: #966421
blue-800: #794d22
blue-900: #653e20
blue-950: #171e55
```

### Greens (Secondary Colors)  
```
green-100: #d4f7e3
green-200: #8fe5ba
green-300: #65da99
green-400: #3fcf77
green-500: #22be5b
green-600: #1a8e44
green-700: #145f2e
green-800: #0b3d26
```

### Reds (Tertiary/Feedback Colors)
```
red-200: #ffd88b
red-300: #ff976f
red-400: #ff6554
red-500: #ff433d
red-600: #e41c27
red-700: #b9151e
red-800: #8c111c
```

### Violet (Chad Theme Primary)
```
violet-50:  #efedfc
violet-100: #dcdaf9
violet-200: #c9c3f5
violet-300: #b7aef2
violet-400: #a598ee
violet-500: #9482eb
violet-600: #836ce7
violet-700: #6f52df
violet-800: #5b42b0
violet-900: #473581
violet-950: #2f2862
```

## Theme Configurations

### Light Theme
- **Primary**: Blues palette
- **Secondary**: Greens palette  
- **Tertiary**: Reds palette
- **Neutral**: Grays palette
- **Background**: `#f0edeb`

### Dark Theme
- **Primary**: Inverted Blues palette
- **Secondary**: Inverted Greens palette
- **Tertiary**: Inverted Reds palette
- **Neutral**: Inverted Grays palette
- **Background**: `#12110f`

### Chad Theme (Special)
- **Primary**: Violet palette
- **Secondary**: Greens palette
- **Tertiary**: Reds palette
- **Neutral**: Grays palette
- **Background**: `#bdbbec`
- **Special Fonts**: 
  - Heading: "Minecraft"
  - Body: "Hubot Sans"

## Key Theme Features

1. **Three themes available**: Light, Dark, and Chad
2. **Dynamic color system**: Colors invert between light and dark themes
3. **Comprehensive palette**: Multiple shades for each color family
4. **Material-UI integration**: Built on MUI theming system
5. **CSS variables**: Themes use CSS custom properties for flexibility

## Usage in UI Components

### Text Colors
- Primary text
- Secondary text
- Tertiary text
- Disabled text
- Highlight text
- Error/Warning/Success feedback text

### Layer Colors
- App background
- Surface fills
- Hover states
- Selected states
- Divider outlines

### Feedback Colors
- Error states
- Info states
- Warning states
- Success states

## Implementation Notes

The Curve Finance UI Kit uses a sophisticated theming system with:
- Primitive color tokens as the foundation
- Theme-specific color mappings
- Dynamic palette generation based on theme mode
- Support for inverted themes
- Special "Chad" theme with unique styling