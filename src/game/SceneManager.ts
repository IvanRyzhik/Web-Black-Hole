import * as THREE from 'three';
import type { SpawnedElement } from '@/game/Decomposer/types';
import { clamp } from '@/shared/utils/clamp';
import { getViewportSize } from '@/shared/utils/dom';

export class SceneManager {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private meshes = new Map<string, THREE.Mesh>();
  private opacity = 0.7;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const { width, height } = getViewportSize();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111118);

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    this.camera = new THREE.OrthographicCamera(
      -halfWidth,
      halfWidth,
      halfHeight,
      -halfHeight,
      0.1,
      2000,
    );
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    const directional = new THREE.DirectionalLight(0xffffff, 0.65);
    directional.position.set(0, 0, 1);
    this.scene.add(ambient, directional);

    this.applyOpacity();
    window.addEventListener('resize', this.handleResize);
  }

  setOpacity(opacity: number): void {
    this.opacity = clamp(opacity, 0, 1);
    this.applyOpacity();
  }

  spawnElements(elements: SpawnedElement[]): void {
    for (const element of elements) {
      const mesh = this.createMesh(element);
      this.meshes.set(element.id, mesh);
      this.scene.add(mesh);
    }
  }

  removeElement(id: string): void {
    const mesh = this.meshes.get(id);
    if (!mesh) {
      return;
    }

    this.scene.remove(mesh);
    mesh.geometry.dispose();
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose();
    }
    this.meshes.delete(id);
  }

  updateMeshPosition(id: string, x: number, y: number, depth = 0): void {
    const mesh = this.meshes.get(id);
    if (!mesh) {
      return;
    }

    const { width, height } = getViewportSize();
    mesh.position.set(x - width / 2, height / 2 - y, depth);
  }

  renderHole(x: number, y: number, radius: number, _progress: number): void {
    let holeMesh = this.scene.getObjectByName('hole') as THREE.Mesh | undefined;

    if (!holeMesh) {
      const geometry = new THREE.RingGeometry(radius * 0.85, radius, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0xd1d5db,
        side: THREE.DoubleSide,
      });
      holeMesh = new THREE.Mesh(geometry, material);
      holeMesh.name = 'hole';

      const coreGeometry = new THREE.CircleGeometry(radius * 0.85, 64);
      const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.name = 'hole-core';
      holeMesh.add(core);

      this.scene.add(holeMesh);
    }

    const { width, height } = getViewportSize();
    holeMesh.position.set(x - width / 2, height / 2 - y, 10);
    holeMesh.scale.setScalar(radius / 24);
  }

  start(): void {
    const tick = () => {
      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(tick);
    };

    if (this.animationId === null) {
      tick();
    }
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);

    for (const mesh of this.meshes.values()) {
      mesh.geometry.dispose();
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose();
      }
    }

    this.meshes.clear();
    this.renderer.dispose();
  }

  private createMesh(element: SpawnedElement): THREE.Mesh {
    let geometry: THREE.BufferGeometry;

    switch (element.shape) {
      case 'pyramid':
        geometry = new THREE.ConeGeometry(
          Math.max(4, element.width / 2),
          Math.max(6, element.height),
          4,
        );
        break;
      case 'layer':
        geometry = new THREE.BoxGeometry(
          element.width,
          element.height,
          Math.max(2, element.height / 2),
        );
        break;
      default:
        geometry = new THREE.BoxGeometry(
          element.width,
          element.height,
          Math.min(element.width, element.height),
        );
        break;
    }

    const color =
      element.kind === 'text'
        ? 0x60a5fa
        : element.kind === 'button'
          ? 0xf59e0b
          : 0x34d399;
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.55,
      metalness: 0.05,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.updateMeshPosition(element.id, element.x, element.y);
    return mesh;
  }

  private applyOpacity(): void {
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.setHex(0x111118);
      (this.scene.background as THREE.Color).setScalar(1);
    }

    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.material) {
        return;
      }

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        material.transparent = true;
        material.opacity = this.opacity;
      }
    });

    this.canvas.style.opacity = String(this.opacity);
  }

  private handleResize = (): void => {
    const { width, height } = getViewportSize();
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.camera.left = -halfWidth;
    this.camera.right = halfWidth;
    this.camera.top = halfHeight;
    this.camera.bottom = -halfHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };
}
