cubeStatus = [] //存放顺序为上下左右前后
$("#show").bind("click",function(){
    cubeStatus = []
    for(i=0;i<6;i++){
        surface = []
        for(j=0;j<9;j++){
            pos = "[pos='"+i+','+j+"']";
            console.log(pos)
            color = $(pos)[0].style['background']
            if(color == 'rgb(255, 255, 255)') surface.push(1)
            else surface.push(colorType.indexOf(color));
        }
        cubeStatus.push(surface)
    }
    $(".cubeStatus").text(cubeStatus)
  });
solveStep = ['l','r','d','u'] //待旋转的魔方序列
$("#solve").bind("click",function(){
    i = 0
    function singleTurn() {
        if(i>=solveStep.length){
            return;
        }else{
            cube.turn3(solveStep[i], function () {
                var timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    i++;
                    singleTurn();
                }, 0);
            })
        }
    }
    singleTurn();
    //cube.turn3(solveStep.shift())
})

$("#convert").bind("click",function(){
    newCubeStatus = new Array(54).fill(-1)
    centerCube = [4,13,22,31,40,49]
    cornerCube = {
        "0,2,4":{
            0:0, 2:26, 4:47  
        },
        "0,3,4":{
            0:6, 3:29, 4:53  
        },
        "1,2,4":{
            1:11, 2:24, 4:45
        },
        "1,3,4":{
            1:17, 3:27, 4:51
        },
        "0,2,5":{
            0:2, 2:20, 5:44
        },
        "0,3,5":{
            0:8, 3:35, 5:38
        },
        "1,2,5":{
            1:9, 2:18, 5:42
        },
        "1,3,5":{
            1:15, 3:33, 5:36
        }

    }
    edgeCube = {
        "0,4":{
            0:3, 4:50
        },
        "2,4":{
            2:25, 4:46
        },
        "1,4":{
            1:14, 4:48
        },
        "3,4":{
            3:28, 4:52
        },
        "0,2":{
            0:1, 2:23
        },
        "0,3":{
            0:7, 3:32
        },
        "0,5":{
            0:5, 5:41
        },
        "1,2":{
            1:10, 2:21
        },
        "1,3":{
            1:16, 3:30
        },
        "1,5":{
            1:12, 5:39
        },
        "3,5":{
            3:34, 5:37
        },
        "2,5":{
            2:19, 5:43
        },
    }
    for(i=0;i<centerCube.length;i++){  //中心块进入序列
        newCubeStatus[centerCube[i]] = centerCube[i];
    }
    cornerCubeNum = [
        [[0,2,4],[6,6,0],[0,26,47]],
        [[0,3,4],[8,6,2],[6,29,53]],
        [[1,2,4],[6,8,6],[11,24,45]],
        [[1,3,4],[8,8,8],[17,27,51]],
        [[0,2,5],[0,0,0],[2,20,44]],
        [[0,3,5],[2,0,2],[8,35,38]],
        [[1,2,5],[0,2,6],[9,18,42]],
        [[1,3,5],[2,2,8],[15,33,36]]
    ]
    edgeCubeNum = [
        [[0,4],[7,1],[3,50]],
        [[2,4],[7,3],[25,46]],
        [[1,4],[7,7],[14,48]],
        [[3,4],[7,5],[28,52]],
        [[0,2],[3,3],[1,23]],
        [[0,3],[5,3],[7,32]],
        [[0,5],[1,1],[5,41]],
        [[1,2],[3,5],[10,21]],
        [[1,3],[5,5],[16,30]],
        [[1,5],[1,7],[12,39]],
        [[3,5],[1,5],[34,37]],
        [[2,5],[1,3],[19,43]],
    ]

    console.log(cubeStatus)
    for(i=0;i<cornerCubeNum.length;i++){  //角块进入序列
        Num = cornerCubeNum[i]
        aCorner=[cubeStatus[Num[0][0]][Num[1][0]],cubeStatus[Num[0][1]][Num[1][1]],cubeStatus[Num[0][2]][Num[1][2]]]
        aCorner.sort(function(a, b){return a - b}); 
        aCorner = aCorner+''
        console.log(aCorner)
        console.log(Num[2][0])
        console.log(cubeStatus[Num[0][0]][Num[1][0]])
        newCubeStatus[Num[2][0]] = cornerCube[aCorner][cubeStatus[Num[0][0]][Num[1][0]]]
        newCubeStatus[Num[2][1]] = cornerCube[aCorner][cubeStatus[Num[0][1]][Num[1][1]]]
        newCubeStatus[Num[2][2]] = cornerCube[aCorner][cubeStatus[Num[0][2]][Num[1][2]]]
    }
    for(i=0;i<edgeCubeNum.length;i++){  //棱块进入序列
        Num = edgeCubeNum[i]
        aedge=[cubeStatus[Num[0][0]][Num[1][0]],cubeStatus[Num[0][1]][Num[1][1]]]
        aedge.sort(function(a, b){return a - b}); 
        aedge = aedge+''
        console.log(Num[0][0],Num[1][0])
        console.log(Num[0][1],Num[1][1])
        console.log(aedge)
        console.log(Num[2][0])
        console.log(cubeStatus[Num[0][0]][Num[1][0]])
        newCubeStatus[Num[2][0]] = edgeCube[aedge][cubeStatus[Num[0][0]][Num[1][0]]]
        newCubeStatus[Num[2][1]] = edgeCube[aedge][cubeStatus[Num[0][1]][Num[1][1]]]
    }
    $(".cubeStatus").text(newCubeStatus)
    for(i=0;i<54;i++){
        if(newCubeStatus.indexOf(i)==-1) {
            console.log(i)
        }
    }
})

$(".color").bind("click",function(){
    pos = "[pos='"+cubePos+"']"

    $(pos)[0].style['background'] = this.style['color']
    $('#color-picker').css({'left': movex,
                'top': movey,
                'display':'none'});
})
