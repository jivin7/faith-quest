/**
 * Faith Quest — 3D mission world (Three.js). WASD move, SPACE to act.
 */
const JungleGame = (() => {
  const WORLD = 100;
  const SPEED = 9;
  const ACT_RANGE = 7.5;
  const ACT_RANGE_BATTLE = 32;
  const CHOP_HITS = 3;
  const ACTION_DUR = 0.45;
  const CAM_DIST_MIN = 6;
  const CAM_DIST_MAX = 24;
  const CAM_PITCH_MIN = 0.12;
  const CAM_PITCH_MAX = 1.35;
  const CAM_ROT_SPEED = 2.8;
  const CAM_DRAG_SENS = 0.005;

  let canvas, running, rafId, keys, hintEl, gameTime;
  let camYaw, camPitch, camDistance, camDrag, lastPointerX, lastPointerY;
  let touchInput, mobileBound, joyActive, joyCenter, joyPointerId, canvasPointer;
  const JOY_RADIUS = 58;
  const JOY_RADIUS_MOBILE = 68;
  const TAP_MOVE_PX = 14;
  const TAP_MAX_MS = 380;
  let renderer, scene, clock, camera3d;
  let player, trees, workSite, interactSite, goliath, projectiles;
  let playerGroup, toolMesh, charPlane, charTex, envMeshes, highlightRing;
  let arkSite, floodWater, rainDrops, rainbowGroup, finaleTimer, finaleDone, playerLocked;
  const CHAR_FACE_OFFSET = 0;
  let mode, theme, requiredTool, progress, progressTarget;
  let onProgress, onComplete, nearTarget;
  let actionCooldown, playerAction, fxParticles;

  const TOOL_ACTION = {
    axe: { type: "chop", label: "SPACE to chop" },
    hammer: { type: "hammer", label: "SPACE to hammer" },
    saw: { type: "saw", label: "SPACE to saw" },
    rope: { type: "rope", label: "SPACE to tie rope" },
    sling: { type: "sling", label: "SPACE to sling" },
  };

  const TOOL_HINT_WRONG = {
    axe: "Select the Axe to chop trees.",
    hammer: "Select the Hammer to build.",
    saw: "Select the Saw for this step.",
    rope: "Select the Rope for this step.",
    sling: "Select the Sling — your weapon against Goliath!",
  };

  function setTip(msg) {
    if (hintEl) hintEl.textContent = msg;
    const tip = document.getElementById("mission-tip-text");
    if (tip && msg) tip.textContent = msg;
  }

  function loadCharTexture(spriteUrl) {
    const src = spriteUrl || "character.png";
    return new Promise((resolve) => {
      if (!window.THREE) return resolve(null);
      new THREE.TextureLoader().load(
        src,
        (t) => {
          t.encoding = THREE.sRGBEncoding;
          resolve(t);
        },
        undefined,
        () => resolve(null)
      );
    });
  }

  function clearScene() {
    if (!scene) return;
    [...scene.children].forEach((c) => scene.remove(c));
    envMeshes = [];
    trees = [];
    playerGroup = null;
    toolMesh = null;
    charPlane = null;
    highlightRing = null;
    workSite = null;
    interactSite = null;
    arkSite = null;
    floodWater = null;
    rainDrops = [];
    rainbowGroup = null;
    goliath = null;
    fxParticles = [];
    projectiles = [];
    finaleTimer = 0;
    finaleDone = false;
    playerLocked = false;
    setCinematic("", false);
  }

  function setupRenderer() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth || 800;
    const h = parent.clientHeight || 500;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    camera3d.aspect = w / h;
    camera3d.updateProjectionMatrix();
  }

  function setupLights() {
    const hemi = new THREE.HemisphereLight(0x6a8fa8, 0x1a3d28, 0.55);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff4d6, 1.15);
    sun.position.set(25, 45, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.left = -45;
    sun.shadow.camera.right = 45;
    sun.shadow.camera.top = 45;
    sun.shadow.camera.bottom = -45;
    scene.add(sun);
    scene.add(sun.target);
  }

  const FOREST = {
    floor: 0x1a3d28,
    floorAlt: 0x163422,
    canopy: [0x0d3d24, 0x0f4528, 0x124a2c, 0x145232],
    trunk: 0x4a3228,
    sky: 0x4a6d85,
    fog: 0x1a3328,
  };

  function createSky(themeName) {
    if (themeName === "valley") {
      scene.background = new THREE.Color(0x6a7f94);
      scene.fog = new THREE.Fog(0x3d4a38, 40, 100);
    } else {
      scene.background = new THREE.Color(FOREST.sky);
      scene.fog = new THREE.Fog(FOREST.fog, 38, 92);
    }
  }

  function createGround(themeName) {
    const g = new THREE.Group();
    const isValley = themeName === "valley";
    const floorColor = isValley ? 0x4a5c3a : FOREST.floor;

    const groundMat = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.98,
      metalness: 0,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD * 1.5, WORLD * 1.5), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    g.add(ground);

    if (!isValley) {
      const patchMat = new THREE.MeshStandardMaterial({
        color: FOREST.floorAlt,
        roughness: 1,
        transparent: true,
        opacity: 0.55,
      });
      for (let i = 0; i < 80; i++) {
        const patch = new THREE.Mesh(new THREE.CircleGeometry(1.5 + Math.random() * 2.5, 8), patchMat);
        patch.rotation.x = -Math.PI / 2;
        patch.position.set((Math.random() - 0.5) * WORLD * 0.95, 0.01, (Math.random() - 0.5) * WORLD * 0.95);
        g.add(patch);
      }
    }

    const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a4a48, roughness: 0.9 });
    for (let i = 0; i < 12; i++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.25 + Math.random() * 0.35, 0),
        rockMat
      );
      rock.position.set((Math.random() - 0.5) * WORLD * 0.85, 0.12, (Math.random() - 0.5) * WORLD * 0.85);
      rock.castShadow = true;
      g.add(rock);
    }

    scene.add(g);
    envMeshes.push(g);
  }

  function makeTreeMesh(x, z, tall) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const scale = tall ? 1 + Math.random() * 0.35 : 0.85 + Math.random() * 0.2;
    g.scale.setScalar(scale);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.48, 2.6, 8),
      new THREE.MeshStandardMaterial({ color: FOREST.trunk, roughness: 0.92 })
    );
    trunk.position.y = 1.3;
    trunk.castShadow = true;
    g.add(trunk);

    const leafColor = FOREST.canopy[Math.floor(Math.random() * FOREST.canopy.length)];
    const leafMat = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.9 });
    const layers = tall ? 4 : 3;
    for (let i = 0; i < layers; i++) {
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(2.1 - i * 0.32, 2.1, 8),
        leafMat
      );
      foliage.position.y = 3 + i * 1.45;
      foliage.castShadow = true;
      g.add(foliage);
    }

    scene.add(g);
    return g;
  }

  function seedDecorTrees(count, avoidList) {
    const margin = 6;
    const placed = avoidList ? avoidList.map((t) => ({ x: t.x, z: t.z })) : [];
    for (let i = 0; i < count; i++) {
      let x, z, ok, tries = 0;
      do {
        x = (Math.random() - 0.5) * (WORLD - margin * 2);
        z = (Math.random() - 0.5) * (WORLD - margin * 2);
        ok = !placed.some((p) => Math.hypot(p.x - x, p.z - z) < 3.8);
        if (workSite && Math.hypot(workSite.x - x, workSite.z - z) < 9) ok = false;
        tries++;
      } while (!ok && tries < 25);
      if (ok) {
        makeTreeMesh(x, z, Math.random() > 0.4);
        placed.push({ x, z });
      }
    }
  }

  function seedTrees(count) {
    const list = [];
    const margin = 6;
    const spacing = 4.2;
    for (let i = 0; i < count; i++) {
      let x, z, ok, tries = 0;
      do {
        x = (Math.random() - 0.5) * (WORLD - margin * 2);
        z = (Math.random() - 0.5) * (WORLD - margin * 2);
        ok = !list.some((t) => Math.hypot(t.x - x, t.z - z) < spacing);
        if (workSite && Math.hypot(workSite.x - x, workSite.z - z) < 9) ok = false;
        tries++;
      } while (!ok && tries < 50);
      const mesh = makeTreeMesh(x, z, false);
      list.push({ id: i, x, z, hp: CHOP_HITS, stump: false, wobble: 0, mesh });
    }
    return list;
  }

  function createPlayer() {
    const g = new THREE.Group();

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.03;
    g.add(shadow);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 1.1, 10), bodyMat);
    body.position.y = 1.05;
    body.castShadow = true;
    g.add(body);

    const headGroup = new THREE.Group();
    headGroup.position.y = 1.75;
    if (charTex) {
      body.visible = false;
      const faceMat = new THREE.MeshStandardMaterial({
        map: charTex,
        transparent: true,
        alphaTest: 0.08,
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0,
      });
      let planeW = 1.35;
      let planeH = 1.85;
      if (charTex.image?.width && charTex.image?.height) {
        const aspect = charTex.image.width / charTex.image.height;
        planeH = 2.05;
        planeW = planeH * aspect;
      }
      charPlane = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), faceMat);
      charPlane.position.y = planeH * 0.08;
      charPlane.rotation.y = Math.PI;
      charPlane.castShadow = true;
      headGroup.position.y = planeH * 0.55;
      headGroup.add(charPlane);
    } else {
      charPlane = null;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffcc80 })
      );
      headGroup.add(head);
    }
    g.add(headGroup);

    toolMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.5, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x8d6e63, metalness: 0.3, roughness: 0.5 })
    );
    toolMesh.position.set(0.45, 1.1, 0.35);
    toolMesh.rotation.z = -0.4;
    g.add(toolMesh);

    scene.add(g);
    playerGroup = g;
    return g;
  }

  function createHighlight() {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 3.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    ring.visible = false;
    scene.add(ring);
    highlightRing = ring;
  }

  function createWorkSite(label) {
    const g = new THREE.Group();
    const isTarget = label === "TARGET";

    if (isTarget) {
      const colors = [0xc62828, 0xffffff, 0xc62828, 0xffffff, 0x8b0000];
      const sizes = [2.8, 2.2, 1.6, 1, 0.45];
      colors.forEach((c, i) => {
        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(sizes[i], sizes[i], 0.12, 24),
          new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })
        );
        ring.position.y = 0.15 + i * 0.1;
        g.add(ring);
      });
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 1.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x5d4037 })
      );
      post.position.y = 0.6;
      g.add(post);
    } else {
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.4, 6),
        new THREE.MeshStandardMaterial({ color: 0x5d4037 })
      );
      base.position.y = 0.2;
      base.castShadow = true;
      g.add(base);
      g.arkWalls = [];
      for (let i = 0; i < 4; i++) {
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(7, 0.5, 5),
          new THREE.MeshStandardMaterial({ color: 0x6d4c41 })
        );
        wall.position.y = 0.5;
        wall.visible = false;
        g.add(wall);
        g.arkWalls.push(wall);
      }
    }

    g.position.set(0, 0, 0);
    scene.add(g);
    return { mesh: g, x: 0, z: 0, label, buildH: 0 };
  }

  function setCinematic(text, show) {
    const box = document.getElementById("mission-cinematic");
    const line = document.getElementById("mission-cinematic-text");
    if (!box || !line) return;
    if (show && text) {
      line.textContent = text;
      box.classList.remove("hidden");
    } else {
      box.classList.add("hidden");
    }
  }

  function finishNoahStep() {
    if (finaleDone) return;
    finaleDone = true;
    progress = progressTarget;
    bumpProgress();
  }

  function createFullArk() {
    const g = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.88 });
    const hull = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 7), wood);
    hull.position.y = 0.6;
    hull.castShadow = true;
    g.add(hull);

    for (let i = 0; i < 5; i++) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 1.1, 6), wood);
      wall.position.y = 1.4 + i * 1.15;
      wall.castShadow = true;
      g.add(wall);
    }

    const roof = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.5, 6.5), wood);
    roof.position.y = 7.2;
    g.add(roof);

    const ramp = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 3.5), wood);
    ramp.position.set(0, 0.35, 4.2);
    ramp.rotation.x = -0.35;
    g.add(ramp);

    const doorGlow = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2.5, 0.2),
      new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        emissive: 0xff8f00,
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.75,
      })
    );
    doorGlow.position.set(0, 2.2, 3.55);
    g.add(doorGlow);
    g.userData.door = doorGlow;

    g.position.set(0, 0, -8);
    scene.add(g);
    return { mesh: g, x: 0, z: -5, label: "ARK" };
  }

  function createFloodWater() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a4a6e,
      transparent: true,
      opacity: 0.82,
      roughness: 0.3,
      metalness: 0.1,
    });
    const water = new THREE.Mesh(new THREE.PlaneGeometry(WORLD * 2, WORLD * 2), mat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    scene.add(water);
    return water;
  }

  function createRain() {
    const drops = [];
    const mat = new THREE.MeshBasicMaterial({
      color: 0x90caf9,
      transparent: true,
      opacity: 0.65,
    });
    for (let i = 0; i < 140; i++) {
      const drop = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5 + Math.random() * 0.4, 0.04), mat);
      drop.position.set((Math.random() - 0.5) * WORLD, 8 + Math.random() * 12, (Math.random() - 0.5) * WORLD);
      drop.userData = { speed: 14 + Math.random() * 12 };
      scene.add(drop);
      drops.push(drop);
    }
    return drops;
  }

  function createRainbowArc() {
    const g = new THREE.Group();
    const colors = [0xe53935, 0xff6f00, 0xffca28, 0x43a047, 0x1e88e5, 0x5e35b1, 0x8e24aa];
    colors.forEach((c, i) => {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(22 - i * 0.55, 0.42, 6, 48, Math.PI * 0.92),
        new THREE.MeshBasicMaterial({
          color: c,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
        })
      );
      arc.rotation.x = Math.PI / 2;
      arc.position.y = 10 + i * 0.12;
      g.add(arc);
    });
    g.position.set(0, 0, -35);
    g.rotation.y = 0.15;
    g.visible = false;
    scene.add(g);
    return g;
  }

  function setStormSky() {
    scene.background = new THREE.Color(0x1a2838);
    scene.fog = new THREE.Fog(0x1a2838, 20, 70);
  }

  function setClearSky() {
    scene.background = new THREE.Color(0x7eb8e8);
    scene.fog = new THREE.Fog(0x9fd4f5, 45, 100);
  }

  function updateRain(dt) {
    if (!rainDrops?.length) return;
    rainDrops.forEach((drop) => {
      drop.position.y -= drop.userData.speed * dt;
      if (drop.position.y < -1) drop.position.y = 14 + Math.random() * 8;
    });
  }

  function updateNoahFlood(dt) {
    finaleTimer += dt;
    if (floodWater) {
      floodWater.position.y = Math.min(6.2, -2 + finaleTimer * 0.65);
    }
    updateRain(dt);
    const pct = Math.min(100, Math.floor((finaleTimer / 10) * 100));
    if (onProgress) onProgress(pct, 100);
    syncHudFlood(pct);
    if (finaleTimer > 10.5) finishNoahStep();
  }

  function syncHudFlood(pct) {
    const el = document.getElementById("mission-objective-count");
    if (el) el.textContent = pct >= 100 ? "Waters rose" : "Rising…";
    const fill = document.getElementById("mission-collect-fill");
    if (fill) fill.style.width = `${pct}%`;
  }

  function updateNoahRainbow(dt) {
    finaleTimer += dt;
    if (floodWater) {
      floodWater.position.y = Math.max(-2.5, 6.2 - finaleTimer * 0.9);
      floodWater.material.opacity = Math.max(0, 0.82 - finaleTimer * 0.12);
    }
    if (rainbowGroup && finaleTimer > 2) {
      rainbowGroup.visible = true;
      rainbowGroup.rotation.y = 0.15 + Math.sin(finaleTimer * 0.4) * 0.03;
    }
    const pct = Math.min(100, Math.floor((finaleTimer / 8) * 100));
    if (onProgress) onProgress(pct, 100);
    const el = document.getElementById("mission-objective-count");
    if (el) el.textContent = pct >= 100 ? "🌈 Promise!" : "Look up…";
    const fill = document.getElementById("mission-collect-fill");
    if (fill) fill.style.width = `${pct}%`;
    if (finaleTimer > 8.5) finishNoahStep();
  }

  function createInteractSite(icon) {
    const g = new THREE.Group();
    const altar = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x546e7a })
    );
    altar.position.y = 0.5;
    altar.castShadow = true;
    g.add(altar);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x4338ca,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.65,
      })
    );
    glow.position.y = 1.6;
    g.add(glow);
    g.userData.glow = glow;

    g.position.set(0, 0, 5);
    scene.add(g);
    return { mesh: g, x: 0, z: 5, icon };
  }

  function createGoliathEntity(name) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.75 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.5, 1.2), mat);
    body.position.y = 2.2;
    body.castShadow = true;
    g.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 12), mat);
    head.position.y = 4.3;
    head.castShadow = true;
    g.add(head);

    const helm = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.35, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x37474f })
    );
    helm.position.y = 4.85;
    g.add(helm);

    const spear = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 4.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x263238 })
    );
    spear.position.set(1.5, 2.8, 0);
    spear.rotation.z = -0.35;
    g.add(spear);

    g.position.set(18, 0, 0);
    scene.add(g);
    return { mesh: g, x: 18, z: 0, hp: 1, maxHp: 1, flash: 0, wobble: 0, name };
  }

  function spawnChips(x, y, z, n = 6) {
    for (let i = 0; i < n; i++) {
      const chip = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.06, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x8d6e63 })
      );
      chip.position.set(x, y + 1.5, z);
      chip.userData = {
        vx: (Math.random() - 0.5) * 8,
        vy: 3 + Math.random() * 4,
        vz: (Math.random() - 0.5) * 8,
        life: 0.5 + Math.random() * 0.3,
        spin: Math.random() * 4,
      };
      chip.castShadow = true;
      scene.add(chip);
      fxParticles.push(chip);
    }
  }

  function spawnProjectile(target) {
    const stone = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x78909c })
    );
    stone.position.copy(playerGroup.position);
    stone.position.y += 1.2;
    const dx = target.x - player.x;
    const dz = target.z - player.z;
    const len = Math.hypot(dx, dz) || 1;
    stone.userData = {
      vx: (dx / len) * 22,
      vz: (dz / len) * 22,
      vy: 6,
      life: 0.6,
    };
    scene.add(stone);
    projectiles.push(stone);
  }

  function isMobilePlay() {
    return (
      window.innerWidth <= 900 ||
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0
    );
  }

  function actRange() {
    return mode === "battle" ? ACT_RANGE_BATTLE : isMobilePlay() ? ACT_RANGE + 1.5 : ACT_RANGE;
  }

  function canInteractNow() {
    if (playerLocked) return false;
    return battleInRange() || distToTarget() <= actRange();
  }

  function getMobileActionUI() {
    if (mode === "gather") return { icon: "🪓", text: "CHOP", hint: "Walk to a tree" };
    if (mode === "work") {
      return requiredTool === "sling"
        ? { icon: "🎯", text: "SLING", hint: "Walk to the target" }
        : { icon: "🔨", text: "BUILD", hint: "Walk to the ark" };
    }
    if (mode === "battle") return { icon: "🪨", text: "THROW", hint: "Face Goliath" };
    if (mode === "noah_board") return { icon: "🚪", text: "ENTER", hint: "Walk to the ark ramp" };
    if (mode === "noah_flood" || mode === "noah_rainbow") return { icon: "🙏", text: "TRUST", hint: "Watch God's story" };
    if (mode === "interact") return { icon: "✨", text: "ACT", hint: "Walk to the light" };
    return { icon: "✨", text: "ACT", hint: "Move and explore" };
  }

  function updateMobileHud() {
    if (!mobileBound) return;
    const ui = getMobileActionUI();
    const ready = canInteractNow();
    const iconEl = document.getElementById("mobile-action-icon");
    const textEl = document.getElementById("mobile-action-text");
    const labelEl = document.getElementById("mobile-tap-label");
    const btn = document.getElementById("mobile-action-btn");
    const camHint = document.getElementById("mobile-camera-hint");
    if (iconEl) iconEl.textContent = ui.icon;
    if (textEl) textEl.textContent = ui.text;
    if (labelEl) {
      labelEl.textContent = ready
        ? `Tap screen or ${ui.text} to ${ui.text === "CHOP" ? "chop" : "act"}!`
        : ui.hint;
    }
    btn?.classList.toggle("mobile-action-ready", ready);
    if (camHint) camHint.style.opacity = camDrag ? "0.35" : "1";
  }

  function tryTapAction() {
    const btn = document.getElementById("mobile-action-btn");
    btn?.classList.add("mobile-action-flash");
    setTimeout(() => btn?.classList.remove("mobile-action-flash"), 220);
    trySpaceAction();
  }

  function getInput() {
    let dx = touchInput?.dx || 0;
    let dz = touchInput?.dz || 0;
    if (keys.KeyW || keys.ArrowUp) dz -= 1;
    if (keys.KeyS || keys.ArrowDown) dz += 1;
    if (keys.KeyA || keys.ArrowLeft) dx -= 1;
    if (keys.KeyD || keys.ArrowRight) dx += 1;
    const len = Math.hypot(dx, dz);
    if (len > 1) {
      dx /= len;
      dz /= len;
    }
    return { dx, dz };
  }

  function getActiveTool() {
    return document.querySelector(".tool-btn.active")?.dataset?.tool || requiredTool;
  }

  function distToTarget() {
    if (mode === "gather") {
      let best = Infinity;
      let id = null;
      for (const t of trees) {
        if (t.stump) continue;
        const d = Math.hypot(player.x - t.x, player.z - t.z);
        if (d < best) {
          best = d;
          id = t.id;
        }
      }
      nearTarget = id;
      return best;
    }
    if (mode === "work" && workSite) {
      nearTarget = "work";
      return Math.hypot(player.x - workSite.x, player.z - workSite.z);
    }
    if (mode === "interact" && interactSite) {
      nearTarget = "interact";
      return Math.hypot(player.x - interactSite.x, player.z - interactSite.z);
    }
    if (mode === "battle" && goliath && goliath.hp > 0) {
      nearTarget = "goliath";
      return Math.hypot(player.x - goliath.x, player.z - goliath.z);
    }
    if (mode === "noah_board" && arkSite) {
      nearTarget = "ark";
      return Math.hypot(player.x - arkSite.x, player.z - arkSite.z);
    }
    nearTarget = null;
    return Infinity;
  }

  function battleInRange() {
    return mode === "battle" && distToTarget() <= ACT_RANGE_BATTLE;
  }

  function bumpProgress() {
    if (onProgress) onProgress(progress, progressTarget);
    if (progress >= progressTarget && onComplete) onComplete();
  }

  function setTreeStump(tree) {
    tree.stump = true;
    tree.mesh.children.forEach((c, i) => {
      if (i > 0) c.visible = false;
    });
    const stump = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x4e342e })
    );
    stump.position.y = 0.18;
    tree.mesh.add(stump);
  }

  function applyActionHit() {
    const tool = getActiveTool();

    if (mode === "gather") {
      const tree = trees.find((t) => t.id === nearTarget && !t.stump);
      if (!tree) return;
      tree.hp -= 1;
      tree.wobble = 1;
      tree.mesh.rotation.z = Math.sin(gameTime * 20) * 0.06;
      spawnChips(tree.x, 0, tree.z, 5);
      if (tree.hp <= 0) {
        setTreeStump(tree);
        progress += 1;
        bumpProgress();
      }
      return;
    }

    if (mode === "work" && workSite) {
      workSite.buildH = (workSite.buildH || 0) + 1;
      if (workSite.mesh.arkWalls) {
        const idx = Math.min(workSite.mesh.arkWalls.length - 1, Math.floor(progress));
        workSite.mesh.arkWalls[idx].visible = true;
        workSite.mesh.arkWalls[idx].position.y = 0.5 + idx * 0.55;
      }
      spawnChips(workSite.x, 0, workSite.z, tool === "sling" ? 3 : 5);
      progress += 1;
      bumpProgress();
      return;
    }

    if (mode === "battle" && goliath && goliath.hp > 0) {
      goliath.hp -= 1;
      goliath.flash = 1;
      goliath.wobble = 1;
      goliath.mesh.children[0].material.emissive = new THREE.Color(0xff1744);
      goliath.mesh.children[0].material.emissiveIntensity = 0.6;
      spawnChips(goliath.x, 0, goliath.z, 4);
      progress += 1;
      bumpProgress();
      return;
    }

    if (mode === "interact" && interactSite) {
      const glow = interactSite.mesh.userData.glow;
      if (glow) glow.material.emissiveIntensity = 1.4;
      progress += 1;
      bumpProgress();
      return;
    }

    if (mode === "noah_board" && arkSite) {
      progress += 1;
      playerLocked = true;
      if (playerGroup) playerGroup.position.set(arkSite.x, 2.5, arkSite.z + 1);
      setCinematic("You are safe inside the ark. God will protect you.", true);
      setTimeout(() => finishNoahStep(), 1800);
    }
  }

  function startPlayerAction() {
    const tool = getActiveTool();
    if (requiredTool && tool !== requiredTool) {
      setTip(TOOL_HINT_WRONG[requiredTool] || "Select the right tool.");
      return;
    }
    if (!battleInRange() && distToTarget() > actRange()) return;

    if (mode === "noah_board") {
      playerAction = { type: "board", t: 0, hit: false };
      actionCooldown = ACTION_DUR;
      return;
    }

    const act = TOOL_ACTION[tool] || TOOL_ACTION.hammer;
    playerAction = { type: act.type, t: 0, hit: false };
    actionCooldown = ACTION_DUR;
    if (act.type === "sling" && goliath) spawnProjectile(goliath);
  }

  function trySpaceAction() {
    if (actionCooldown > 0 || playerAction) return;
    if (mode === "noah_flood" || mode === "noah_rainbow") {
      if (finaleTimer > 3) finishNoahStep();
      return;
    }
    if (mode === "noah_board") {
      if (distToTarget() <= actRange()) startPlayerAction();
      return;
    }
    startPlayerAction();
  }

  function syncPlayerVisual() {
    if (!playerGroup) return;
    playerGroup.position.set(player.x, 0, player.z);

    const moving = Math.hypot(player.vx, player.vz) > 0.4;
    if (moving) {
      playerGroup.rotation.y = player.rotY + CHAR_FACE_OFFSET;
    } else if (camera3d) {
      const awayX = player.x - camera3d.position.x;
      const awayZ = player.z - camera3d.position.z;
      playerGroup.rotation.y = Math.atan2(awayX, awayZ) + CHAR_FACE_OFFSET;
    } else {
      playerGroup.rotation.y = player.rotY + CHAR_FACE_OFFSET;
    }

    if (toolMesh) {
      const tool = getActiveTool();
      if (tool === "hammer") toolMesh.material.color.setHex(0x9e9e9e);
      else if (tool === "sling") toolMesh.material.color.setHex(0x795548);
      else toolMesh.material.color.setHex(0x8d6e63);
    }

    if (playerAction) {
      const p = playerAction.t / ACTION_DUR;
      if (playerAction.type === "chop" || playerAction.type === "hammer") {
        toolMesh.rotation.x = -0.4 - Math.sin(p * Math.PI) * 1.4;
        playerGroup.position.y = Math.sin(p * Math.PI) * 0.15;
      } else if (playerAction.type === "sling") {
        toolMesh.rotation.z = -0.4 + Math.sin(p * Math.PI * 2) * 0.8;
      }
    } else {
      toolMesh.rotation.x = -0.4;
      playerGroup.position.y = 0;
    }
  }

  function updateHighlight() {
    if (!highlightRing) return;
    let show = false;
    let px = 0;
    let pz = 0;

    if (mode === "noah_board" && arkSite && distToTarget() <= actRange()) {
      show = true;
      px = arkSite.x;
      pz = arkSite.z;
    } else if (mode === "gather" && nearTarget != null) {
      const t = trees.find((tr) => tr.id === nearTarget);
      if (t && distToTarget() <= actRange()) {
        show = true;
        px = t.x;
        pz = t.z;
      }
    } else if (mode === "work" && workSite && distToTarget() <= actRange()) {
      show = true;
      px = workSite.x;
      pz = workSite.z;
    } else if (mode === "interact" && interactSite && distToTarget() <= actRange()) {
      show = true;
      px = interactSite.x;
      pz = interactSite.z;
    } else if (mode === "battle" && goliath && battleInRange()) {
      show = true;
      px = goliath.x;
      pz = goliath.z;
      highlightRing.material.color.setHex(0xe53935);
    } else {
      highlightRing.material.color.setHex(0x14b8a6);
    }

    highlightRing.visible = show && !playerAction;
    if (show) highlightRing.position.set(px, 0.08, pz);
  }

  function moveDirFromCamera(dx, dz) {
    const sin = Math.sin(camYaw);
    const cos = Math.cos(camYaw);
    // Camera sits behind the player; W should walk into the scene (away from camera).
    const fwdX = -sin;
    const fwdZ = -cos;
    const rightX = cos;
    const rightZ = -sin;
    const mx = fwdX * -dz + rightX * dx;
    const mz = fwdZ * -dz + rightZ * dx;
    const len = Math.hypot(mx, mz) || 1;
    return { mx: mx / len, mz: mz / len };
  }

  function updatePlayer(dt) {
    if (playerLocked) {
      player.vx = 0;
      player.vz = 0;
      syncPlayerVisual();
      return;
    }
    if (playerAction) {
      player.vx *= 0.5;
      player.vz *= 0.5;
    } else {
      const { dx, dz } = getInput();
      if (dx !== 0 || dz !== 0) {
        const { mx, mz } = moveDirFromCamera(dx, dz);
        player.vx = mx * SPEED;
        player.vz = mz * SPEED;
        player.rotY = Math.atan2(mx, mz);
      } else {
        player.vx *= 0.72;
        player.vz *= 0.72;
      }
    }

    let nx = player.x + player.vx * dt;
    let nz = player.z + player.vz * dt;
    const bound = WORLD / 2 - 3;
    nx = Math.max(-bound, Math.min(bound, nx));
    nz = Math.max(-bound, Math.min(bound, nz));

    if (mode === "gather") {
      for (const t of trees) {
        if (t.stump) continue;
        if (Math.hypot(nx - t.x, nz - t.z) < 2.2) {
          nx = player.x;
          nz = player.z;
          break;
        }
      }
    }

    player.x = nx;
    player.z = nz;
    syncPlayerVisual();
  }

  function rotateCameraYaw(delta) {
    camYaw = ((camYaw + delta) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  }

  function rotateCameraPitch(delta) {
    camPitch = Math.max(CAM_PITCH_MIN, Math.min(CAM_PITCH_MAX, camPitch + delta));
  }

  function updateCamera(dt) {
    if (keys.KeyQ) rotateCameraYaw(-CAM_ROT_SPEED * dt);
    if (keys.KeyE) rotateCameraYaw(CAM_ROT_SPEED * dt);
    if (keys.KeyR) rotateCameraPitch(CAM_ROT_SPEED * 0.6 * dt);
    if (keys.KeyF) rotateCameraPitch(-CAM_ROT_SPEED * 0.6 * dt);

    const lookY = 1.55;
    const cosP = Math.cos(camPitch);
    const offX = camDistance * Math.sin(camYaw) * cosP;
    const offZ = camDistance * Math.cos(camYaw) * cosP;
    const offY = camDistance * Math.sin(camPitch) + 1.2;

    const targetX = player.x + offX;
    const targetY = offY;
    const targetZ = player.z + offZ;
    const lerp = Math.min(1, dt * 8);
    camera3d.position.x += (targetX - camera3d.position.x) * lerp;
    camera3d.position.y += (targetY - camera3d.position.y) * lerp;
    camera3d.position.z += (targetZ - camera3d.position.z) * lerp;
    camera3d.lookAt(player.x, lookY, player.z);
  }

  function update(dt) {
    gameTime += dt;
    actionCooldown = Math.max(0, actionCooldown - dt);

    if (playerAction) {
      playerAction.t += dt;
      const p = playerAction.t / ACTION_DUR;
      if (!playerAction.hit && p >= 0.38) {
        playerAction.hit = true;
        applyActionHit();
      }
      if (playerAction.t >= ACTION_DUR) playerAction = null;
    }

    updatePlayer(dt);
    updateCamera(dt);
    updateHighlight();

    trees.forEach((t) => {
      if (t.wobble > 0) {
        t.wobble = Math.max(0, t.wobble - dt * 4);
        if (t.wobble <= 0) t.mesh.rotation.z = 0;
      }
    });

    if (goliath) {
      if (goliath.flash > 0) {
        goliath.flash = Math.max(0, goliath.flash - dt * 3);
        if (goliath.flash <= 0 && goliath.mesh.children[0].material) {
          goliath.mesh.children[0].material.emissiveIntensity = 0;
        }
      }
      if (goliath.wobble > 0) {
        goliath.wobble = Math.max(0, goliath.wobble - dt * 2);
        goliath.mesh.rotation.z = Math.sin(gameTime * 18) * goliath.wobble * 0.08;
      }
      const scale = 0.85 + (goliath.hp / goliath.maxHp) * 0.15;
      goliath.mesh.scale.setScalar(scale);
    }

    if (interactSite?.mesh?.userData?.glow) {
      interactSite.mesh.userData.glow.rotation.y += dt * 1.2;
    }

    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      const u = p.userData;
      u.life -= dt;
      p.position.x += u.vx * dt;
      p.position.y += u.vy * dt;
      p.position.z += u.vz * dt;
      u.vy -= 12 * dt;
      p.rotation.y += u.spin * dt;
      if (u.life <= 0) {
        scene.remove(p);
        fxParticles.splice(i, 1);
      }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      const u = p.userData;
      u.life -= dt;
      p.position.x += u.vx * dt;
      p.position.y += u.vy * dt;
      p.position.z += u.vz * dt;
      u.vy -= 14 * dt;
      if (u.life <= 0) {
        scene.remove(p);
        projectiles.splice(i, 1);
      }
    }

    if (mode === "noah_flood") updateNoahFlood(dt);
    if (mode === "noah_rainbow") updateNoahRainbow(dt);

    if (mobileBound) updateMobileHud();

    if (keys.Space && !keys._spaceLock) {
      keys._spaceLock = true;
      trySpaceAction();
    }
    if (!keys.Space) keys._spaceLock = false;
  }

  function loop() {
    if (!running) return;
    const dt = Math.min(0.033, clock.getDelta());
    update(dt);
    renderer.render(scene, camera3d);
    rafId = requestAnimationFrame(loop);
  }

  function onKeyDown(e) {
    if (!running) return;
    const codes = [
      "Space",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyQ",
      "KeyE",
      "KeyR",
      "KeyF",
    ];
    if (codes.includes(e.code)) {
      keys[e.code] = true;
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
      if (["KeyQ", "KeyE", "KeyR", "KeyF"].includes(e.code)) e.preventDefault();
    }
  }

  function onPointerDown(e) {
    if (!running || e.button !== 0 || e.target !== canvas) return;
    if (e.target.closest && e.target.closest("#mobile-controls")) return;

    canvasPointer = {
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      moved: false,
      id: e.pointerId,
      canCam: !isMobilePlay() || e.clientX > window.innerWidth * 0.3,
    };

    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    if (!isMobilePlay()) {
      camDrag = true;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("cam-dragging");
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!running || !canvasPointer || canvasPointer.id !== e.pointerId) return;

    const dx = e.clientX - canvasPointer.x;
    const dy = e.clientY - canvasPointer.y;
    if (!canvasPointer.moved && Math.hypot(dx, dy) > TAP_MOVE_PX) {
      canvasPointer.moved = true;
      if (canvasPointer.canCam) {
        camDrag = true;
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (_) {
          /* ignore */
        }
        canvas.classList.add("cam-dragging");
      }
    }

    if (camDrag) {
      const mdx = e.clientX - lastPointerX;
      const mdy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      const sens = isMobilePlay() ? CAM_DRAG_SENS * 1.4 : CAM_DRAG_SENS;
      rotateCameraYaw(-mdx * sens);
      rotateCameraPitch(-mdy * sens);
    }
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (canvasPointer && canvasPointer.id === e.pointerId) {
      const elapsed = performance.now() - canvasPointer.t;
      const dist = Math.hypot(e.clientX - canvasPointer.x, e.clientY - canvasPointer.y);
      if (isMobilePlay() && !canvasPointer.moved && dist < 24 && elapsed < TAP_MAX_MS) {
        tryTapAction();
      }
      canvasPointer = null;
    }
    camDrag = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
    canvas.classList.remove("cam-dragging");
  }

  function onWheel(e) {
    if (!running) return;
    e.preventDefault();
    camDistance = Math.max(CAM_DIST_MIN, Math.min(CAM_DIST_MAX, camDistance + e.deltaY * 0.012));
  }

  function joyRadius() {
    return isMobilePlay() ? JOY_RADIUS_MOBILE : JOY_RADIUS;
  }

  function updateJoystickPointer(e) {
    const stick = document.getElementById("joystick-stick");
    if (!stick || !joyCenter) return;
    const radius = joyRadius();
    let ox = e.clientX - joyCenter.x;
    let oy = e.clientY - joyCenter.y;
    const len = Math.hypot(ox, oy) || 1;
    if (len > radius) {
      ox = (ox / len) * radius;
      oy = (oy / len) * radius;
    }
    stick.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
    if (!touchInput) touchInput = { dx: 0, dz: 0 };
    touchInput.dx = ox / radius;
    touchInput.dz = oy / radius;
  }

  function resetJoystick() {
    joyActive = false;
    joyPointerId = null;
    if (touchInput) {
      touchInput.dx = 0;
      touchInput.dz = 0;
    }
    const stick = document.getElementById("joystick-stick");
    if (stick) stick.style.transform = "translate(-50%, -50%)";
  }

  function onJoyDown(e) {
    if (!running) return;
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById("joystick-zone");
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    joyActive = true;
    joyPointerId = e.pointerId;
    zone.setPointerCapture(e.pointerId);
    updateJoystickPointer(e);
  }

  function onJoyMove(e) {
    if (!joyActive || e.pointerId !== joyPointerId) return;
    e.preventDefault();
    updateJoystickPointer(e);
  }

  function onJoyUp(e) {
    if (e.pointerId !== joyPointerId) return;
    resetJoystick();
    const zone = document.getElementById("joystick-zone");
    try {
      zone?.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  function onMobileActionDown(e) {
    if (!running) return;
    e.preventDefault();
    e.stopPropagation();
    tryTapAction();
  }

  function onMobileActionUp(e) {
    e.preventDefault();
  }

  function onZoomInClick(e) {
    e.preventDefault();
    camDistance = Math.max(CAM_DIST_MIN, camDistance - 1.8);
  }

  function onZoomOutClick(e) {
    e.preventDefault();
    camDistance = Math.min(CAM_DIST_MAX, camDistance + 1.8);
  }

  function setupMobileControls() {
    const panel = document.getElementById("mobile-controls");
    const zone = document.getElementById("joystick-zone");
    const actionBtn = document.getElementById("mobile-action-btn");
    const zoomIn = document.getElementById("mobile-zoom-in");
    const zoomOut = document.getElementById("mobile-zoom-out");
    if (!panel || !zone || !actionBtn) return;

    touchInput = { dx: 0, dz: 0 };
    mobileBound = true;
    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("mobile-play");

    zone.addEventListener("pointerdown", onJoyDown);
    zone.addEventListener("pointermove", onJoyMove);
    zone.addEventListener("pointerup", onJoyUp);
    zone.addEventListener("pointercancel", onJoyUp);
    actionBtn.addEventListener("pointerdown", onMobileActionDown);
    actionBtn.addEventListener("pointerup", onMobileActionUp);
    actionBtn.addEventListener("pointercancel", onMobileActionUp);
    actionBtn.addEventListener("pointerleave", onMobileActionUp);

    zoomIn?.addEventListener("click", onZoomInClick);
    zoomOut?.addEventListener("click", onZoomOutClick);
  }

  function teardownMobileControls() {
    const panel = document.getElementById("mobile-controls");
    const zone = document.getElementById("joystick-zone");
    const actionBtn = document.getElementById("mobile-action-btn");
    const zoomIn = document.getElementById("mobile-zoom-in");
    const zoomOut = document.getElementById("mobile-zoom-out");

    if (zone && mobileBound) {
      zone.removeEventListener("pointerdown", onJoyDown);
      zone.removeEventListener("pointermove", onJoyMove);
      zone.removeEventListener("pointerup", onJoyUp);
      zone.removeEventListener("pointercancel", onJoyUp);
    }
    if (actionBtn && mobileBound) {
      actionBtn.removeEventListener("pointerdown", onMobileActionDown);
      actionBtn.removeEventListener("pointerup", onMobileActionUp);
      actionBtn.removeEventListener("pointercancel", onMobileActionUp);
      actionBtn.removeEventListener("pointerleave", onMobileActionUp);
    }
    zoomIn?.removeEventListener("click", onZoomInClick);
    zoomOut?.removeEventListener("click", onZoomOutClick);

    resetJoystick();
    touchInput = null;
    canvasPointer = null;
    camDrag = false;
    mobileBound = false;
    panel?.classList.add("hidden");
    panel?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mobile-play");
  }

  function onKeyUp(e) {
    keys[e.code] = false;
  }

  function updateControlHint() {
    const el = document.getElementById("jungle-controls-hint");
    if (!el) return;
    const tool =
      TOOL_ACTION[requiredTool] ||
      (mode === "battle" ? TOOL_ACTION.sling : TOOL_ACTION.axe);
    let extra = "trees";
    if (mode === "work") extra = "the build site";
    if (mode === "interact") extra = "the shrine";
    if (mode === "battle") extra = "Goliath";
    if (mode === "noah_board") {
      el.innerHTML = `<span>WASD</span> walk to the <span>ark ramp</span> · <span>SPACE</span> to go aboard`;
      return;
    }
    if (mode === "noah_flood") {
      el.innerHTML = `The flood is rising… <span>Trust God</span> · <span>SPACE</span> to continue when ready`;
      return;
    }
    if (mode === "noah_rainbow") {
      el.innerHTML = `Look at God's <span>rainbow</span> · <span>SPACE</span> when you see His promise`;
      return;
    }
    if (isMobilePlay()) {
      el.innerHTML = `<span>Joystick</span> move · <span>tap tree</span> or <span>CHOP</span> button · <span>drag</span> to look`;
      return;
    }
    el.innerHTML =
      `<span>WASD</span> move · <span>drag</span> or <span>Q / E</span> rotate 360° · <span>scroll</span> zoom · <span>SPACE</span> — ${tool.label.replace("SPACE ", "")} near ${extra}`;
  }

  function aimCameraAt(x, z) {
    camYaw = Math.atan2(x - player.x, z - player.z);
    camPitch = 0.42;
  }

  function initThree() {
    if (!window.THREE) return false;
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera3d = new THREE.PerspectiveCamera(52, 1, 0.2, 150);
    camera3d.position.set(0, 8, 14);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    return true;
  }

  function disposeThree() {
    if (renderer) renderer.dispose();
    clearScene();
    renderer = null;
    scene = null;
    clock = null;
    camera3d = null;
  }

  return {
    async start(options) {
      stop();
      if (!window.THREE) {
        console.error("Three.js not loaded");
        return;
      }

      canvas = document.getElementById("jungle-canvas");
      if (!canvas) return;
      hintEl = document.getElementById("jungle-controls-hint");

      mode = options.mode || "gather";
      theme = options.theme || "jungle";
      requiredTool = options.requiredTool || "axe";
      progressTarget = options.target || 10;
      progress = options.progressStart || 0;
      onProgress = options.onProgress;
      onComplete = options.onComplete;

      if (!initThree()) return;
      charTex = await loadCharTexture(options.characterSprite);

      createSky(theme);
      setupLights();
      createGround(theme);
      createHighlight();
      createPlayer();

      player = { x: 0, z: 8, vx: 0, vz: 0, rotY: 0 };
      camYaw = Math.PI;
      camPitch = 0.42;
      camDistance = 12;
      camDrag = false;
      keys = {};
      fxParticles = [];
      projectiles = [];
      actionCooldown = 0;
      playerAction = null;
      gameTime = 0;
      trees = [];
      workSite = null;
      interactSite = null;
      goliath = null;

      if (mode === "gather") {
        trees = seedTrees(Math.max(progressTarget + 18, 52));
        seedDecorTrees(38, trees);
        setTip("Walk to a tree — Axe equipped — press SPACE to chop.");
      } else if (mode === "work") {
        workSite = createWorkSite(options.siteLabel || "ARK");
        workSite.x = 0;
        workSite.z = -4;
        workSite.mesh.position.set(0, 0, -4);
        trees = seedTrees(28);
        seedDecorTrees(32, trees);
        player.x = -6;
        player.z = 4;
        setTip(
          requiredTool === "sling"
            ? "Aim at the target — Sling equipped — press SPACE."
            : "Walk to the ark — Hammer equipped — press SPACE to build."
        );
      } else if (mode === "interact") {
        interactSite = createInteractSite(options.interactIcon || "🙏");
        trees = seedTrees(22);
        seedDecorTrees(28, trees);
        player.x = 0;
        player.z = 10;
        setTip("Walk to the glowing shrine — press SPACE when close.");
      } else if (mode === "noah_board") {
        progressTarget = 1;
        arkSite = createFullArk();
        trees = seedTrees(18);
        seedDecorTrees(28, trees);
        player.x = 0;
        player.z = 10;
        aimCameraAt(arkSite.x, arkSite.z);
        setCinematic(options.cinematicMessage || "Go aboard the ark before the flood!", true);
        setTip("Walk to the ark ramp and press SPACE to enter.");
      } else if (mode === "noah_flood") {
        progressTarget = 100;
        progress = 0;
        playerLocked = true;
        arkSite = createFullArk();
        arkSite.mesh.position.y = 2.8;
        floodWater = createFloodWater();
        rainDrops = createRain();
        setStormSky();
        player.x = 0;
        player.z = -6;
        if (playerGroup) playerGroup.position.set(0, 3.2, -5);
        finaleTimer = 0;
        finaleDone = false;
        camPitch = 0.55;
        camDistance = 16;
        setCinematic(options.cinematicMessage || "The flood has come! Trust God in the ark.", true);
        setTip("Watch the waters rise. God keeps Noah safe.");
      } else if (mode === "noah_rainbow") {
        progressTarget = 100;
        progress = 0;
        playerLocked = true;
        arkSite = createFullArk();
        arkSite.mesh.position.y = 1.5;
        floodWater = createFloodWater();
        floodWater.position.y = 5;
        rainbowGroup = createRainbowArc();
        setClearSky();
        player.x = 0;
        player.z = -5;
        if (playerGroup) playerGroup.position.set(0, 2.8, -4);
        finaleTimer = 0;
        finaleDone = false;
        camPitch = 0.7;
        camYaw = 0;
        camDistance = 18;
        setCinematic(options.cinematicMessage || "God's rainbow — a promise forever!", true);
        setTip("The waters go down. God keeps His promise!");
      } else if (mode === "battle") {
        seedDecorTrees(24, []);
        const hitsLeft = Math.max(0, progressTarget - progress);
        goliath = createGoliathEntity(options.enemyName || "GOLIATH");
        goliath.hp = hitsLeft;
        goliath.maxHp = progressTarget;
        player.x = -12;
        player.z = 0;
        player.rotY = Math.PI / 2;
        aimCameraAt(goliath.x, goliath.z);
        setTip("Sling equipped! Press SPACE to strike Goliath from range.");
      }

      syncPlayerVisual();
      updateControlHint();
      setupRenderer();
      updateCamera(1);

      running = true;
      window.addEventListener("resize", setupRenderer);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("wheel", onWheel, { passive: false });
      canvas.classList.remove("hidden");
      if (hintEl) hintEl.classList.remove("hidden");
      document.getElementById("mission-scene")?.classList.add("mission-scene-3d");
      if (isMobilePlay()) {
        setupMobileControls();
        updateMobileHud();
      } else {
        teardownMobileControls();
      }

      rafId = requestAnimationFrame(loop);
    },

    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setupRenderer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (canvas) {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("wheel", onWheel);
        canvas.classList.add("hidden");
        canvas.classList.remove("cam-dragging");
      }
      if (hintEl) hintEl.classList.add("hidden");
      document.getElementById("mission-scene")?.classList.remove("mission-scene-3d");
      teardownMobileControls();
      disposeThree();
      playerAction = null;
      setCinematic("", false);
    },

    isRunning() {
      return running;
    },
  };
})();
