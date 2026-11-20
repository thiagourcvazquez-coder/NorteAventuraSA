"""
Portadas con mapa — Norte Aventura
-----------------------------------
Foto de la excursión a la izquierda (sin tocar) + mapa de relieve con el
recorrido a la derecha, unidos por un degradado suave.

Estilo predeterminado "integrada": el mapa toma los colores de la foto.

Uso:
    python portadas.py --sitio         # todas + WebP en client/public/portadas (lo que usa el hero)
    python portadas.py --todas         # además genera las variantes verde y crema
    python portadas.py tour-a-cafayate-desde-salta caravana-de-llamas-centro-de-interpetacion-tilcara

Salida: out/integrada/<slug>.jpg (2100x1000)
Excursiones: excursiones.json (export de la tabla excursions de Supabase).
Para cambiar el recorrido o la salida de una excursión, editar RUTAS.
Para mover el encuadre de una foto, editar FOCO (x, y entre 0 y 1).
"""
import colorsys
import json
import math
import os
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_ROOT = os.path.join(BASE, 'out')
CACHE = os.path.join(BASE, 'cache')
FONTS = os.path.join(BASE, '..', 'propuesta', 'assets', 'fonts')
UA = 'NorteAventura-portadas/1.0'

W, H = 2100, 1000  # ~2.1:1, como el hero a pantalla completa en escritorio
SS = 2  # supersampling para líneas y textos

# Zona donde se dibuja el recorrido (lejos del menú de arriba y del título de abajo)
SAFE = (int(0.67 * W), int(0.27 * H), int(0.85 * W), int(0.63 * H))
# Degradado foto -> mapa (en px del lienzo)
FADE_FROM, FADE_TO = 0.45 * W, 0.67 * W
PHOTO_W = int(0.71 * W)
MAP_X0 = int(0.41 * W)
# Zonas (fracciones del lienzo x0, y0, x1, y1). El hero recorta arriba/abajo en
# pantallas anchas y a los costados en notebooks; arriba está el menú y abajo
# el título con un degradado oscuro, así que todo el texto va en la franja media.
LBL = (0.64, 0.20, 0.90, 0.72)      # donde preferimos las etiquetas
LBL_MAX = (0.60, 0.16, 0.92, 0.76)  # fuera de esto, nunca
CTX_BOX = (0.66, 0.16, 0.91, 0.78)  # pueblos de referencia

# ---------------------------------------------------------------- lugares
P = {
    'SALTA': ('Salta', -24.7883, -65.4106),
    'TILCARA': ('Tilcara', -23.5770, -65.3953),
    'JUJUY': ('S. S. de Jujuy', -24.1858, -65.2995),
    'PURMAMARCA': ('Purmamarca', -23.7456, -65.4986),
    'HUMAHUACA': ('Humahuaca', -23.2050, -65.3500),
    'CAFAYATE': ('Cafayate', -26.0730, -65.9759),
    'CACHI': ('Cachi', -25.1197, -66.1625),
    'SAN_LORENZO': ('San Lorenzo', -24.7297, -65.4878),
    'CASCADA_ESCONDIDA': ('Cascada Escondida', -24.7180, -65.5120),
    'SALINAS': ('Salinas Grandes', -23.6300, -65.8700),
    'HORNOCAL': ('Hornocal', -23.2140, -65.2400),
    'UQUIA': ('Uquía', -23.3030, -65.3570),
    'IRUYA': ('Iruya', -22.7900, -65.2150),
    'TERMAS_JORDAN': ('Termas del Jordán', -23.6400, -64.9400),
    'SAN_ANTONIO': ('San Antonio de los Cobres', -24.2250, -66.3190),
    'VOLCAN': ('Volcán', -23.9160, -65.4650),
    'CAMPO_QUIJANO': ('Campo Quijano', -24.9100, -65.6370),
    'HUICHAIRA': ('Huichaira', -23.5300, -65.3750),
    'AEROPUERTO': ('Aeropuerto Jujuy', -24.3928, -65.0978),
    'GARGANTA_TILCARA': ('Garganta del Diablo', -23.5940, -65.3720),
    'PUCARA': ('Pucará', -23.5872, -65.4005),
    'TERMAS_REYES': ('Termas de Reyes', -24.1720, -65.4870),
    'YALA': ('Yala', -24.1200, -65.4050),
    'INCA_CUEVA': ('Inca Cueva', -23.0500, -65.4400),
    'POZUELOS': ('Laguna de los Pozuelos', -22.3800, -65.9800),
    'ABRA_PAMPA': ('Abra Pampa', -22.7220, -65.6970),
    'CALILEGUA': ('P. N. Calilegua', -23.7600, -64.8500),
    'ACSIBI': ('Cuevas de Acsibi', -25.3100, -66.3000),
    'LA_POMA': ('La Poma', -24.7160, -66.2000),
    'CONCHAS': ('Quebrada de las Conchas', -25.8000, -65.6600),
    'MAIMARA': ('Maimará', -23.6240, -65.4080),
    'HUACALERA': ('Huacalera', -23.4370, -65.3500),
    'SEPTIMO': ('Molinos', -25.4440, -66.3080),
    'ROSARIO_LERMA': ('Rosario de Lerma', -24.9790, -65.5800),
    'SAN_PEDRO': ('San Pedro', -24.2310, -64.8660),
    'LIBERTADOR': ('Libertador Gral. San Martín', -23.8100, -64.7900),
}

