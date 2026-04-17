an expansion/re-evaluation on how i was doing [this originally](https://github.com/gaberankin/threejs-rng-terrain).

To run locally, just do:

```bash
nvm use
npm install
npm run dev
```

I'm experimenting with two things - first is the diamond-square algorithm, and the other is glsl shaders (eventually).  I've lost the version of this code that used GLSL, but the idea behind that version was that when the item was tall, it would be green.  if it was short or near zero (or beyond a certain point i think), it would be blue, making appear as if it were underneath water.  When I had it running, it was a pretty neat effect.

The diamond-square algorithm looks a lot more natural than the original demo i built looked, but you need to really bang on it to get a result that looks interesting.  usually it will just look like noise.  it's possible the inputs I gave it were too tight, however.  I'm considering adding some inputs to the page to allow you to mess with it to see how various values look.

I also converted the original hill generator to run in this project, but it's super janky and needs to be adjusted.  the field generator is meant to only store a number between 1 and 0, and generate geometry based on the min and max provided to `HeightField.generate()`.  However, the old hill generator currently does what it wants and calculates the hill height incorrectly.  I think this is a classic case of "programmer messing with things he doesn't understand".