an expansion/re-evaluation on how i was doing [this originally](https://github.com/gaberankin/threejs-rng-terrain).

I haven't put in any fancy workflows, as this is an experiment and I don't have any boilerplate for that (I normally work in GOLANG or C# for my job). To build, run `npm install` and then `webpack`.  Once built (it will build all the code in `src/` and put the compiled js in `dist/bundle.js`, run `npm run` and it'll start up a small throw-away server that's available on port 3000.

I'm experimenting with two things - first is the diamond-square algorithm, and the other is glsl shaders.  So far, GLSL has appeared to be complete wizardry to my eyes, and I had to do quite a bit of googling for this project to get the effect I wanted.

I also converted the original hill generator to run in this project, but it's super janky and needs to be adjusted.  the field generator is meant to only store a number between 1 and 0, and generate geometry based on the min and max provided to `HeightField.generate()`.  However, the old hill generator currently does what it wants and calculates the hill height incorrectly.