var cubeVec = [];
var currentPos = [0,0,0];


var change = false;

var lastx = 0;
var lasty = 0;
var counter = 0;

function doSomeThing(event){
	x = event.clientX;
	y = event.clientY;

	if(change){
		e3d.phiz+=(x-lastx)/100;
		e3d.phiy-=(y-lasty)/100;

		cubePlot();
	}
	lastx = x;
	lasty = y;
}


window.onkeydown=function(event){
	var charCode = event.keyCode || event.which;
	if(charCode == 65)  moveLeft();  //a
	if(charCode == 87) moveUp();  //  w
	if(charCode == 83) moveDown();  // s
	if(charCode == 68) moveRight();  // d
	if(charCode == 82) moveIn();   // r
	if(charCode == 70) moveOut(); // f

	if(charCode == 13)setCube(); // enter
};

window.onload=function(){
	cubePlot();
};



function moveLeft(){
	currentPos[1]-=1;
	cubePlot();
}

function moveRight(){
	currentPos[1]+=1;
	cubePlot();
}

function moveUp(){
	currentPos[2]+=1;
	cubePlot();
}

function moveDown(){
	currentPos[2]-=1;
	cubePlot();
}

function moveIn(){
	currentPos[0]+=1;
	cubePlot();
}

function moveOut(){
	currentPos[0]-=1;
	cubePlot();
}

function setCube(){
	cubeVec.push([]);
	addCube(cubeVec[cubeVec.length-1],currentPos);
	cubePlot();
}

function cubePlot(){

	var n,m;
	var surfaces = [];

	for(n=0;n<cubeVec.length;n++){
		for(m=0;m<cubeVec[n].length;m++){
			surfaces.push(cubeVec[n][m]);
		}
	}

	addCube(surfaces,currentPos);

	var basis = e3d.setBasis();
	for(var k=0;k<3;k++) {
		e3d.shift[k] = -10*e3d.basis[0][k];
	}

	var str = document.getElementById('colourValue').value;
	e3d.plotMain(surfaces,function(datapoint){return str;});
}


function addCube(surfaces,coord){

	var coord0 = [coord[0],coord[1],coord[2]];
	var coord1 = [coord[0]+1,coord[1],coord[2]];
	var coord2 = [coord[0],coord[1]+1,coord[2]];
	var coord3 = [coord[0],coord[1],coord[2]+1];
	var coord4 = [coord[0],coord[1]+1,coord[2]+1];
	var coord5 = [coord[0]+1,coord[1],coord[2]+1];
	var coord6 = [coord[0]+1,coord[1]+1,coord[2]];
	var coord7 = [coord[0]+1,coord[1]+1,coord[2]+1];

	// faces
	surfaces.push([coord0,coord1,coord6,coord2]);
	surfaces.push([coord0,coord1,coord5,coord3]);
	surfaces.push([coord0,coord2,coord4,coord3]);
	surfaces.push([coord7,coord4,coord3,coord5]);
	surfaces.push([coord7,coord4,coord2,coord6]);
	surfaces.push([coord7,coord5,coord1,coord6]);


	//edges
	surfaces.push([coord0,coord1]);
	surfaces.push([coord0,coord2]);
	surfaces.push([coord0,coord3]);
	surfaces.push([coord1,coord5]);
	surfaces.push([coord1,coord6]);
	surfaces.push([coord2,coord4]);
	surfaces.push([coord2,coord6]);
	surfaces.push([coord3,coord4]);
	surfaces.push([coord3,coord5]);
	surfaces.push([coord7,coord4]);
	surfaces.push([coord7,coord5]);
	surfaces.push([coord7,coord6]);

}
