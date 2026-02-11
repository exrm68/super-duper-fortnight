# 📸 CineFlix Image Ratio & Best Practices Guide

## 🎯 Perfect Image Ratios for Best Display

### 1. **Home Banner (Main Carousel)**
- **Recommended Ratio:** `16:9` (Landscape)
- **Recommended Size:** 1920x1080px or higher
- **Field:** `thumbnail`
- **Why:** Banner adapts to 16:9 with `aspect-[16/9]` and `max-h-[75vh]`
- **Best Practices:**
  - Use high-quality landscape images
  - Keep important content in center (safe zone)
  - Avoid text near edges (gradient overlays will cover them)
  - Test on mobile and desktop

**Perfect Sources:**
- Movie posters (landscape)
- Official promotional banners
- High-res screenshots from trailers

---

### 2. **Detail Page Banner**
- **Recommended Ratio:** `2:3` (Portrait) or `16:9` (Landscape)
- **Recommended Size:** 
  - Portrait: 1000x1500px (2:3)
  - Landscape: 1920x1080px (16:9)
- **Field:** `detailBanner`
- **Why:** Portrait works best for detail page as it shows better on scroll
- **Best Practices:**
  - Portrait posters work AMAZING here
  - Use `object-position: center top` for portraits
  - Falls back to `thumbnail` if not provided
  - Opacity set to 50% with gradients

**Perfect Sources:**
- Official movie posters (vertical)
- Character posters
- High-quality artwork

---

### 3. **Episode Thumbnails**
- **Recommended Ratio:** `16:9` (Landscape)
- **Recommended Size:** 640x360px or higher
- **Field:** `episode.thumbnail`
- **Display:** `aspect-video w-28` (112px × 63px on screen)
- **Best Practices:**
  - Use episode-specific screenshots
  - Keep face/action in center
  - Avoid dark images (hard to see at small size)
  - Falls back to movie thumbnail if not provided

**Perfect Sources:**
- Episode screenshots
- Key moments from the episode
- Official episode images

---

### 4. **Screenshots Gallery**
- **Recommended Ratio:** `16:9` (Landscape)
- **Recommended Size:** 1920x1080px or 1280x720px
- **Field:** `screenshots[]` (array)
- **Display:** Grid of 2 columns, `aspect-video`
- **Recommended Count:** 4-8 images
- **Best Practices:**
  - Show variety (action, drama, landscapes)
  - High quality only
  - No spoilers in first 4 images
  - Properly represent movie/series content

**Perfect Sources:**
- Official movie screenshots
- High-quality frame captures
- Promotional stills

---

### 5. **Movie Cards (Thumbnails in Lists)**
- **Recommended Ratio:** `2:3` (Portrait) 
- **Recommended Size:** 600x900px
- **Field:** `thumbnail`
- **Display:** Portrait cards throughout the app
- **Best Practices:**
  - Movie posters work best
  - Clear title visibility
  - High contrast
  - Not too dark

---

## 🎨 Professional Metadata Fields

### ✅ Use These (Professional)
- `duration` - "2h 15m", "1h 45m"
- `videoQuality` - "4K HDR10+", "1080p BluRay REMUX"
- `audioLanguage` - "Hindi Dual Audio + English DD+5.1"
- `subtitles` - "English, Hindi, Arabic"
- `quality` - "1080p", "4K UHD"

### ❌ Avoid These (Removed)
- ~~`fileSize`~~ - Not professional for streaming platform
- ~~`length`~~ - Use `duration` instead

---

## 🔒 Season Lock Feature

### How It Works
Lock entire seasons with "Coming Soon" message:

```javascript
// In Admin Panel
lockedSeasons: [2, 3]  // Lock seasons 2 and 3

seasonReleaseInfo: {
  2: {
    releaseDate: "March 15, 2026",
    comingSoonMessage: "Season 2 arriving soon with exclusive content!"
  },
  3: {
    releaseDate: "June 2026",
    comingSoonMessage: "Get ready for the epic finale!"
  }
}
```

### Display Behavior
- When season is locked, shows centered "Coming Soon" screen
- Episodes in that season become inaccessible
- Beautiful lock icon and release date display
- Individual episode locks (`ep.isComingSoon`) still work for unlocked seasons

---

## 📐 Technical Specifications

### Banner Component
```css
className="aspect-[16/9] max-h-[75vh] rounded-2xl"
```
- Perfect 16:9 ratio
- Maximum 75% viewport height
- Rounded corners for modern look

### Detail Banner
```css
className="h-[55vh] object-cover object-top opacity-50"
```
- 55% viewport height
- Top-aligned for portraits
- 50% opacity with heavy gradients

### Episode Thumbnail
```css
className="aspect-video w-28"
```
- Fixed 16:9 ratio
- 112px wide (responsive)

### Screenshot Grid
```css
className="grid grid-cols-2 gap-3"
className="aspect-video rounded-xl"
```
- 2 columns on all devices
- Perfect 16:9 each image
- Click to open fullscreen lightbox

---

## 🎯 Quick Reference

| Element | Ratio | Optimal Size | Field |
|---------|-------|--------------|-------|
| Home Banner | 16:9 | 1920×1080 | `thumbnail` |
| Detail Banner | 2:3 or 16:9 | 1000×1500 / 1920×1080 | `detailBanner` |
| Episode Thumb | 16:9 | 640×360 | `episode.thumbnail` |
| Screenshots | 16:9 | 1920×1080 | `screenshots[]` |
| Movie Cards | 2:3 | 600×900 | `thumbnail` |

---

## 💡 Pro Tips

1. **Always use high-resolution images** - They scale down better than scaling up
2. **Test on mobile** - Most users are on mobile devices
3. **Compress images** - Use tools like TinyPNG before upload
4. **Use CDN** - Host images on Imgur, Cloudinary, or Firebase Storage
5. **Consistent quality** - Don't mix HD and SD images
6. **Portrait for posters** - Landscape for banners
7. **16:9 is universal** - Best for screenshots and episode thumbnails

---

## 🚀 Updated Features

### ✅ What's New in v5
- Perfect aspect ratio enforcement
- Season-level locking (not just episodes)
- Professional metadata (removed fileSize)
- Enhanced screenshots gallery with lightbox
- Better episode thumbnail display (16:9)
- Improved detail banner with portrait support
- Clean metadata badges (no clutter)

### 🎨 Design Improvements
- Rounded corners on banners
- Better gradient overlays
- Hover effects on screenshots
- Professional color scheme for metadata
- Larger, clearer episode thumbnails
- Smooth animations throughout

---

## 📞 Support

For best results:
1. Follow these ratios exactly
2. Use high-quality source images
3. Test on multiple devices
4. Compress before upload

Happy streaming! 🎬
