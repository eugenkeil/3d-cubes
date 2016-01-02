// my 3d-rendering environment

e3d = {

// ----------- parameters ----------------

shift: [-10,0,0], // position of observer
eye_obs: 100,  // how close is the projection plane to the projection point?
zoom: 5,    // magnification
basis: [[1,0,0],[0,1,0],[0,0,1]],

midpoint: [250,250],   // where on the canvas is the shifted origin?
// angles
phix: 0,
phiy: 0, 
phiz: 0,

// size of canvas
sizeX: 500,
sizeY: 500,


reset: function(){
this.eye_obs = 100;
this.zoom = 10;
this.midpoint = [250,250];
this.basis = [[1,0,0],[0,1,0],[0,0,1]];
this.shift = [-10,0,0];
},


// Main plot function
plotMain: function(data,color){
var c=document.getElementById("medium");
var ctx = c.getContext('2d');
ctx.clearRect(0,0,this.sizeX,this.sizeY);

ctx.fillStyle="black";
ctx.fillRect(0,0,this.sizeX,this.sizeY);
var n,m,k,x,y,d;

//ctx.globalCompositeOperation = 'destination-over';

var pdata = [];  //data projected to the plane ?? other surface projections possible?
var dvec=[];


for(n=0;n<data.length;n++){
for(k=0;k<data[n].length;k++){
dvec[k]=0;
for(m=0;m<3;m++) dvec[k]+=this.basis[0][m]*data[n][k][m];
data[n][k].push(dvec[k]);
}
}

data.sort(function(a,b){
var evalsum1=0;
var evalsum2=0; 
for(var k=0;k<b.length;k++) evalsum1+=b[k][b[k].length-1]; 
for(var k=0;k<a.length;k++) evalsum2+=a[k][a[k].length-1]; 
return (evalsum1*a.length-evalsum2*b.length);});  // sort according to midpoint


for(n=0;n<data.length;n++){
for(k=0;k<data[n].length;k++){
data[n][k].pop();
}
}

var f;
for(n=0;n<data.length;n++){
var pd = this.project(data[n],this.basis,this.eye_obs,this.shift);  // project data-points to surface
if(pd.length==1){
ctx.fillStyle = '#333333';
f=this.eye_obs/(this.eye_obs+pd[0][2]);
ctx.beginPath();
ctx.arc(this.midpoint[0]+this.zoom*pd[0][0], this.midpoint[1]-this.zoom*pd[0][1], 10*f, 0, 2 * Math.PI, false);
ctx.fill();
} else if(pd.length==2){
ctx.lineWidth=2;
ctx.strokeStyle = '#000000';
//ctx.setLineDash([4, 2]);
ctx.beginPath();
ctx.moveTo(this.midpoint[0]+this.zoom*pd[0][0],this.midpoint[1]-this.zoom*pd[0][1]);
ctx.lineTo(this.midpoint[0]+this.zoom*pd[1][0],this.midpoint[1]-this.zoom*pd[1][1]);
ctx.closePath();
ctx.stroke();
} else if(pd.length > 2){
ctx.lineWidth=1;
ctx.fillStyle = color(data[n]);
//ctx.strokeStyle = ctx.fillStyle;
//if grid = off dann dies machen..??
ctx.beginPath();
ctx.moveTo(this.midpoint[0]+this.zoom*pd[0][0],this.midpoint[1]-this.zoom*pd[0][1]);
for(k=0;k<pd.length;k++)
ctx.lineTo(this.midpoint[0]+this.zoom*pd[k][0],this.midpoint[1]-this.zoom*pd[k][1]);
ctx.lineTo(this.midpoint[0]+this.zoom*pd[0][0],this.midpoint[1]-this.zoom*pd[0][1]);
ctx.fill();
ctx.stroke();
ctx.closePath();
}
}

},




setBasis: function(){

var n,m,k;

var sinx = Math.sin(this.phix);
var cosx = Math.cos(this.phix);
var siny = Math.sin(this.phiy);
var cosy = Math.cos(this.phiy);
var sinz = Math.sin(this.phiz);
var cosz = Math.cos(this.phiz);

var matx = [[1,0,0],[0,cosx,-sinx],[0,sinx,cosx]];
var maty = [[cosy,0,siny],[0,1,0],[-siny,0,cosy]];
var matz = [[cosz,-sinz,0],[sinz,cosz,0],[0,0,1]];


// Matrixproducts to get general rotation matrix
// can one get it with better control on where the end result will look at?
var prod=this.mat3x3Mult(maty,matx);
var prod2=this.mat3x3Mult(matz,prod);

this.basis = prod2;
},




// write a matrix library!!

mat3x3Mult: function (A,B){
var C=[];
C[0]=[];
C[0][0]=A[0][0]*B[0][0]+A[0][1]*B[1][0]+A[0][2]*B[2][0];
C[0][1]=A[0][0]*B[0][1]+A[0][1]*B[1][1]+A[0][2]*B[2][1];
C[0][2]=A[0][0]*B[0][2]+A[0][1]*B[1][2]+A[0][2]*B[2][2];
C[1]=[];
C[1][0]=A[1][0]*B[0][0]+A[1][1]*B[1][0]+A[1][2]*B[2][0];
C[1][1]=A[1][0]*B[0][1]+A[1][1]*B[1][1]+A[1][2]*B[2][1];
C[1][2]=A[1][0]*B[0][2]+A[1][1]*B[1][2]+A[1][2]*B[2][2];
C[2]=[];
C[2][0]=A[2][0]*B[0][0]+A[2][1]*B[1][0]+A[2][2]*B[2][0];
C[2][1]=A[2][0]*B[0][1]+A[2][1]*B[1][1]+A[2][2]*B[2][1];
C[2][2]=A[2][0]*B[0][2]+A[2][1]*B[1][2]+A[2][2]*B[2][2];
return C;
},



project: function(dp,b,e,sh){   // dp=datapoint, b = basis, e = eye-dist, sh = shift
var xvec = [];
var yvec = [];
var fvec=[];
var hvec = [];

for(var k=0;k<dp.length;k++){
	hvec[k] = b[0][0]*(dp[k][0]-sh[0])+b[0][1]*(dp[k][1]-sh[1])+b[0][2]*(dp[k][2]-sh[2]);
	xvec[k] = b[1][0]*(dp[k][0]-sh[0])+b[1][1]*(dp[k][1]-sh[1])+b[1][2]*(dp[k][2]-sh[2]);
	yvec[k] = b[2][0]*(dp[k][0]-sh[0])+b[2][1]*(dp[k][1]-sh[1])+b[2][2]*(dp[k][2]-sh[2]);
	
	fvec[k]=e/hvec[k];
	if(hvec[k]<=0.001) return [];  // if any hvec<=0  --> behind observer
}

var projsur = [];
for(var k=0;k<dp.length;k++) projsur.push([xvec[k]*fvec[k],yvec[k]*fvec[k],hvec[k]]);
return projsur;

}

// ===========end of e3d object ====================
}