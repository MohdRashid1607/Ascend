import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import {CopyShader} from 'three/examples/jsm/shaders/CopyShader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as S from './shaders.js';

const BASE='https://api.getlayers.ai/storage/v1/object/public/public/assets/ascend-d9857ad1f2';
const C={rimColor:'#c1faff',rimPower:2.4,nightLights:10,terrainDepth:0.33,terrainShade:1.3,oceanGlint:0.45,oceanDeep:0.12,oceanFlow:3,oceanFlowSpeed:0.8,oceanFlowScale:2.1,glowColor:'#3a6cff',glowIntensity:3.35,planetRadius:1.95,spin:0.03,initRotation:2.07,tilt:0.37,bgColor:'#040a1e',flameColor:'#3a6cff',flameColor2:'#c1faff',flameAmt:0.15,starColor:'#cfe0ff',starCount:1400,starSize:1.6,starFlicker:1,atmoColor:'#9fc4ff',atmoCount:320,atmoSize:22,atmoSpeed:.8,markerColor:'#ffd27a',markerCount:60,markerSize:16,markerSpeed:.5};
const ENTIRE=3;
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const hex=h=>{const c=new THREE.Color(h);return new THREE.Vector3(c.r,c.g,c.b)};
const sample=(st,p)=>{if(p<=st[0].p)return st[0].v;for(let i=1;i<st.length;i++)if(p<=st[i].p){let t=(p-st[i-1].p)/(st[i].p-st[i-1].p);t=t*t*(3-2*t);return lerp(st[i-1].v,st[i].v,t)}return st[st.length-1].v};
const SX=[{p:0,v:0},{p:.32,v:-3.1},{p:.64,v:3.2},{p:1,v:0}];
const SY=[{p:0,v:-4.5},{p:.32,v:.55},{p:.64,v:.45},{p:1,v:.15}];
const SS=[{p:0,v:2.15},{p:.32,v:1},{p:.64,v:.92},{p:1,v:1.12}];

