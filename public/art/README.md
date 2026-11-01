# Generated artwork provenance

Created 1 November 2026 using the built-in OpenAI ImageGen tool. These are original illustrations, not paper figures or visual evidence of research results. No user reference attachments were available. The imagegen skill was used; hatch-pet identity/baseline/spacing QA guidance was adapted for this web sprite (no ChatGPT/Codex pet installation or full pet atlas).

## wizard-cat-strip.png

Transparent PNG, 2172 × 724. Four equal horizontal slots, 543 × 724 each: idle, blink, wave, holding sealed letter. Suitable for CSS background-size `400% 100%` and horizontal positions 0%, 33.333%, 66.667%, 100%. Visually checked: all four poses present, consistent cream/charcoal cat identity and purple hat, stable scale and baseline, no clipped body/hat, no labels or scenery. Image has alpha. Only use the letter/delivery animation after the app confirms a successful email send.

Prompt: Exactly four equally sized frames in one horizontal row, same adorable cream and charcoal wizard cat with oversized plum-purple pointed hat, brass moon pin, tiny purple cloak, amber eyes, stout seated body and curled tail. Idle eyes open; blink eyes closed; one paw raised waving; holding cream sealed envelope. Cozy old tavern game NPC, tasteful 16-bit pixel art, crisp pixel edges, limited palette. Same scale, centered within each quarter, feet on identical baseline, full body and hat visible with generous transparent padding. Genuinely transparent background. No floor, shadows, text, borders, labels or motion marks.

## research-manga-panels.png

Five separate vertical manga panels on one wide sheet. Use as atmospheric covers or comic decoration; they are fictional conceptual illustrations and must not be represented as scientific diagrams from the papers. Visually checked: five panels and white gutters, monochrome manga aesthetic, no readable captions, distinct compositions.

Prompt: A wide sheet containing exactly five equally wide tall vertical comic panels side by side with clean white gutters. Original inspiring science manga ink aesthetic, strong black shadow, delicate crosshatching and screentones, expressive perspective. Panel 1: thoughtful researcher studying abstract market candles on a terminal in nighttime laboratory. Panel 2: futuristic city and flowing geometric information ribbons. Panel 3: hands moving pieces on abstract strategy board beside notebook. Panel 4: scientist gazing into suspended crystalline quantum processor with concentric light rings. Panel 5: star field with circuit-like observatory and curious scientist silhouette. Pure black ink and white paper, dramatic manga tech mood. No words, letters, numbers, equations, captions, speech bubbles, brands, recognizable copyrighted characters, or claims of profit/scientific results.

## Reference-guided revision (preferred assets)

The user subsequently supplied references, preserved locally at `references/user-wizard-cat.png` and `references/user-manga-style.png` (reference attachments are excluded from the public repository). The earlier note about absent references applies only to the first generation above. The original files remain intact as previous versions.

### wizard-cat-strip-v2.png

Preferred wizard: 2172 × 724 transparent PNG, four 543 × 724 slots in the same order as v1. Built-in ImageGen edit using the supplied cat as identity reference. Visual QA confirms upright brown tabby with cream face/belly, amber eyes, crooked purple gold-star hat, purple gold-star robe, black outlines, right-curling tail and black flaming wand; four distinct actions, stable baseline, no clipped full characters. It preserves the supplied design much more closely than v1.

Prompt: Edit supplied wizard cat into exactly four equal horizontal web sprite slots. Preserve exact brown tabby/cream identity, amber eyes, large crooked dark-purple gold-star hat, purple robe and gold-star trim, black outlines, right-curling tail, black wand with attached orange/yellow flame. Idle, blink, free paw waving, free paw holding sealed cream envelope; wand remains in original hand. Same scale and baseline, safe transparent padding, no clipping, no floor, shadows, labels, borders or floating effects. Chunky low-resolution square-pixel aesthetic matching reference.

### research-manga-panels-v2.png

Preferred manga: 1774 × 887 PNG. Five monochrome panels with white gutters, coarse checkerboard dither and bold chunky pixels matching supplied style. Visual QA confirms distinct scenes and no readable captions. **Conceptual illustrations, not factual diagrams or paper figures.** The illustrated concepts are RL actions/risk/costs; simulated markets and regime stress; visibility-graph time-series geometry; quantum-circuit transformation of a European call payoff; quantum noise/error-correction resource scaling. Captions/source attribution must come from the app's validated paper metadata, not from the artwork.

Prompt: Use supplied manga image as style reference only. Five equally wide vertical panels on wide sheet, pure black/white, coarse square pixel edges, checkerboard dither, retro 1-bit manga, no smooth gray or polished hatching. Researcher and geometric RL robot with market action tiles/risk obstacles; laboratory miniature market under storm-like regime change; mountain-like time series with visibility graph links; quantum circuit portal transforming European call scroll into waves; noisy broken pixel paths protected by error-correction lattice with resource blocks. Original characters, no brands, captions, words, numbers, equations, factual assertions or profit claims.

## Full Pip pet atlas (preferred animated asset)

`pip/spritesheet.webp` and `pip/pet.json` were produced with the full hatch-pet workflow from `references/user-wizard-cat.png`. This is a website-only package; no pet was installed or activated in Codex or ChatGPT. `pip/animations.json` provides each state's row, frame count and canonical frame durations.

Built-in ImageGen generated the reference-grounded canonical base and each of the nine state strips independently with the prepared prompts and slot guides: idle (6), running-right (8), running-left (8), waving (4), jumping (5), failed (8), waiting (6), running/working (6), review (6). Leftward movement was generated separately because the character's wand and tail are asymmetric. One work-row revision repaired narrow tail padding. All jobs retained the brown/cream upright tabby, purple gold-star hat/robe and attached flaming wand, with no new props.

The hatch-pet deterministic scripts removed the run's auto-selected cyan chroma, extracted frames, composed the 8×9 atlas, checked used/unused cells and transparent pixel cleanup, and generated a contact sheet and nine timed GIF previews. Component extraction was used for eight rows; jumping was re-extracted using stable slots after visual QA found that per-frame cropping flattened its vertical arc. Final independent visual QA passed all nine states, including directional cadence, visible idle blink, stable character identity, complete unclipped silhouettes and restored jump arc.

Final atlas: 1536 × 1872 RGBA WebP, 192 × 208 cells, unused slots fully transparent, zero hidden RGB residue pixels. Validation: zero errors/warnings. Frame inspection: zero errors; one reviewed stable-slot advisory for jumping. Detailed reports, contact sheet and motion previews are retained at `../../art-runs/pip/qa` and `../../art-runs/pip/final/validation.json`. Earlier four-pose assets remain as previous versions. `pip/idle-preview.gif` is a real generated idle-loop fallback, not the full nine-state package.
