/**
 * Java Lab — Escena 3D decorativa del hero (Three.js).
 * ---------------------------------------------------
 * Fondo animado no bloqueante. Si Three.js o WebGL no están disponibles,
 * la interfaz sigue funcionando sin escena 3D. Respeta prefers-reduced-motion.
 */
(function (global) {
  "use strict";

  function init() {
    var THREE = global.THREE;
    if (!THREE) return;

    var host = document.querySelector(".hero-decoration");
    if (!host || host.querySelector(".hero-3d-canvas")) return;

    var canvas = document.createElement("canvas");
    canvas.className = "hero-3d-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, host.firstChild);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (err) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    var group = new THREE.Group();
    scene.add(group);

    var mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 1),
      new THREE.MeshBasicMaterial({ color: 0x4968e8, wireframe: true, transparent: true, opacity: 0.26 })
    );
    group.add(mesh);

    var inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 0),
      new THREE.MeshBasicMaterial({ color: 0x8566dc, wireframe: true, transparent: true, opacity: 0.22 })
    );
    group.add(inner);

    var reduceMotion = global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      var rect = host.getBoundingClientRect();
      var size = Math.max(140, Math.min(rect.width || 190, rect.height || 190));
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }

    function animate() {
      if (!reduceMotion) {
        group.rotation.x += 0.0025;
        group.rotation.y += 0.004;
        inner.rotation.x -= 0.004;
        inner.rotation.y -= 0.006;
      }
      renderer.render(scene, camera);
      if (!reduceMotion) global.requestAnimationFrame(animate);
    }

    resize();
    if (global.addEventListener) global.addEventListener("resize", resize);
    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