# Recorrido por excursión: el primero es desde donde sale.
RUTAS = {
    'cafayate-trekking-y-degustacion': ['SALTA', 'CAFAYATE'],
    'caravana-de-llamas-centro-de-interpetacion-tilcara': ['TILCARA'],
    'cascada-escondida-san-lorenzo-salta': ['SALTA', 'CASCADA_ESCONDIDA'],
    'cascadas-trekking-jujuy': ['TILCARA'],
    'castillos-de-huichaira-tilcara': ['TILCARA', 'HUICHAIRA'],
    'cerro-elefante-salta': ['SALTA', 'CAMPO_QUIJANO'],
    'city-tour-pucara-tilcara': ['TILCARA', 'PUCARA'],
    'city-tour-salta': ['SALTA'],
    'cuevas-de-acisibi': ['SALTA', 'CACHI', 'ACSIBI'],
    'cuevas-del-wayra': ['TILCARA'],
    'excursion-a-cachi-desde-salta': ['SALTA', 'CACHI'],
    'excursion-humahuaca-hornocal-quebrada-de-las-senoritas': ['TILCARA', 'UQUIA', 'HUMAHUACA', 'HORNOCAL'],
    'excursion-iruya-desde-tilcara': ['TILCARA', 'HUMAHUACA', 'IRUYA'],
    'garganta-del-diablo-tilcara': ['TILCARA', 'GARGANTA_TILCARA'],
    'humahuaca-hornocal': ['SALTA', 'HUMAHUACA', 'HORNOCAL'],
    'inca-cueva-humahuaca': ['TILCARA', 'HUMAHUACA', 'INCA_CUEVA'],
    'iruya-trekking-2-dias': ['SALTA', 'HUMAHUACA', 'IRUYA'],
    'laguna-de-pozuelo': ['TILCARA', 'ABRA_PAMPA', 'POZUELOS'],
    'puente-del-diablo-la-poma': ['SALTA', 'CACHI', 'LA_POMA'],
    'quebrada-de-las-conchas': ['SALTA', 'CONCHAS'],
    'salinas-grandes-nocturna': ['TILCARA', 'PURMAMARCA', 'SALINAS'],
    'salinas-grandes-purmamarca-desde-salta': ['SALTA', 'PURMAMARCA', 'SALINAS'],
    'salinas-grandes-purmamarca-desde-tilcara': ['TILCARA', 'PURMAMARCA', 'SALINAS'],
    'termas-de-jordan-desde-salta': ['SALTA', 'TERMAS_JORDAN'],
    'termas-de-reyes-lagunas-de-yala': ['TILCARA', 'YALA', 'TERMAS_REYES'],
    'termas-del-jordan-trekking-de-altura': ['TILCARA', 'TERMAS_JORDAN'],
    'tour-a-cafayate-desde-salta': ['SALTA', 'CONCHAS', 'CAFAYATE'],
    'traslado-aeropuerto-jujuy-tilcara': ['AEROPUERTO', 'TILCARA'],
    'trekking-andino-llamas-patapampa-tilcara': ['TILCARA'],
    'tren-a-las-nubes-san-antonio-de-los-cobres-salta': ['SALTA', 'SAN_ANTONIO'],
    'tren-solar-quebrada-jujuy': ['SALTA', 'JUJUY', 'VOLCAN'],
    'turismo-rural-jujuy': ['TILCARA'],
    'yungas-jujenas': ['TILCARA', 'CALILEGUA'],
}

