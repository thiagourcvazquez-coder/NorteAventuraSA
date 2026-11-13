# Norte Aventura — Sistema de Instagram

Kit de plantillas + reglas de uso para unificar el feed de **@norteaventura**
con la identidad del sitio web (norteaventura / norte-aventura-salta.vercel.app).

## Identidad

| Elemento | Valor |
|---|---|
| Verde principal | `#093628` (fondos, barras, overlays) |
| Verde oscuro | `#052a1e` (gradientes) |
| Amarillo | `#FFC83B` (acentos, CTA, pills, sol) |
| Crema | `#FFFBF2` (texto claro, fondos alternos) |
| Tipografía | **Montserrat** — títulos ExtraBold mayúsculas, cuerpo SemiBold |
| Marca | Sol de rayos + "NORTE AVENTURA" en dos líneas |
| CTA siempre | "Reservá por WhatsApp →" + `+54 9 387 403 9502` |

Regla de oro: **nunca** introducir colores fuera de esta paleta. Si una foto tiene
tonos que pelean con la marca, se baja la saturación o se usa el overlay verde
(como en las portadas de destacadas).

## Patrón de feed (grilla de 3 columnas)

El feed se ve de a tres posts por fila. Alternar tipos para crear ritmo:

```
FOTO  |  GRÁFICO  |  FOTO
FOTO  |  FOTO     |  GRÁFICO
GRÁFICO | FOTO    |  FOTO
```

- **FOTO** = post/carrusel de imágenes reales (pueden llevar solo el logo en
  la esquina, o la plantilla `excursion` si venden algo concreto)
- **GRÁFICO** = cualquier plantilla con fondo verde/crema (promo, dato,
  testimonio, salidas de la semana)

Reglas:
1. Nunca dos gráficos seguidos → siempre separar con foto.
2. Máximo 2 gráficos por cada fila de 3.
3. Las fotos "crudas" pueden llevar el sol + NORTE AVENTURA chico en una
   esquina (marca de agua sutil, no tapa la imagen).
4. Mantener el mismo filtro/edición en las fotos: luz cálida, verdes y
   amarillos realzados — refuerza la paleta sin tocar nada más.

## Plantillas incluidas (`out/`)

| Archivo | Formato | Cuándo usarla |
|---|---|---|
| `excursion.png` | 1080×1350 | Ficha de una excursión puntual: foto + precio + CTA |
| `promo.png` | 1080×1350 | Oferta/destaque sin foto dominante |
| `week.png` | 1080×1080 | Salidas de la semana (lista de 3–4 tours) |
| `review.png` | 1080×1080 | Testimonio de cliente |
| `fact.png` | 1080×1080 | "¿Sabías que…?" / dato del destino |
| `story.png` | 1080×1920 | Anuncio de salida en historias |
| `cover-*.png` | 1080×1080 | Portadas unificadas de historias destacadas |

### Highlights recomendados (reemplazar los actuales)

Hoy hay destacadas con nombres sueltos y sin portada ("Destacada" ×2,
"inca cueva" minúscula, etc). Propuesta: **una destacada por excursión** con
su portada `cover-*` + dos institucionales:

`Hornocal` · `Salinas` · `Cachi` · `Cafayate` · `Llamas` · `Iruya` ·
`Termas` · `Tren Solar` · `Reservas` · `Opiniones`

## Plantillas nuevas (`render-nuevas.mjs`)

Segunda tanda, misma paleta y tipografía. Se renderizan con Chrome del sistema
en modo headless (no hace falta Playwright):

```bash
cd docs/instagram
node render-nuevas.mjs              # todas
node render-nuevas.mjs itinerario   # solo una
```

| Archivo | Formato | Cuándo usarla |
|---|---|---|
| `itinerario.png` | 1080×1350 | "Así es el día": timeline horario de la excursión |
| `combo.png` | 1080×1350 | Pack de 2 excursiones con precio combinado |
| `incluye.png` | 1080×1350 | "Qué incluye": checklist de la excursión |
| `galeria.png` | 1080×1350 | Collage editorial de 3 fotos |
| `tarifario.png` | 1080×1350 | Lista de precios de la temporada |
| `grupo.png` | 1080×1350 | Grupos, empresas, XV años (B2B) |
| `lugares.png` | 1080×1080 | Urgencia: "últimos N lugares" para una salida |
| `pregunta.png` | 1080×1080 | Pregunta frecuente (portada de carrusel FAQ) |
| `mapa-ruta.png` | 1080×1080 | Ruta del día con paradas, km y tiempos |
| `giftcard.png` | 1080×1080 | Gift card "Regalá aventura" |
| `story-encuesta.png` | 1080×1920 | Encuesta A/B entre dos excursiones |
| `story-cuenta.png` | 1080×1920 | Cuenta regresiva "salimos en N días" |
| `story-promo.png` | 1080×1920 | Promo vertical con precio para historias |
| `cover-reservas.png` | 1080×1080 | Portada destacada institucional Reservas |
| `cover-opiniones.png` | 1080×1080 | Portada destacada institucional Opiniones |

Elemento nuevo de marca: **líneas topográficas** (círculos concéntricos crema
al ~6 % sobre verde). Se usan como textura de fondo en `incluye`, `mapa-ruta`,
`grupo`, `story-cuenta`, `story-promo` y `cover-reservas`. Refuerza el tema
aventura sin sumar colores fuera de la paleta.

## Regenerar las plantillas

Cada PNG sale de `render.mjs` (HTML + Playwright). Para cambiar textos,
precios o fotos editar el bloque del template y correr:

```bash
cd docs/instagram
node render.mjs           # todas
node render.mjs promo     # solo una
```

## Captions — fórmula

```
[hook: 1 línea con el destino o la emoción]
[2–3 líneas de info práctica: duración, qué incluye]
[dato o frase de marca]
CTA: Reservá por WhatsApp → link en bio
#Salta #Jujuy #NorteAventura + 5–8 hashtags del destino
```

Hashtags base: `#Salta #Jujuy #NorteArgentina #Trekking #TurismoAventura`
+ por destino: `#Hornocal #QuebradaDeHumahuaca #SalinasGrandes #Cachi
#Cafayate #Iruya #Purmamarca #Tilcara`
