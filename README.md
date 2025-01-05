# Zeno Power

---

## Todo

### Global

- [x] Nav current page mark

- [ ] (MOBILE) Menu Styling

- [x] (WEBGL) Gradient
  - [x] page dependand
  - [x] animation
  - [ ] mouse animation
  - [x] fade in homepage
- [ ] (WEBGL) 3d Model
  - [ ] page dependant
  - [ ] animation
  - [ ] material
- [ ] (WEBGL) Stars
  - [ ] particle system

### Animation

- [x] hover states
  - [x] nav
  - [x] footer

### Home

- [ ] CSS consolidation pass
- [x] images on 2-3 sections

- [x] [COMP] Article slider
- [x] [COMP] hover partners component

### Careers

- [ ] CSS consolidation pass
- [ ] Breezy Integration
  - [x] Item Styling
- [ ] [COMP] items filtering system
- [x] [COMP] values tabs autoclose

### News

- [ ] CSS consolidation pass
- [x] Article list system
- [x] [COMP] Article list click functionality
  - [x] selected article indicator

#### Qs

- [x] newsletter subscribe how/where?

---

Finishing the rendering of the 3d model today (rn doesn't use the correct textures the correct way) as I got the final files late on friday, but thought deploying anyway made the most sense in the meantime!

Things I need:

- new logins for the client's breezy to make the switch from the testing one to the final one (old ones are not working anymore), don't consider this component until I got those as the filters are dynamic and will not display correctly until I have hooked it up).
- newsletter subscribe: where does it subscribe to?

---

There's one critical thing that doesn't work between design/webgl, which is the section with the section's background over the gradient and the model on top. The whole of webgl redsides in a single HTML element (the canvas), meaning it can't really have more than one z-index context. As options we have:

We make the background of the section in webgl (I'd be strongly aagainst it as it'll need a quite substantial compute power, especially on mobile and since the two context, html and canvas don't share the same color profile the backgrounds will not be consistent on nice screens). Lmk how you want to handle this, for now I just removed the background since the whole website becomes white anyway, I understand mightt not be the preferred solution.

Thanks!
