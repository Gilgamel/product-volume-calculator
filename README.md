# Container Volume Calculator

Internal tool for Ventmere — quickly calculate volumes for any combination of SKUs and figure out how many 40ft HQ containers you need. Pick products, enter quantities, and it tells you the volume and container count. Export to Excel when you're done.

## Features

- **Pick SKUs, get volumes** — select products from the list, enter quantities, see total volume and containers needed
- **Multi-container management** — split products across multiple containers, edit or delete each one individually
- **Utilization at a glance** — total CBM, remaining space, and usage percentage
- **Export to Excel** — download container plans as .xlsx, one sheet per container
- **Admin panel** — upload CSV to update product data

## Quick Start

```bash
npm install
npm start
```

Open http://localhost:3000.

Admin panel is at http://localhost:3000/admin.html.

## Uploading Product Data

Download the CSV template from the admin page, fill it in, and upload. Each row includes:

- Brand, SKU, model, colour
- Carton dimensions (length, width, height in meters)
- Sets per carton
- MOQ (minimum order quantity)

The system calculates per-carton volume automatically.

## Stack

- Frontend: plain HTML + CSS + JS, no framework
- Backend: Node.js + Express
- Data: JSON file
- Deployment: Vercel (serverless)

## 40ft HQ Container Specs

| Dimension | Measurement |
|-----------|-------------|
| Internal Length | 12.03 m |
| Internal Width | 2.352 m |
| Internal Height | 2.393 m |
| Max Volume | **67.7 CBM** |

## Project Structure

```
├── api/              # Vercel serverless functions
│   ├── admin/
│   │   └── login.js
│   ├── container.js
│   ├── download.js
│   ├── products.js
│   ├── template.js
│   └── upload.js
├── public/           # Frontend pages
│   ├── index.html    # Main page
│   ├── admin.html    # Admin panel
│   └── data/
│       └── products.json
├── server.js         # Dev server
└── data/             # Data files
```
