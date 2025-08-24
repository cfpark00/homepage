# Google Drive Video Embed Fix

## Date: 2025-08-23 22:39

## Summary
Fixed an issue with Google Drive video embeds on the talks page by removing broken embed attempts and replacing them with direct links to Google Drive.

## Major Activities

### 1. Problem Investigation
- User reported that Google Drive video embeds weren't working on the talks page
- Identified Talk ID 9 had a Google Drive video URL that was being incorrectly processed
- Found the code was trying to embed Google Drive videos using YouTube's embed format

### 2. Research on Google Drive Video Embedding
- Researched current state of Google Drive video embedding capabilities (2024-2025)
- Discovered fundamental limitations:
  - Google removed reliable embed options around 2020
  - Embeds require viewers to be logged into Google accounts
  - Autoplay functionality is broken
  - Overall unreliable compared to YouTube/Vimeo
- Confirmed that even with proper `/preview` URL format, embeds are not fully reliable

### 3. Solution Implementation
- Added `isGoogleDriveVideo()` helper function to detect Google Drive video URLs
- Modified video embed logic to skip embedding for Google Drive videos
- Updated button text to show "View on Google Drive" instead of "Open in YouTube" for Drive videos
- Applied changes to both primaryContent layouts (video-first and slides-first)

## Files Modified

### `/apps/web/app/(default)/talks/page.tsx`
- Added helper function to detect Google Drive videos
- Conditionally rendered video embeds only for non-Google Drive URLs
- Updated button text based on video source

## Technical Details

The fix involved:
1. Detection logic: `url.includes('drive.google.com/file')`
2. Conditional rendering: `{talk.videoUrl && !isGoogleDriveVideo(talk.videoUrl) && (...)`
3. Dynamic button text: `{isGoogleDriveVideo(talk.videoUrl) ? 'View on Google Drive' : 'Open in YouTube'}`

## Result
- Google Drive videos no longer attempt to embed (avoiding broken iframes)
- Users can still access the videos via "View on Google Drive" button
- YouTube videos continue to embed normally
- Clean fallback behavior for unsupported video sources