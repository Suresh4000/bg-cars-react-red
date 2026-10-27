# BG Cars React

React + Vite source repository for the BG Cars website.

## Recovery note

The original Vercel deployment exposed a file listing, but the source-content endpoint truncated larger files. This commit restores the files that were retrievable and includes a responsive React reconstruction for the missing app shell. It is **not a byte-for-byte recovery** of the original components or image assets. Review the contact details and compare the reconstruction with the live site before deploying.

## Development

```bash
npm install
npm run dev
npm run build
```