# Pueblos de referencia (texto tenue) si caen dentro del mapa
CONTEXTO = ['SALTA', 'JUJUY', 'TILCARA', 'PURMAMARCA', 'HUMAHUACA', 'CAFAYATE', 'CACHI',
            'MAIMARA', 'HUACALERA', 'VOLCAN', 'ABRA_PAMPA', 'SAN_ANTONIO', 'LA_POMA',
            'CAMPO_QUIJANO', 'SAN_LORENZO', 'UQUIA', 'IRUYA', 'ROSARIO_LERMA', 'SAN_PEDRO',
            'LIBERTADOR', 'SEPTIMO']

# Encuadre de la foto (centro de interés). Por defecto (0.5, 0.5).
FOCO = {}

VARIANTES = {
    # Predeterminada: el mapa toma los colores de la foto (sin choque visual)
    'integrada': dict(
        adaptive=True,
        route=(251, 149, 14), glow=(251, 149, 14), casing=(0, 0, 0, 130),
        text=(247, 248, 238), kicker=(251, 149, 14), ctx=(247, 248, 238, 150),
        marker_fill=(251, 149, 14), marker_stroke=(247, 248, 238), shadow=(0, 0, 0, 200),
    ),
    'verde': dict(
        shade_dark=(4, 26, 19), shade_light=(52, 98, 74),
        route=(255, 200, 59), glow=(255, 200, 59), casing=(3, 20, 14, 170),
        text=(255, 251, 242), kicker=(255, 200, 59), ctx=(255, 251, 242, 130),
        marker_fill=(255, 200, 59), marker_stroke=(255, 251, 242), shadow=(0, 0, 0, 150),
    ),
    'crema': dict(
        shade_dark=(196, 178, 140), shade_light=(255, 251, 242),
        route=(9, 54, 40), glow=(255, 200, 59), casing=(255, 251, 242, 200),
        text=(9, 54, 40), kicker=(140, 98, 6), ctx=(9, 54, 40, 120),
        marker_fill=(255, 200, 59), marker_stroke=(9, 54, 40), shadow=(255, 251, 242, 200),
    ),
}


