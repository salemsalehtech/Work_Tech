# Product images

Served as-is by Vite at `/images/...`. The paths are already in `db.json`.

| Folder         | File name              | Example                               |
| -------------- | ---------------------- | ------------------------------------- |
| `products/`    | `<product id>-1.jpg`   | `products/asus-zenbook-14-1.jpg`      |
| `accessories/` | `<accessory id>-1.jpg` | `accessories/acc-logitech-g305-1.jpg` |

- Transparent or white background, the laptop centred, about 1200 × 900 (4:3), under 200 KB.
- Extra angles for the gallery: `-2.jpg`, `-3.jpg`, `-4.jpg`, then add them to `images` in `db.json`.
- Until a photo exists, `ProductImage` shows the flat laptop drawing.
