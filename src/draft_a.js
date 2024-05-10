import 'swiper/css';
import 'swiper/css/pagination';

import '../public/css/normalize.css';
import '../public/css/draft_common.scss';
import '../public/css/draft_a.scss';

// import * as THREE from 'three';
import gsap from 'gsap';
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
Swiper.use([Autoplay, Pagination]);

//---------------------------

// const mainBanner = new Swiper('.banner-wrap', {
//   speed: 400,
//   autoplay: {
//     delay: 3000,
//     disableOnInteraction: false,
//   },
//   loop: true,
//   pagination: {
//     el: ".swiper-pagination",
//   },
// });

//---------------------------

const AppHeader = document.querySelector('.app-header');

window.addEventListener('scroll', function(){
  if(window.scrollY > 400){
    AppHeader.classList.add('active');
  }else{
    AppHeader.classList.remove('active');
  }
});

const ModalOpen = document.querySelector('.block-3-wrap');
const BackDrop = document.querySelector('.backdrop');
const ModalWrap = document.querySelector('.modal-wrap');
const ModalInner = document.querySelector('.modal-inner');

BackDrop.addEventListener('click', function(){
  ModalWrap.classList.add('hidden');
  document.body.classList.remove('scrollstop');
});

ModalInner.addEventListener('click', function(){
  ModalWrap.classList.add('hidden');
  document.body.classList.remove('scrollstop');
});

ModalOpen.addEventListener('click', function(){
  ModalWrap.classList.remove('hidden');
  document.body.classList.add('scrollstop');
});
//---------------------------


class Cube extends THREE.Object3D {
  constructor(size) {
    super();
    this.colors = [0x15ECAC, 0xFF9E2D, 0xff0096];

    this.geom = new THREE.BoxGeometry(size, size, size);

    this.mat = new THREE.MeshBasicMaterial({
      vertexColors: THREE.FaceColors,
      wireframe: false
    });

    for (let i = 0; i < this.geom.faces.length; i++) {
      this.geom.faces[i].color.setHex(this.colors[~~(i / 4)]);
    }
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.add(this.mesh);
  }
  update() {
    this.mesh.geometry.colorsNeedUpdate = true;
  }
}

class Webgl {
  constructor(eleWidth, eleHeight) {
    
    this.scene = new THREE.Scene();
    this.aspectRatio = eleWidth/eleHeight;
    this.rotationMode = true;
    this.distance = 100;
    this.camera = new THREE.OrthographicCamera(- this.distance * this.aspectRatio, this.distance * this.aspectRatio, this.distance, - this.distance, 1, 1000 );
    this.camera.position.set(0, 0, 150)
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
    this.renderer.setSize(eleWidth, eleHeight);
    this.animationIntroDone = false;

    this.cubesGroup = new THREE.Object3D();

    this.cubes = [];
    this.cubeSize = 12;
    this.cubeOffset = 12;

    this.drawCubes()
    this.animation();

  }
  
  drawCubes() {
    for ( let i = -2; i <= 1; i ++ ) {
      for ( let j = -2; j <= 1; j ++ ) {
        for ( let k = -2; k <= 1; k ++ ) {
          const cube = new Cube(this.cubeSize);
          cube.position.x = i * this.cubeSize;
          cube.position.y = k * this.cubeSize;
          cube.position.z = j * this.cubeSize;
          this.cubes.push(cube);
          this.cubesGroup.add(cube);
        }
      }
    }
    this.scene.add(this.cubesGroup);
  }

  resize(width, height) {
    this.aspectRatio = width/height;
    this.camera = new THREE.OrthographicCamera(- this.distance * this.aspectRatio, this.distance * this.aspectRatio, this.distance, - this.distance, 1, 1000 );
    this.camera.position.set(0, 0, 150);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  animation() {
    const initRotationDuration = 1.7;
    const halfLength = Math.floor(this.cubes.length / 2);
    const staggerOffset = 0.01;
    const loopDelay = 2.5;

    const groupTl = gsap.timeline();

    groupTl
      .to(this.cubesGroup.rotation, initRotationDuration, {x: 2 * Math.PI + 0.6, y: 2 * Math.PI - 0.8, 
      });

    // Fist half
    for (let i = 0; i < this.cubes.length / 2 - 1; i++) {
      const newX = (this.cubes[i].position.x + this.cubeOffset) * 2.5;
      const newY = (this.cubes[i].position.y + this.cubeOffset) * 2.5;
      const newZ = (this.cubes[i].position.z + this.cubeOffset) * 2.5;
      const delay = initRotationDuration + staggerOffset * i;

      let tl = gsap.timeline({delay: delay, repeat: -1, repeatDelay: loopDelay, yoyo: true});

      // if(i === this.cubes.length / 2 - 2) {
      //   tl = new timeline({delay: delay, repeat: -1, repeatDelay: loopDelay, yoyo: true, onRepeat: () => {
      //     groupTl.seek(0);
      //   }});
      // }

      tl
        .to(this.cubes[i].position, 0.5, {x: newX, y: newY, z: newZ })
        .to(this.cubes[i].rotation, 0.5, {x: Math.PI, y: -Math.PI}, 0)
        .to(this.cubes[i].scale, 1.25, {x: 1.25, y: 1.25, z: 1.25}, "-=0.4");
    }

    // Second half
    for (let i = halfLength; i < this.cubes.length; i++) {

      const newX = (this.cubes[i].position.x + this.cubeOffset) * 2.5;
      const newY = (this.cubes[i].position.y + this.cubeOffset) * 2.5;
      const newZ = (this.cubes[i].position.z + this.cubeOffset) * 2.5;
      const delay = initRotationDuration + staggerOffset * (this.cubes.length - i);
      const tl = gsap.timeline({delay: delay, repeat: -1, repeatDelay: loopDelay, yoyo: true});

      tl
        .to(this.cubes[i].position, 0.5, {x: newX, y: newY, z: newZ})
        .to(this.cubes[i].rotation, 0.5, {x: Math.PI, y: -Math.PI},0)
        .to(this.cubes[i].scale, 1.25, {x: 1.25, y: 1.25, z: 1.25}, "-=0.4");
    }
  }

  render() {

    if(this.rotationMode) {
      this.scene.rotation.z += 0.008;
    }
    this.renderer.autoClear = false;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].update();
    }
  }
}

//-------------------

// Main js 
let webgl;

const heroCanvasEle = document.getElementById('canvas-hero');
function getWidth(){
  const width = heroCanvasEle.offsetWidth;  
  return width;  
}

webgl = new Webgl(getWidth(), window.innerHeight);

heroCanvasEle.appendChild(webgl.renderer.domElement);
heroCanvasEle.classList.add('canvas-hero');
window.onresize = resizeHandler;

animate();

function resizeHandler() {
  webgl.resize(getWidth(), window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  webgl.render();
}

function random(min, max) {
  return Math.random() * (max - min + 1) + min;
}



