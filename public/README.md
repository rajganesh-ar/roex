# Adding Your Logo

To use your SVG logo:

1. **Place your logo file here**: `/public/logo.svg`

2. **The code is already set up** in `src/app/(frontend)/page.tsx`

3. **Uncomment these lines** (around line 29-35):
   ```tsx
   <Image
     src="/logo.svg"
     alt="Roex Logo"
     width={256}
     height={256}
     className="w-full h-full"
     priority
   />
   ```

4. **Remove or comment out** the temporary placeholder div below it

Your logo will automatically appear with smooth animations!

## Logo Specifications

- **Format**: SVG (recommended for crisp quality)
- **Size**: Any size (will be scaled to 256x256px on desktop, 192x192px on mobile)
- **Background**: Transparent recommended
- **Colors**: Should work well against dark backgrounds with purple/pink lighting

## Alternative Formats

If you prefer PNG or other formats:
- Name it `logo.png` (or `.jpg`, `.webp`)
- Update the `src` in the Image component accordingly
