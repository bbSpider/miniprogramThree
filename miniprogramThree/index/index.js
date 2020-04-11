// import { createScopedThreejs } from 'threejs-miniprogram';
import { registerGLTFLoader } from '../loaders/gltf-loader';
import { createScopedThreejs } from '../threejs/three';

const app = getApp();
var camera, scene, renderer, model;
var requestAnimationFrame; // 动画回调函数

Page({
  data: {},
  onLoad: function () {
    let that = this;

    var query = wx.createSelectorQuery();
    query.select('#webgl').node().exec((res) => {

      var canvas = res[0].node;
      // 设置背景透明
      var gl = canvas.getContext('webgl', {
        alpha: true
      });

      if (canvas != undefined) {
        //  canvas.width 和canvas.style都需要设置，否则无法显示渲染
        canvas.width = canvas._width;
        canvas.height = canvas._height;
        requestAnimationFrame = canvas.requestAnimationFrame;
        that.init(canvas);
      }
    });
  },

  init: function(canvas){
    let that = this;
    const THREE = createScopedThreejs(canvas)
    registerGLTFLoader(THREE)
    //设置相机
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.25, 100);
    camera.position.set(- 5, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));
    scene = new THREE.Scene();
    //设置光线
    var light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    scene.add(light);
    //加载外部模型
    var loader = new THREE.GLTFLoader();
    loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) {
      model = gltf.scene;
      scene.add(model);
    }, undefined, function (e) {
      console.error(e);
    });
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    //调用动画
    that.animate();
  },

  animate:function(){
    let that = this;
    requestAnimationFrame(that.animate);
    renderer.render(scene, camera);
  }
})
