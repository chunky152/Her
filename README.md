# Happy Birthday, Daphine 🎀

A single-page birthday website built for Wamala Daphine's 17th birthday — an envelope you open into a hero moment, a letter, a "our story" photo timeline, a flip-card list of reasons, a little quiz, and a confetti finale.

Live structure: **HTML / CSS / vanilla JS only** — no build step, no dependencies, no framework.

## Features

- **Envelope opener** — a wax-seal envelope overlay that opens on tap and starts the background music.
- **Background music** — a single track that plays through every section (see [Adding your own music](#adding-your-own-music)).
- **Falling petals** on the hero section.
- **A letter** to Daphine.
- **Our Story** — a timeline of milestones, each with a tilted polaroid photo slot (see [Adding real photos](#adding-real-photos)).
- **5 Reasons** — tap-to-flip cards, each with its own icon and a hidden reason on the back.
- **A little quiz** about the relationship, with a scored result at the end.
- **Finale** — a closing message with a canvas confetti burst.
- Scroll-reveal animations throughout, with a `prefers-reduced-motion` fallback that disables motion.

## Project structure

```
index.html    Page markup
style.css     All styling
script.js     All behavior (envelope, music, reveals, flip cards, quiz, confetti)
photos/       Drop real photos here for the "Our Story" polaroids
audio/        Drop your background-music.mp3 here
```

## Running locally

No build tools needed. Just serve the folder statically, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly as a `file://` URL also works, though some browsers restrict autoplay/Web Audio until a click — the envelope tap covers that.)

## Adding real photos

Each milestone in "Our Story" has a polaroid slot wired to an image file that doesn't exist yet. Drop images with these exact filenames into the `photos/` folder and they'll appear automatically — no code changes needed:

| File | Milestone |
|---|---|
| `photos/story-1-how-we-met.jpg` | How We Met |
| `photos/story-2-first-meeting.jpg` | First Physical Meeting |
| `photos/story-3-funny-moments.jpg` | Funny Moments |
| `photos/story-4-hard-moments.jpg` | Hard Moments |
| `photos/story-5-birthday.jpg` | Today: Your Birthday |

If a file is missing, that slot shows a styled placeholder instead of a broken image, so the page never looks broken while you're still collecting photos.

## Adding your own music

Drop a single track in as `audio/background-music.mp3` and it plays automatically, looping through every section — no code changes needed. It starts when the envelope is tapped open (browsers require a user gesture before audio can play) and can be muted with the speaker button in the top corner. If the file is missing, the page just plays silently rather than breaking.

## Customizing content

Everything is plain text/data in the source, no CMS:

- Letter text — `index.html`, `#letter` section.
- Timeline milestones — `index.html`, `#story` section.
- The 5 reasons — the `reasons` array in `script.js`.
- Quiz questions — the `quizData` array in `script.js`.
- Colors and fonts — CSS custom properties at the top of `style.css` (`--blush`, `--rose-gold`, `--gold`, `--mauve`, `--font-display`, `--font-body`, `--font-hand`).
