const scene = document.getElementById('scene');
const parallax = new Parallax(scene, {
    relativeInput: true,
    clipRelativeInput: true
});

parallax.friction(0.1, 0.1);