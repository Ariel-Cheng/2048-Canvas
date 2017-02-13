/**
 * Created by Aqua on 2016/6/13.
 */
function Game(canvas,ctx) {
    //this.best = 0;
    this.highscore = 0;
    this.score = 0;
    this.brick = new Array();
    this.isOver = false;
    this.needNewBrick = true;
    this.canvas = canvas;
    this.ctx = ctx;

    //this.isMoveable = 0x1111;//1000代表可以向上移动，0100向下，0010向左，0001向右，1111任何方向都可以移动

}

//初始化游戏
Game.prototype.init=function(){
    for(var i=0;i<4;i++){
        this.brick[i]=new Array();
        for(var j=0;j<4;j++){
            this.brick[i][j]=new Object();
            this.brick[i][j].value=0;
            this.brick[i][j].type="";
        }
    }
};//这是一个语句，加分号结束

//
Game.prototype.check=function(){
    for(var i=0;i<4;i++){
        this.isOver=this.isOver||this.brick[i].some(function(item,index,array){
            return item.value === 2048; })
    }

    if(this.isOver){
        alert("you win!")
    }

    for(var i=0;i<4;i++){
        if(this.brick[i].some(function(item,index,array){
                return item.value === 0;
            })){
            this.isOver = false;
            return;//控制权返还给页面
        }
    }

    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(i + 1 < 4)
            {
                if(this.brick[i][j].value == this.brick[i + 1][j].value)
                {
                    this.isOver = false;
                    return;
                }
            }

            if(j + 1 < 4)
            {
                if(this.brick[i][j].value == this.brick[i][j + 1].value)
                {
                    this.isOver = false;
                    return;
                }
            }
        }
    }
    //程序运行至此，说明输啦
    this.isOver = true;
    alert("you lose!")
};

Game.prototype.newBrick = function(){
    if(this.needNewBrick){
        do{
            var row = Math.floor(Math.random()*4);//随机数取整
            var col = Math.floor(Math.random()*4);
        }while(this.brick[row][col].value!=0);

        this.brick[row][col].value = 4-(Math.random()>=0.3)*2;
    }
}

Game.prototype.move = function(flag){

    var brickTemp = new Array();
    var test = new Array();//测试是否需要newBrick，格子都满了的时候就不能
    var i, j, k;
    for(i = 0 ; i < 4; i ++){
        brickTemp[i] = new Array();
        test[i] = new Array();
        for(j = 0; j < 4; j ++){
            brickTemp[i][j] = {
                value:0,
                type:''
            };
            test[i][j] = {
                value:0,
                type:''
            };

        }
    }

    switch(flag){
        case "up":{
                for (i = 0; i < 4; i++) {
                    for (j = 0, k = 0; j < 4; j++) {
                        brickTemp[k][i].value = this.brick[j][i].value>0 ? (k++, this.brick[j][i].value) : 0
                        //brickTemp只要brick中每一列的非0数，避免了要判断202->4,2002->4的情况
                        test[j][i].value=this.brick[j][i].value;
                    }


                    for (j = 0; j < 3; j++) {
                        if (brickTemp[j][i].value == brickTemp[j + 1][i].value && brickTemp[j][i].value>0) {
                            brickTemp[j][i].value *= 2;
                            brickTemp[j + 1][i].value = 0;
                            this.score += brickTemp[j][i].value;
                        }
                    }//合并

                    for (j = 0,k=0; j < 4; j++) {
                        this.brick[j][i].value = 0;
                        this.brick[k][i].value=brickTemp[j][i].value>0 ? ( k++,brickTemp[j][i].value) : 0;
                    }

                    for (j = 0; j < 4; j++) {
                        if(test[j][i].value!=this.brick[j][i].value){
                            this.needNewBrick=true;
                        }
                    }
                }
                break;
        }
        case "down":{
                for(i = 0 ; i < 4; i ++) {

                    for (j = 3, k = 3; j >= 0; j--) {
                        brickTemp[k][i].value = this.brick[j][i].value>0 ? (k--, this.brick[j][i].value) : 0;
                        test[j][i].value=this.brick[j][i].value;
                    }

                    for (j = 3; j > 0; j--) {
                        if (brickTemp[j][i].value == brickTemp[j - 1][i].value && brickTemp[j][i].value>0) {
                            brickTemp[j][i].value *= 2;
                            brickTemp[j - 1][i].value = 0;
                            this.score += brickTemp[j][i].value;
                        }
                    }

                    for (j = 3,k=3; j >= 0; j--) {
                        this.brick[j][i].value = 0;
                        this.brick[k][i].value=brickTemp[j][i].value>0 ? ( k--,brickTemp[j][i].value) : 0;
                    }

                    for (j = 3; j >= 0; j--) {
                        if(test[j][i].value!=this.brick[j][i].value){
                            this.needNewBrick=true;
                        }
                    }
                }
                 break;
        }
        case "left":{
                for(i = 0 ; i < 4; i ++){

                    for(j = 0,k = 0; j < 4; j ++){
                        brickTemp[i][k].value = this.brick[i][j].value>0 ? (k ++,this.brick[i][j].value) : 0;
                        test[i][j].value=this.brick[i][j].value;
                    }// clear zero for each clo

                    for(j = 0; j < 3; j ++){
                        if(brickTemp[i][j].value == brickTemp[i][j + 1].value && brickTemp[i][j].value>0){
                            brickTemp[i][j].value *= 2;
                            brickTemp[i][j + 1].value = 0;
                            this.score += brickTemp[i][j].value;//compute score;
                        }
                    }// merge

                    for(j = 0,k=0; j < 4; j ++){
                        this.brick[i][j].value = 0;
                        this.brick[i][k].value=brickTemp[i][j].value>0 ? ( k++,brickTemp[i][j].value) : 0;
                    }//clear zero

                    for (j = 0; j < 4; j++) {
                        if(test[i][j].value!=this.brick[i][j].value){
                            this.needNewBrick=true;
                        }
                    }
                }
                break;
        }

        case "right":{
                for(i = 0 ; i < 4; i ++){

                    for(j = 3,k = 3; j >= 0; j --){
                        brickTemp[i][k].value = this.brick[i][j].value>0 ? (k --,this.brick[i][j].value) : 0;
                        test[i][j].value=this.brick[i][j].value;
                    }// clear zero for each row

                    for(j = 3; j > 0; j --){
                        if(brickTemp[i][j].value == brickTemp[i][j - 1].value && brickTemp[i][j].value>0){
                            brickTemp[i][j].value *= 2;
                            brickTemp[i][j - 1].value = 0;
                            this.score += brickTemp[i][j].value;//compute score;
                        }
                    }// merge

                    for(j = 3,k=3; j >= 0; j --){
                        this.brick[i][j].value = 0;
                        this.brick[i][k].value=brickTemp[i][j].value>0 ? ( k--,brickTemp[i][j].value) : 0;
                    }//clear zero

                    for (j = 3; j >= 0; j --) {
                        if(test[i][j].value!=this.brick[i][j].value){
                            this.needNewBrick=true;
                        }
                    }

                }
                break;
        }
    }
    if(this.needNewBrick){
        this.newBrick();
    }
    this.needNewBrick = false;
}

