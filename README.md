# Container Volume Calculator

Internal tool for Ventmere — quickly calculate volumes for any combination of SKUs and figure out how many 40ft HQ containers you need. Pick products, enter quantities, and it tells you the volume and container count. Export to Excel when you're done.

## Features

- **Pick SKUs, get volumes** — select products from the list, enter quantities, see total volume and containers needed
- **Multi-container support** — save multiple containers, edit quantities, add/remove products, delete containers
- **Utilization at a glance** — total CBM, remaining space, and usage percentage for each container
- **Export to Excel** — download container plans as .xlsx, one sheet per container

## Quick Start

```bash
npm install
npm start
```

Open http://localhost:3000.

## Usage

1. Select a product from the dropdown and enter quantity
2. Click "Add" to add to current selection
3. Repeat until all products are added
4. Click "Save Container" to save the current set
5. Repeat to create multiple containers
6. Click "Download Excel" to export all containers

## Excel Output

Each saved container becomes a separate sheet (Container-1, Container-2, etc.) with:
- Brand, SKU, Model, Colour
- Quantity, Sets/CTN, CTNs Needed
- Vol/CTN, Total Vol

## Stack

- Frontend: plain HTML + CSS + JS, no framework
- Backend: Node.js + Express
- Data: JSON file (`public/data/products.json`)
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
│   ├── container.js
│   ├── download.js
│   └── products.js
├── public/           # Frontend pages
│   ├── index.html    # Main page
│   └── data/
│       └── products.json
├── server.js         # Dev server
└── package.json
```