# ---------------------------------------------------------------- utilidades
def fetch(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return path
    os.makedirs(os.path.dirname(path), exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for i in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            with open(path, 'wb') as f:
                f.write(data)
            return path
        except Exception:
            if i == 3:
                raise
            time.sleep(1.5 * (i + 1))


def font(weight, size):
    return ImageFont.truetype(os.path.join(FONTS, f'Montserrat-{weight}.ttf'), size)


def world(lat, lon, z):
    scale = 256 * 2 ** z
    x = (lon + 180) / 360 * scale
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * scale
    return x, y


def ruta_osrm(keys):
    """Geometría real por ruta (OSRM). Cacheada en disco."""
    if len(keys) < 2:
        return [(P[keys[0]][1], P[keys[0]][2])]
    coords = ';'.join(f'{P[k][2]},{P[k][1]}' for k in keys)
    path = os.path.join(CACHE, 'rutas', '_'.join(keys) + '.json')
    url = f'https://router.project-osrm.org/route/v1/driving/{coords}?overview=full&geometries=geojson'
    try:
        fetch(url, path)
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        pts = data['routes'][0]['geometry']['coordinates']
        return [(lat, lon) for lon, lat in pts]
    except Exception as e:
        print('   ! sin ruta OSRM, uso línea directa:', e)
        if os.path.exists(path):
            os.remove(path)
        return [(P[k][1], P[k][2]) for k in keys]


def tile(z, x, y):
    """Elevación (Terrarium, AWS Open Data). Sin cortes entre fuentes."""
    path = os.path.join(CACHE, 'dem', str(z), str(x), f'{y}.png')
    url = f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
    fetch(url, path)
    return path


def hillshade(elev, res_m, zfac):
    gy, gx = np.gradient(elev * zfac / res_m)
    slope = np.pi / 2 - np.arctan(np.hypot(gx, gy))
    aspect = np.arctan2(-gx, gy)
    az, alt = math.radians(315), math.radians(42)
    hs = np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect)
    return np.clip(hs, 0, 1)


# ---------------------------------------------------------------- mapa
def encuadre(route_pts, keys):
    pts0 = [world(lat, lon, 0) for lat, lon in route_pts] + [world(P[k][1], P[k][2], 0) for k in keys]
    xs, ys = [p[0] for p in pts0], [p[1] for p in pts0]
    bw, bh = max(xs) - min(xs), max(ys) - min(ys)
    sw, sh = SAFE[2] - SAFE[0], SAFE[3] - SAFE[1]
    if bw == 0 and bh == 0:
        zf = 11.6
    else:
        zf = math.log2(min(sw / max(bw, 1e-9), sh / max(bh, 1e-9)))
    zf = max(6.0, min(zf, 13.4))
    k = 2 ** zf
    cx, cy = (min(xs) + max(xs)) / 2 * k, (min(ys) + max(ys)) / 2 * k
    scx, scy = (SAFE[0] + SAFE[2]) / 2, (SAFE[1] + SAFE[3]) / 2
    ox, oy = cx - scx, cy - scy  # mundo(zf) = lienzo + (ox, oy)

    def to_px(lat, lon):
        x, y = world(lat, lon, zf)
        return x - ox, y - oy

    return zf, ox, oy, to_px


def relieve(zf, ox, oy):
    zt = min(math.ceil(zf - 1e-6), 13)
    kk = 2 ** (zt - zf)
    wx0, wy0 = (MAP_X0 + ox) * kk, (0 + oy) * kk
    wx1, wy1 = (W + ox) * kk, (H + oy) * kk
    tx0, ty0 = int(wx0 // 256), int(wy0 // 256)
    tx1, ty1 = int(wx1 // 256), int(wy1 // 256)
    jobs = [(zt, tx, ty) for tx in range(tx0, tx1 + 1) for ty in range(ty0, ty1 + 1)]
    with ThreadPoolExecutor(8) as ex:
        paths = list(ex.map(lambda j: tile(*j), jobs))
    elev = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), np.float32)
    for (z, tx, ty), p in zip(jobs, paths):
        a = np.asarray(Image.open(p).convert('RGB'), np.float32)
        e = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
        elev[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = e
    res = 156543.03 * math.cos(math.radians(24)) / 2 ** zt
    zfac = 1.0 + max(0, 12 - zt) * 0.45  # exagera el relieve a escalas chicas
    hs = hillshade(elev, res, zfac)
    # un toque de altura: valles más oscuros, cumbres más claras
    alt = np.clip((elev - 800) / 4200, 0, 1)
    g = 0.82 * hs + 0.18 * alt
    img = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8))
    box = (wx0 - tx0 * 256, wy0 - ty0 * 256, wx1 - tx0 * 256, wy1 - ty0 * 256)
    return img.resize((W - MAP_X0, H), Image.LANCZOS, box=box)