export function initScene(canvas,reduce){
  const r=new THREE.WebGL1Renderer({canvas,antialias:true});
  r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputEncoding=THREE.sRGBEncoding;
  r.shadowMap.enabled=true;r.shadowMap.type=THREE.VSMShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x000000);
  const cam=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,200);cam.position.set(0,0,8);
  cam.layers.enable(1);cam.layers.enable(2);cam.layers.enable(3);scene.add(cam);
  scene.add(new THREE.AmbientLight(0xffffff,1.8));
  const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(0,10,2);scene.add(dl);

  const w=()=>[innerWidth,innerHeight];
  const mk=(...p)=>{const c=new EffectComposer(r);c.renderToScreen=false;c.addPass(new RenderPass(scene,cam));p.forEach(x=>c.addPass(x));return c};
  const v2=()=>new THREE.Vector2(...w());
  const torusC=mk(new ShaderPass(GammaCorrectionShader),new UnrealBloomPass(v2(),.22,.2,0),new ShaderPass(CopyShader));
  const bloomC=mk(new UnrealBloomPass(v2(),.5,.6,0),new ShaderPass(GammaCorrectionShader));
  const finalC=new EffectComposer(r);finalC.addPass(new RenderPass(scene,cam));
  const fp=new ShaderPass({uniforms:{iTime:{value:0},tDiffuse:{value:null},torusTexture:{value:torusC.renderTarget1.texture},bloomTexture:{value:bloomC.renderTarget1.texture},haloTexture:{value:null},uBg:{value:hex(C.bgColor)},uFlameA:{value:hex(C.flameColor)},uFlameB:{value:hex(C.flameColor2)},uFlameAmt:{value:C.flameAmt}},vertexShader:S.FINAL_VERT,fragmentShader:S.FINAL_FRAG});
  fp.uniforms.torusTexture.value=torusC.renderTarget1.texture;fp.uniforms.bloomTexture.value=bloomC.renderTarget1.texture;
  finalC.addPass(fp);
  const comps=[torusC,bloomC,finalC];

  const world=new THREE.Group(),planetG=new THREE.Group(),cloudG=new THREE.Group();
  planetG.rotation.z=cloudG.rotation.z=C.tilt;cloudG.visible=false;
  world.add(planetG,cloudG);scene.add(world);
  world.position.set(SX[0].v,SY[0].v,0);world.scale.setScalar(SS[0].v);

  const glow=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uGlow:{value:hex(C.glowColor)},uIntensity:{value:C.glowIntensity}},vertexShader:S.GLOW_VERT,fragmentShader:S.GLOW_FRAG}));
  glow.scale.setScalar(C.planetRadius*2.3);world.add(glow);

  // starfield
  const sp=new Float32Array(C.starCount*3),ss=new Float32Array(C.starCount),sb=new Float32Array(C.starCount);
  for(let i=0;i<C.starCount;i++){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,q=Math.sqrt(1-u*u);sp.set([90*q*Math.cos(a),90*u,90*q*Math.sin(a)],i*3);ss[i]=Math.random()*100;sb[i]=.35+Math.random()*.65}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('seed',new THREE.BufferAttribute(ss,1));sg.setAttribute('bright',new THREE.BufferAttribute(sb,1));
  const uRes={value:new THREE.Vector2(innerWidth,innerHeight)};
  const starU={uTime:{value:0},uSize:{value:C.starSize},uFlicker:{value:C.starFlicker},uColor:{value:new THREE.Color(C.starColor)},uRes};
  const stars=new THREE.Points(sg,new THREE.ShaderMaterial({uniforms:starU,vertexShader:S.STAR_VERT,fragmentShader:S.STAR_FRAG,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  stars.frustumCulled=false;scene.add(stars);

  // motes
  const moteU={uTime:{value:0},uColor:{value:new THREE.Color(C.atmoColor)},uRes};
  const mp=new Float32Array(C.atmoCount*3),mz=new Float32Array(C.atmoCount),ms=new Float32Array(C.atmoCount);
  for(let i=0;i<C.atmoCount;i++){mp.set([Math.random()*2-1,Math.random()*2-1,Math.random()*2-1],i*3);mz[i]=C.atmoSize*(.4+Math.random());ms[i]=Math.random()*100}
  const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(mp,3));mg.setAttribute('size',new THREE.BufferAttribute(mz,1));mg.setAttribute('seed',new THREE.BufferAttribute(ms,1));
  const motes=new THREE.Points(mg,new THREE.ShaderMaterial({uniforms:moteU,vertexShader:S.MOTE_VERT,fragmentShader:S.MOTE_FRAG,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));
  motes.frustumCulled=false;motes.layers.set(ENTIRE);scene.add(motes);

  // clouds
  const clouds=[];const cloudT={value:0};
  new THREE.TextureLoader().load(BASE+'/planet-clouds.png',tex=>{
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(5,5);
    [[1.005,.6,.06,0,0],[1.03,.5,.14,2.2,13],[1.075,.5,.1,4.3,27]].forEach(([h,o,sp,ry,ph])=>{
      const m=new THREE.MeshStandardMaterial({map:tex,transparent:true,depthWrite:false});
      m.onBeforeCompile=sh=>{
        Object.assign(sh.uniforms,{uTime:cloudT,noiseScale:{value:20},uSpeedX:{value:1},uSpeedY:{value:2},uSpeedZ:{value:2},uOpacity:{value:o},uPhase:{value:ph}});
        sh.vertexShader='varying vec2 vCloudUv;\n'+sh.vertexShader.replace(/void main\(\s*\)\s*\{/,'void main(){ vCloudUv = uv;');
        sh.fragmentShader=S.CLOUD_UNIFORMS+S.SNOISE+sh.fragmentShader.replace('#include <dithering_fragment>',S.CLOUD_FRAG);
      };
      const mesh=new THREE.Mesh(new THREE.SphereGeometry(C.planetRadius*h,64,64),m);
      mesh.rotation.y=ry;mesh.renderOrder=2;mesh.userData.spin=sp;mesh.layers.set(ENTIRE);cloudG.add(mesh);clouds.push(mesh);
    });
  });

  // land markers
  const markU={uTime:{value:0},uColor:{value:new THREE.Color(C.markerColor)},uSize:{value:C.markerSize},uSpeed:{value:C.markerSpeed},uRes};
  function addMarkers(mesh){
    const img=mesh.material.map&&mesh.material.map.image;if(!img)return;
    const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;
    const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);
    const g=mesh.geometry,P=g.attributes.position,U=g.attributes.uv,ix=g.index;
    const n=(ix?ix.count:P.count)/3,cum=new Float32Array(n),idx=(t,k)=>ix?ix.getX(t*3+k):t*3+k;
    const A=new THREE.Vector3(),B=new THREE.Vector3(),D=new THREE.Vector3();let tot=0;
    for(let t=0;t<n;t++){A.fromBufferAttribute(P,idx(t,0));B.fromBufferAttribute(P,idx(t,1)).sub(A);D.fromBufferAttribute(P,idx(t,2)).sub(A);tot+=B.cross(D).length()/2;cum[t]=tot}
    const pos=[],seed=[];let tries=0;
    while(pos.length<C.markerCount*3&&tries++<20000){
      const r=Math.random()*tot;let lo=0,hi=n-1;while(lo<hi){const m=(lo+hi)>>1;cum[m]<r?lo=m+1:hi=m}
      let a=Math.random(),b=Math.random();if(a+b>1){a=1-a;b=1-b}const c=1-a-b;
      const i0=idx(lo,0),i1=idx(lo,1),i2=idx(lo,2);
      const u=U.getX(i0)*c+U.getX(i1)*a+U.getX(i2)*b,v=U.getY(i0)*c+U.getY(i1)*a+U.getY(i2)*b;
      const d=cx.getImageData(clamp(Math.floor(u*img.width),0,img.width-1),clamp(Math.floor(v*img.height),0,img.height-1),1,1).data;
      if(d[2]>d[0]+6&&d[2]>d[1]+6)continue;
      const p=new THREE.Vector3().fromBufferAttribute(P,i0).multiplyScalar(c).addScaledVector(new THREE.Vector3().fromBufferAttribute(P,i1),a).addScaledVector(new THREE.Vector3().fromBufferAttribute(P,i2),b).multiplyScalar(1.012);
      pos.push(p.x,p.y,p.z);seed.push(Math.random());
    }
    const mgeo=new THREE.BufferGeometry();mgeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));mgeo.setAttribute('seed',new THREE.Float32BufferAttribute(seed,1));
    const pts=new THREE.Points(mgeo,new THREE.ShaderMaterial({uniforms:markU,vertexShader:S.MARK_VERT,fragmentShader:S.MARK_FRAG,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending}));
    pts.layers.set(ENTIRE);mesh.add(pts);
  }

  // planet
  const planetT={value:0};let loaded=false,entry=reduce?1:0;
  const dr=new DRACOLoader();dr.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const gl=new GLTFLoader();gl.setDRACOLoader(dr);
  const first=o=>{let m;o.traverse(c=>{if(!m&&c.isMesh)m=c});return m};
  gl.load(BASE+'/planet-lights.glb',lg=>{
    const nightTex=first(lg.scene).material.map;
    gl.load(BASE+'/planet.glb',pg=>{
      const mesh=first(pg.scene);mesh.geometry.computeBoundingSphere();
      mesh.scale.setScalar(C.planetRadius/mesh.geometry.boundingSphere.radius);
      const mat=mesh.material.clone();mat.metalness=0;mat.roughness=1;mat.envMapIntensity=0;mat.extensions={derivatives:true};
      mat.onBeforeCompile=sh=>{
        Object.assign(sh.uniforms,{time:planetT,noiseScale:{value:30},speedX:{value:1.5},speedY:{value:2},speedZ:{value:2.5},rimColor:{value:new THREE.Color(C.rimColor)},rimPower:{value:C.rimPower},nightBlendTexture:{value:nightTex},nightLights:{value:C.nightLights},terrainDepth:{value:C.terrainDepth},terrainShade:{value:C.terrainShade},oceanGlint:{value:C.oceanGlint},oceanDeep:{value:C.oceanDeep},oceanFlow:{value:C.oceanFlow},oceanFlowSpeed:{value:C.oceanFlowSpeed},oceanFlowScale:{value:C.oceanFlowScale}});
        sh.vertexShader='varying vec2 vCustomUv;\n'+sh.vertexShader.replace(/void main\(\s*\)\s*\{/,'void main(){ vCustomUv = uv;');
        sh.fragmentShader=S.PLANET_UNIFORMS+S.SNOISE+sh.fragmentShader.replace('#include <dithering_fragment>',S.PLANET_FRAG);
      };
      mesh.material=mat;mesh.layers.set(ENTIRE);planetG.add(mesh);planetG.userData.mesh=mesh;
      cloudG.visible=true;loaded=true;try{addMarkers(mesh)}catch(err){console.warn('markers',err)}
    });
  });
  [glow,dl].forEach(o=>o.layers.set(ENTIRE));scene.traverse(o=>{if(o.isLight||o===stars)o.layers.set(ENTIRE)});

  const resize=()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight);comps.forEach(c=>{c.setPixelRatio(Math.min(devicePixelRatio,2));c.setSize(innerWidth,innerHeight)});uRes.value.set(innerWidth,innerHeight)};
  addEventListener('resize',resize);resize();

  let last=performance.now(),curP=0,curX=SX[0].v,curY=SY[0].v,curS=SS[0].v,spin=0,entryT=0;
  (function loop(now){
    requestAnimationFrame(loop);
    const dt=Math.min(.05,(now-last)/1000);last=now;
    planetT.value+=dt/12;cloudT.value+=dt/20;starU.uTime.value+=dt;fp.uniforms.iTime.value=now/1000*.8*8*.05+now/1000;
    clouds.forEach(m=>m.rotation.y+=dt*m.userData.spin);markU.uTime.value+=dt;moteU.uTime.value=now/1000*C.atmoSpeed*8;motes.position.copy(cam.position);
    const max=document.documentElement.scrollHeight-innerHeight;
    const pT=clamp(max>0?scrollY/max:0,0,1);curP+=(pT-curP)*Math.min(1,dt*4.5);
    const side=clamp(innerWidth/1200,.5,1),k=Math.min(1,dt*3.2),fit=clamp(cam.aspect,.55,1);
    curX+=(sample(SX,curP)*side-curX)*k;curY+=(sample(SY,curP)+(1-fit)*1.8-curY)*k;curS+=(sample(SS,curP)-curS)*k;
    if(loaded&&entry<1){entryT+=dt;const t=clamp(entryT/1.9,0,1);entry=t}
    const e=1-Math.pow(1-entry,3),entryY=loaded?-6.5*(1-e):-6.5;
    world.position.set(curX,curY+entryY,0);world.scale.setScalar(curS*fit);
    spin+=dt*C.spin;planetG.rotation.y=C.initRotation+spin+curP*Math.PI*1.6;
    glow.quaternion.copy(cam.quaternion);
    cam.layers.set(1);torusC.render();cam.layers.set(2);bloomC.render();cam.layers.set(ENTIRE);finalC.render();
  })(last);
}