Game.prototype.paint = function(){
    var width = this.canvas.clientWidth;
    var height = this.canvas.clientHeight;

    var box_width = width*0.8*0.25;
    var margin_width = width*0.2*0.2;
    this.ctx.beginPath();
    this.ctx.fillStyle="#BBADA0";  
    this.ctx.fillRect(0,0,width,height);

    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            var c="";
            switch(this.brick[i][j].value){
                case 0:
                 c="#ccc0b3 ";
                 break;
                case 2:
                 c="#EEE4DA ";
                 break;
                case 4:
                 c="#EDE0C8 ";
                 break;
                case 8:
                 c="#f2b179 ";
                 break;
                case 16:
                 c="#f59563 ";
                 break;
                case 32:
                 c="#f67c5f ";
                 break;
                case 64:
                 c="#f65e3b ";
                 break;
                case 128:
                 c="#edcf72 ";
                 break;
                case 256:
                 c="#edcc61 ";
                 break;
                case 512:
                 c="#edc850 ";
                 break;
                case 1024:
                 c="#edc53f ";
                 break;
                case 2048:
                 c="#edc22e ";
                 break; 
            }
            var x=margin_width+j*(box_width+margin_width)+box_width/2;  
            var y=margin_width+i*(box_width+margin_width)+box_width/2;  
            r= box_width/2;
            this.ctx.beginPath();  
            this.ctx.fillStyle=c;   
            this.ctx.arc(x, y,r, 0, Math.PI * 2, true);    
            //按照指定的路径绘制弧线
            this.ctx.fill();
            if (this.brick[i][j].value>0) {  
                this.ctx.beginPath();  
                this.ctx.textAlign="center";  
                this.ctx.textBaseline="middle";  
                this.ctx.fillStyle="#776E65";  
                this.ctx.font="40px Arial";  
                this.ctx.fillText(this.brick[i][j].value,x,y);  
            }  
        }  
    }
}

Game.prototype.refreshscore = function(){
    this.highscore = (this.score > this.highscore) ? this.score : this.highscore;
    document.getElementById("score").innerHTML= "SCORE<br/>"+this.score;
    document.getElementById("best").innerHTML= "BEST<br/>"+this.highscore;

}
Game.prototype.restart = function(){


    this.isOver = false;
    this.needNewBrick = true;
    this.brick = null;//清空
    this.brick = new Array();
    this.score = 0;
    this.start();
    this.paint();
}
Game.prototype.start = function(){
    this.init();
    this.newBrick();
    this.newBrick();
    //this.refreshscore();
}