def tenir(gray, v):
    g = np.asarray(gray, dtype=np.float32) / 255.0
    g = np.clip((g - 0.22) / (0.92 - 0.22), 0, 1) ** 1.1
    d = np.array(v['shade_dark'], np.float32)
    l = np.array(v['shade_light'], np.float32)
    rgb = d + (l - d) * g[..., None]
    return rgb


BRAND_GREEN = np.array((9, 54, 40), np.float32)


def tenir_adaptado(gray, foto_arr):
    """Tiñe el relieve con los colores de la foto.

    Junto al fundido, cada fila del mapa toma el color del borde derecho de la
    foto (cielo sigue como cielo, tierra como tierra). Hacia la derecha va
    convergiendo a un tono profundo sacado de la misma foto, donde se leen bien
    la ruta y los nombres.
    """
    # color del borde de la foto, fila por fila, muy suavizado en vertical
    edge = foto_arr[:, int(PHOTO_W * 0.80):, :].mean(axis=1)
    strip = Image.fromarray(np.repeat(edge[:, None, :], 8, axis=1).clip(0, 255).astype(np.uint8))
    edge = np.asarray(strip.filter(ImageFilter.GaussianBlur(45)), np.float32)[:, 4, :]
    # no dejar que el borde sea casi blanco (salares, nubes)
    lum = edge @ np.array([0.299, 0.587, 0.114], np.float32)
    edge = edge * np.minimum(1, 205 / np.maximum(lum, 1))[:, None]

    # tono profundo: color medio de la mitad derecha de la foto, oscuro y algo saturado
    r, g_, b_ = foto_arr[:, PHOTO_W // 2:, :].reshape(-1, 3).mean(axis=0) / 255
    h, l, s = colorsys.rgb_to_hls(r, g_, b_)
    dr, dg, db = colorsys.hls_to_rgb(h, 0.15, min(0.55, s * 1.2 + 0.10))
    deep = np.array((dr, dg, db), np.float32) * 255
    deep = deep * 0.8 + BRAND_GREEN * 0.2

    xs = np.arange(MAP_X0, W, dtype=np.float32)[None, :]
    d = np.clip((xs - FADE_FROM) / (0.76 * W - FADE_FROM), 0, 1)
    d = (d * d * (3 - 2 * d) * 0.95)[..., None]
    base = edge[:, None, :] * (1 - d) + deep[None, None, :] * d

    gg = np.asarray(gray, np.float32) / 255.0
    gg = np.clip((gg - 0.22) / (0.92 - 0.22), 0, 1)[..., None]
    # el relieve aparece de a poco: casi plano junto a la foto, marcado hacia la derecha
    k = np.clip((xs - FADE_FROM) / (0.72 * W - FADE_FROM), 0, 1)[..., None]
    k = 0.25 + 0.75 * k * k * (3 - 2 * k)
    out = base * (1 + ((0.50 + 0.90 * gg) - 1) * k)
    out += (255 - out) * 0.10 * np.clip((gg - 0.75) / 0.25, 0, 1)  # brillo en las crestas
    return np.clip(out, 0, 255)


# ---------------------------------------------------------------- textos
def rect_overlap(a, b, pad=10):
    return not (a[2] + pad < b[0] or b[2] + pad < a[0] or a[3] + pad < b[1] or b[3] + pad < a[1])


def draw_text(d, xy, text, fnt, fill, anchor='la', spacing=0):
    x, y = xy
    if spacing:
        # letter-spacing manual
        cx = x
        for ch in text:
            d.text((cx, y), ch, font=fnt, fill=fill, anchor=anchor)
            cx += d.textlength(ch, font=fnt) + spacing
    else:
        d.text((x, y), text, font=fnt, fill=fill, anchor=anchor)


def text_w(d, text, fnt, spacing=0):
    return d.textlength(text, font=fnt) + spacing * max(len(text) - 1, 0)


# ---------------------------------------------------------------- portada
def portada(exc, variante):
    slug = exc['slug']
    v = VARIANTES[variante]
    keys = RUTAS[slug]
    pts = ruta_osrm(keys)
    zf, ox, oy, to_px = encuadre(pts, keys)

    # --- foto
    src = fetch(exc['image_url'], os.path.join(CACHE, 'fotos', slug + os.path.splitext(
        urllib.parse.urlparse(exc['image_url']).path)[1]))
    foto = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    foto = ImageOps.fit(foto, (PHOTO_W, H), Image.LANCZOS, centering=FOCO.get(slug, (0.5, 0.5)))
    foto_arr = np.asarray(foto, np.float32)

    # --- mapa base
    gray = relieve(zf, ox, oy)
    yy = np.linspace(-1, 1, H)[:, None]
    xx = np.linspace(-1, 1, W)[None, :]
    vig = np.clip(1 - 0.18 * (yy ** 2) - 0.10 * np.clip(xx, 0, 1) ** 2, 0, 1)[..., None]
    map_rgb = np.zeros((H, W, 3), np.float32)
    if v.get('adaptive'):
        map_rgb[:, MAP_X0:] = tenir_adaptado(gray, foto_arr)
        map_rgb[:, :MAP_X0] = map_rgb[:, MAP_X0:MAP_X0 + 1]
        map_rgb *= vig
    else:
        map_rgb[:, MAP_X0:] = tenir(gray, v)
        map_rgb[:, :MAP_X0] = map_rgb[:, MAP_X0:MAP_X0 + 1]
        if variante == 'verde':
            map_rgb *= vig
        else:
            map_rgb = 255 - (255 - map_rgb) * (2 - vig)

    photo_rgb = map_rgb.copy()
    if v.get('adaptive'):
        # la foto se suaviza de a poco justo antes de fundirse (menos choque de detalles)
        soft = np.asarray(foto.filter(ImageFilter.GaussianBlur(9)), np.float32)
        xp = np.arange(PHOTO_W, dtype=np.float32)[None, :]
        b = np.clip((xp - 0.47 * W) / (0.22 * W), 0, 1)
        b = (b * b * (3 - 2 * b) * 0.85)[..., None]
        foto_arr = foto_arr * (1 - b) + soft * b
    photo_rgb[:, :PHOTO_W] = foto_arr

    # --- degradado foto -> mapa (smootherstep + leve ondulación vertical para que no sea una regla)
    xs = np.arange(W, dtype=np.float32)[None, :]
    wobble = 22 * np.sin(np.linspace(0, math.pi * 1.6, H))[:, None]
    t = np.clip((xs - FADE_FROM - wobble) / (FADE_TO - FADE_FROM), 0, 1)
    a = (t * t * t * (t * (t * 6 - 15) + 10))[..., None]
    out = photo_rgb * (1 - a) + map_rgb * a
    base = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert('RGBA')

    # --- capa de recorrido (supersampling)
    S = SS
    layer = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    glow = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    line = [(x * S, y * S) for x, y in (to_px(lat, lon) for lat, lon in pts)]
    if len(line) > 1:
        gd = ImageDraw.Draw(glow)
        gd.line(line, fill=v['glow'] + (150,), width=34 * S // 2, joint='curve')
        glow = glow.filter(ImageFilter.GaussianBlur(14 * S))
        d = ImageDraw.Draw(layer)
        d.line(line, fill=v['casing'], width=12 * S, joint='curve')
        d.line(line, fill=v['route'] + (255,), width=6 * S, joint='curve')
    layer = Image.alpha_composite(glow, layer)
    d = ImageDraw.Draw(layer)

    taken = []  # rects ocupados (en px de lienzo * S)
    marks = []
    for i, k in enumerate(keys):
        x, y = to_px(P[k][1], P[k][2])
        marks.append((k, x * S, y * S, i))

    # marcadores
    for k, x, y, i in marks:
        if i == 0:
            for r, al in ((40, 45), (27, 85)):
                d.ellipse((x - r * S, y - r * S, x + r * S, y + r * S), fill=v['marker_fill'] + (al,))
            d.ellipse((x - 15 * S, y - 15 * S, x + 15 * S, y + 15 * S), fill=v['marker_fill'] + (255,),
                      outline=v['marker_stroke'] + (255,), width=4 * S)
            d.ellipse((x - 5 * S, y - 5 * S, x + 5 * S, y + 5 * S), fill=v['marker_stroke'] + (255,))
            r = 40 * S
        elif i == len(marks) - 1:
            d.ellipse((x - 13 * S, y - 13 * S, x + 13 * S, y + 13 * S), fill=v['marker_stroke'] + (255,),
                      outline=v['marker_fill'] + (255,), width=5 * S)
            r = 16 * S
        else:
            d.ellipse((x - 8 * S, y - 8 * S, x + 8 * S, y + 8 * S), fill=v['marker_fill'] + (255,),
                      outline=v['marker_stroke'] + (255,), width=3 * S)
            r = 10 * S
        taken.append((x - r, y - r, x + r, y + r))
    own = list(taken)  # rect del marcador i

    # etiquetas del recorrido
    f_kick = font('Bold', 15 * S)
    f_main = font('ExtraBold', 30 * S)
    f_stop = font('SemiBold', 20 * S)
    labels = []
    for k, x, y, i in marks:
        name = P[k][0].upper() if i in (0, len(marks) - 1) else P[k][0]
        fnt = f_main if i in (0, len(marks) - 1) else f_stop
        kicker = 'SALIDA' if i == 0 else None
        tw = text_w(d, name, fnt)
        kw = text_w(d, kicker, f_kick, 4 * S) if kicker else 0
        bw = max(tw, kw)
        th = fnt.size
        kh = (f_kick.size + 8 * S) if kicker else 0
        bh = th + kh
        gap = (34 if i == 0 else 22) * S
        g2 = gap * 0.75
        cands = [
            ('r', x + gap, y - bh / 2),
            ('l', x - gap - bw, y - bh / 2),
            ('r', x + g2, y - g2 - bh),
            ('r', x + g2, y + g2),
            ('l', x - g2 - bw, y - g2 - bh),
            ('l', x - g2 - bw, y + g2),
            ('t', x - bw / 2, y - gap - bh),
            ('b', x - bw / 2, y + gap),
        ]

        def hits_route(rect, pad=10 * S):
            return any(rect[0] - pad < px < rect[2] + pad and rect[1] - pad < py < rect[3] + pad
                       for px, py in line)

        others = [t_ for t_ in taken if t_ is not own[i]]

        def coste(rect):
            c = 0
            if not (rect[0] > LBL[0] * W * S and rect[2] < LBL[2] * W * S and rect[1] > LBL[1] * H * S and rect[3] < LBL[3] * H * S):
                c += 1
            if rect[0] < LBL_MAX[0] * W * S or rect[2] > LBL_MAX[2] * W * S or rect[1] < LBL_MAX[1] * H * S or rect[3] > LBL_MAX[3] * H * S:
                c += 100
            c += 10 * sum(rect_overlap(rect, t_, 8 * S) for t_ in others)
            c += 3 * hits_route(rect)
            return c

        best = min(((coste((lx, ly, lx + bw, ly + bh)), n, side, lx, ly) for n, (side, lx, ly) in enumerate(cands)))
        _, _, side, lx, ly = best
        chosen = (side, lx, ly, (lx, ly, lx + bw, ly + bh))
        side, lx, ly, rect = chosen
        taken.append(rect)
        labels.append((name, fnt, kicker, lx, ly, kh, bw, tw, kw, side))

    # sombra de etiquetas
    sh = Image.new('RGBA', layer.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    for name, fnt, kicker, lx, ly, kh, bw, tw, kw, side in labels:
        ax = lx + (bw - tw if side == 'l' else (bw - tw) / 2 if side in 't b' else 0)
        sd.text((ax, ly + kh), name, font=fnt, fill=v['shadow'])
        if kicker:
            kx = lx + (bw - kw if side == 'l' else (bw - kw) / 2 if side in 't b' else 0)
            draw_text(sd, (kx, ly), kicker, f_kick, v['shadow'], spacing=4 * S)
    sh = sh.filter(ImageFilter.GaussianBlur(7 * S))
    layer = Image.alpha_composite(sh, layer)
    d = ImageDraw.Draw(layer)
    for name, fnt, kicker, lx, ly, kh, bw, tw, kw, side in labels:
        ax = lx + (bw - tw if side == 'l' else (bw - tw) / 2 if side in 't b' else 0)
        d.text((ax, ly + kh), name, font=fnt, fill=v['text'] + (255,))
        if kicker:
            kx = lx + (bw - kw if side == 'l' else (bw - kw) / 2 if side in 't b' else 0)
            draw_text(d, (kx, ly), kicker, f_kick, v['kicker'] + (255,), spacing=4 * S)

    # pueblos de referencia
    f_ctx = font('Medium', 15 * S)
    for k in CONTEXTO:
        if k in keys:
            continue
        x, y = to_px(P[k][1], P[k][2])
        x, y = x * S, y * S
        name = P[k][0]
        tw = text_w(d, name, f_ctx)
        rect = (x - 5 * S, y - f_ctx.size / 2, x + 12 * S + tw, y + f_ctx.size / 2)
        if not (CTX_BOX[0] * W * S < rect[0] and rect[2] < CTX_BOX[2] * W * S and CTX_BOX[1] * H * S < rect[1] and rect[3] < CTX_BOX[3] * H * S):
            continue
        if any(rect_overlap(rect, t_, 14 * S) for t_ in taken):
            continue
        # no pisar la línea del recorrido
        if any(rect[0] - 6 * S < px < rect[2] + 6 * S and rect[1] - 6 * S < py < rect[3] + 6 * S for px, py in line[::3]):
            continue
        taken.append(rect)
        d.ellipse((x - 4 * S, y - 4 * S, x + 4 * S, y + 4 * S), fill=v['ctx'])
        d.text((x + 12 * S, y), name, font=f_ctx, fill=v['ctx'], anchor='lm')

    # atribución
    f_attr = font('Regular', 11 * S)
    d.text(((W - 18) * S, (H - 14) * S), 'Relieve: Mapzen/AWS Terrain · Rutas © OpenStreetMap', font=f_attr,
           fill=v['ctx'][:3] + (90,), anchor='rs')

    layer = layer.resize((W, H), Image.LANCZOS)
    final = Image.alpha_composite(base, layer).convert('RGB')
    out_dir = os.path.join(OUT_ROOT, variante)
    os.makedirs(out_dir, exist_ok=True)
    final.save(os.path.join(out_dir, slug + '.jpg'), quality=86, optimize=True, progressive=True)


PREDETERMINADA = 'integrada'
# Copia liviana para el sitio (hero de cada excursión)
SITE_DIR = os.path.join(BASE, '..', '..', 'client', 'public', 'portadas')


def main():
    """python portadas.py [--todas] [--sitio] [slug ...]
    --todas  además de la predeterminada genera verde y crema
    --sitio  exporta la predeterminada en WebP a client/public/portadas
    """
    with open(os.path.join(BASE, 'excursiones.json'), encoding='utf-8') as f:
        excs = [e for e in json.load(f) if e.get('is_active', True)]
    args = sys.argv[1:]
    todas, sitio = '--todas' in args, '--sitio' in args
    only = {a for a in args if not a.startswith('--')}
    variantes = list(VARIANTES) if todas else [PREDETERMINADA]
    for e in excs:
        if only and e['slug'] not in only:
            continue
        if e['slug'] not in RUTAS:
            print('?? sin ruta definida:', e['slug'])
            continue
        print('->', e['slug'])
        for var in variantes:
            portada(e, var)
        if sitio:
            os.makedirs(SITE_DIR, exist_ok=True)
            img = Image.open(os.path.join(OUT_ROOT, PREDETERMINADA, e['slug'] + '.jpg'))
            img.save(os.path.join(SITE_DIR, e['slug'] + '.webp'), quality=80, method=6)


if __name__ == '__main__':
    main()
