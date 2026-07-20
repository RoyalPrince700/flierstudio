from PIL import Image


def flood_key(path, out, tol=42):
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()
    seeds = [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (0, h // 2),
        (w - 1, h // 2),
        (w // 2, h - 1),
    ]
    samples = [px[x, y][:3] for x, y in seeds]
    br = sum(c[0] for c in samples) // len(samples)
    bg = sum(c[1] for c in samples) // len(samples)
    bb = sum(c[2] for c in samples) // len(samples)

    def near(c):
        r, g, b, _ = c
        return abs(r - br) <= tol and abs(g - bg) <= tol and abs(b - bb) <= tol

    seen = [[False] * w for _ in range(h)]
    stack = [s for s in seeds if near(px[s[0], s[1]])]
    for x, y in stack:
        seen[y][x] = True
    i = 0
    while i < len(stack):
        x, y = stack[i]
        i += 1
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and near(px[nx, ny]):
                seen[ny][nx] = True
                stack.append((nx, ny))
    im.save(out, 'PNG')
    cleared = sum(1 for row in seen for v in row if v)
    print(f'saved {out} cleared={cleared}')


base = 'public/assets/orbit-gadgets'
flood_key(f'{base}/phone-coral.png', f'{base}/phone-coral-cutout.png', tol=42)
flood_key(f'{base}/phone-titanium.png', f'{base}/phone-titanium-cutout.png', tol=42)
flood_key(f'{base}/phone-porcelain-v2.png', f'{base}/phone-porcelain-cutout.png', tol=52)
print('done')
