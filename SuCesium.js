var viewer=new Cesium.Viewer('cesiumContainer',{
    animation:false,
    timeline:false,
    fullscreenButton:false,
    geocoder:false,
    baseLayerPicker:false,
    homeButton:false,
    sceneModePicker:false,
    navigationHelpButton:false,
});
//加载瓦片服务
let tileLayer=new Cesium.ArcGisMapServerImageryProvider({
    url:'https://good.citygis.gis/server/rest/services/jcsj84CACHE/MapServer',
    enablePickFeatures:false
});
viewer.imageryLayers.addImageryProvider(tileLayer);
//加载tileset
var scene04 = new Cesium.Cesium3DTileset({
    url: 'http://localhost:63342/Cesium-1.69/resource/GX/BatchedDL_all/tileset.json',
    maximumScreenSpaceError: 1,
    maximumNumberOfLoadedTiles: 1000,
});
scene04.readyPromise.then(function (scene04) {
    update3dtilesMaxtrix(scene04);
    viewer.scene.primitives.add(scene04);
    var boundingSphere = scene04.boundingSphere;
    viewer.camera.flyToBoundingSphere(boundingSphere);
}).otherwise(function (error) {
    throw (error);
});
//图层开关








params = {
    tx: 121.46717681, //模型中心X轴坐标（经度，单位：十进制度）
    ty: 31.23541213, //模型中心Y轴坐标（纬度，单位：十进制度）
    tz: 0, //模型中心Z轴坐标（高程，单位：米）
    rx: 0,    //X轴（经度）方向旋转角度（单位：度）
    ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
    rz: 0      //Z轴（高程）方向旋转角度（单位：度）
};
//平移、贴地、旋转模型
function update3dtilesMaxtrix(tileset) {
    //旋转
    var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
    var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
    var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
    var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    //平移
    var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
    var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //旋转、平移矩阵相乘
    Cesium.Matrix4.multiply(m, rotationX, m);
    Cesium.Matrix4.multiply(m, rotationY, m);
    Cesium.Matrix4.multiply(m, rotationZ, m);
    //赋值给tileset
    tileset._root.transform = m;
};
