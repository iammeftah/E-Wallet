// Import necessary Three.js modules
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-wallet-orbit',
  standalone:false,
  templateUrl: './wallet-orbit.component.html',
  styleUrls: ['./wallet-orbit.component.css']
})
export class WalletOrbitComponent implements AfterViewInit {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private wallet!: THREE.Mesh;
  private particles!: THREE.Points;

  // Adjust the aspect ratio based on canvas size
  private get aspectRatio() {
    const canvas = this.canvasRef.nativeElement;
    return canvas.clientWidth / canvas.clientHeight;
  }

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 1000);
    this.camera.position.z = 15;

    // Create a 3D wallet
    const walletGeometry = new THREE.BoxGeometry(4, 3, 1);
    const walletMaterial = new THREE.MeshStandardMaterial({ color: 0x007bff, metalness: 0.5, roughness: 0.8 });
    this.wallet = new THREE.Mesh(walletGeometry, walletMaterial);
    this.scene.add(this.wallet);

    // Add particles orbiting the wallet in atom-like rings
    const particleCount = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 4; // Bigger radius for particles
      positions[i * 3] = Math.cos(angle) * radius; // x
      positions[i * 3 + 1] = Math.sin(angle) * radius; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3; // z for some depth
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(ambientLight, directionalLight);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Rotate the wallet
    this.wallet.rotation.y += 0.01;

    // Rotate particles in atom-like orbit
    this.particles.rotation.y += 0.005;
    this.particles.rotation.x += 0.003;

    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;

    // Update camera aspect ratio and renderer size
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
}
