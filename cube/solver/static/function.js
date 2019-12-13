
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
    //$(".cubeStatus").text(cubeStatus)
  });
//solveStep = ['l','r','d','u'] //待旋转的魔方序列
$("#solve").bind("click",function(){
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
        console.log(surface)
        cubeStatus.push(surface)
    }
    console.log(cubeStatus)
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
        newCubeStatus[Num[2][0]] = edgeCube[aedge][cubeStatus[Num[0][0]][Num[1][0]]]
        newCubeStatus[Num[2][1]] = edgeCube[aedge][cubeStatus[Num[0][1]][Num[1][1]]]
    }
    //$(".cubeStatus").text(newCubeStatus)
    for(i=0;i<54;i++){
        if(newCubeStatus.indexOf(i)==-1) {
            console.log(i)
        }
    }
     console.log('点击了求解按钮')
        var formData = new FormData();
        var status = newCubeStatus
        //formData.append('query', $("#query").val())
        formData.append('query', status)
        //formData.append('video', document.getElementById("videoFile").files[0])
        $.ajax({
                url:"solve",
                type:"POST",
                data:formData,
                processData:false,
                contentType:false,
                success: function (result) {
                    console.log(result)
                    if(result['ret']==true){
                        var start = document.createElement("span")
                        start.setAttribute('class','btn btn-success ope-result')
                        start.setAttribute('style','width:50px')
                        start.innerText = '开始'
                        var end = document.createElement("span")
                        end.setAttribute('class','btn btn-default ope-result')
                        end.setAttribute('style','width:50px')
                        end.innerText = '结束'
                        var div = document.getElementById('solution')
                        $('#solution').empty()
                        div.appendChild(start)
                        for(i=0;i<result['data']['solution'].length;i++){  //
                            var span = document.createElement('span')
                            span.setAttribute("class","btn btn-default ope-result")
                            if(result['data']['solution'][i][1]==1){
                                span.innerText = result['data']['solution'][i][0]
                            }else{
                                span.innerText = result['data']['solution'][i][0]+'\''
                            }
                            div.appendChild(span)
                        }
                        div.appendChild(end)
                        $('.playandpause')[0].style['display'] = 'block'
                        $('#solution')[0].style['display'] = 'block'
                    }else{
                        $('.alert-dismissible')[3].style['display'] = 'block'
                        $('#error').text('魔方涂色错误，请检查')
                    }

                }
        })

    //cube.turn3(solveStep.shift())
})
colorarray = ['yellow','white','blue','green','red','orange']
cornerCube = [['0,0','2,0','5,0'],['0,6','2,6','4,0'],['0,8','3,6','4,2'],['1,6','2,8','4,6'],['1,8','3,8','4,8'],
['0,2','3,0','5,2'],['1,0','2,2','5,6'],['1,2','3,2','5,8']]
cornerColor = [['yellow','green','red'],['yellow','red','blue'],['yellow','blue','orange'],['yellow','green','orange'],
['white','orange','green'],['white','red','green'],['white','red','blue'],['white','orange','blue']]
cornerCubeNum = [ //0：黄色，1：白色，2：蓝色，3：绿色，4：红色，5：橙色
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
pos2CubeNum=["0,6","0,3","0,0","0,7","0,4","0,5","0,2","1,0","1,3","1,6","1,1","1,4","1,7","1,2","1,5","1,8",
"2,2","2,1","2,0","2,5","2,4","2,3","2,8","2,7","2,6","3,8","3,7","3,6","3,5","3,4","3,3","3,2","3,1","3,0",
"5,8","5,5","5,2","5,7","5,4","5,1","5,6","5,3","5,0","4,6","4,3","4,0","4,7","4,4","4,1","4,8","4,5","4,2"]
function getStatus(){
    //获取魔方目前的状态
    cubeStatus = []
    for(i=0;i<6;i++){
        surface = []
        for(j=0;j<9;j++){
            pos = "[pos='"+i+','+j+"']";
            
            color = $(pos)[0].style['background']
            if(color == 'rgb(255, 255, 255)') surface.push(1)
            else surface.push(colorType.indexOf(color));
        }
        cubeStatus.push(surface)
    }
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

    for(i=0;i<cornerCubeNum.length;i++){  //角块进入序列
        Num = cornerCubeNum[i]
        aCorner=[cubeStatus[Num[0][0]][Num[1][0]],cubeStatus[Num[0][1]][Num[1][1]],cubeStatus[Num[0][2]][Num[1][2]]]
        aCorner.sort(function(a, b){return a - b}); 
        aCorner = aCorner+''
        //console.log(aCorner)
        //console.log(Num[2][0])
        //console.log(cubeStatus[Num[0][0]][Num[1][0]])
        console.log(aCorner)
        //if(cubeStatus[Num[0][0]][Num[1][0]]!=-1)
            newCubeStatus[Num[2][0]] = cornerCube[aCorner][cubeStatus[Num[0][0]][Num[1][0]]]
        //if(cubeStatus[Num[0][1]][Num[1][1]]!=-1)
            newCubeStatus[Num[2][1]] = cornerCube[aCorner][cubeStatus[Num[0][1]][Num[1][1]]]
        //if(cubeStatus[Num[0][2]][Num[1][2]]!=-1)   
            newCubeStatus[Num[2][2]] = cornerCube[aCorner][cubeStatus[Num[0][2]][Num[1][2]]]
    }
    for(i=0;i<edgeCubeNum.length;i++){  //棱块进入序列
        Num = edgeCubeNum[i]
        aedge=[cubeStatus[Num[0][0]][Num[1][0]],cubeStatus[Num[0][1]][Num[1][1]]]
        aedge.sort(function(a, b){return a - b}); 
        aedge = aedge+''
        //if(cubeStatus[Num[0][0]][Num[1][0]]!=-1)
            newCubeStatus[Num[2][0]] = edgeCube[aedge][cubeStatus[Num[0][0]][Num[1][0]]]
        //if(cubeStatus[Num[0][1]][Num[1][1]]!=-1)
            newCubeStatus[Num[2][1]] = edgeCube[aedge][cubeStatus[Num[0][1]][Num[1][1]]]
    }
    return newCubeStatus
}
$(".tab-content").bind("click",function(event){
    console.log('1111')
    console.log(this)
    event.stopPropagation(); 
    $('#color-picker').css({'left': movex,
                'top': movey,
                'display':'none'});
})
$("#opposite").bind("click",function(event){
    cube.initL([-38,-235,30]);
})
function CheckColor(nowcolor){
    colordict = {
        'red':0,'orange':0,'green':0,'white':0,'yellow':0,'blue':0
    }
    
    for(i=0;i<6;i++){
        for(j=0;j<9;j++){
            if (nowcolor[i][j]!=-1)
            colordict[nowcolor[i][j]]++
        }
    }
    console.log(colordict)
    for(var key in colordict){
        if(colordict[key]>8) {
            $('.alert-dismissible')[2].style['display'] = 'block'
            $('#error').text('魔方各颜色总数错误，请检查')
        
            return false
        }
    }
    
    cornerFlags = []  //检查8个角的涂色是否正确，有一个不正确则是有错误
    for(i=0;i<8;i++){
        nowCornerColor = []
        for(j=0;j<3;j++){
            posi = cornerCubeNum[i][0][j]
            posj = cornerCubeNum[i][1][j]
            nowCornerColor.push(nowcolor[posi][posj])
        }
        if(nowCornerColor.indexOf(-1)==-1){
            cornerFlag = 0
            for(j=0;j<8;j++){
                //console.log(cornerColor[j].sort().toString())
                //console.log(nowCornerColor.sort().toString())
                //console.log(cornerColor[j].sort().toString() === nowCornerColor.sort().toString())
                if(cornerColor[j].sort().toString() === nowCornerColor.sort().toString()==true) cornerFlag = 1
            }
            if(cornerFlag == 0) cornerFlags.push(0)
            else cornerFlags.push(1)
        }else{
            cornerFlags.push(1)
        }
    }
    console.log(cornerFlags)
    if(cornerFlags.indexOf(0)>-1){
        $('.alert-dismissible')[2].style['display'] = 'block'
        $('#error').text('魔方角块颜色错误，请检查')
        return false
    }
    return true
}
nowcolor = []
for(i=0;i<6;i++){
    surface = []
    for(j=0;j<9;j++){
        surface.push(-1)
    }
    nowcolor.push(surface)
}
$(".color").bind("click",function(){
    //console.log(pos2CubeNum.indexOf(cubePos))  //获取目前赋色的块在最终输入中的位置
    pos = "[pos='"+cubePos+"']"
    //colorindex = colorarray.indexOf(this.style['color'])
    //console.log(colorindex)
    thisindex = cubePos.split(',')
    nowcolor[parseInt(thisindex[0])][parseInt(thisindex[1])] = this.style['color']
    if(CheckColor(nowcolor))  $(pos)[0].style['background'] = this.style['color']
    else nowcolor[parseInt(thisindex[0])][parseInt(thisindex[1])] = -1
    $('#color-picker').css({'left': movex,
                'top': movey,
                'display':'none'});
    
})
function PlaySolution(){
    flag = 0
    operation = document.getElementsByClassName('ope-result')
    for(i=0;i<operation.length;i++){
        console.log(operation[i].getAttribute("class"))
        if(operation[i].getAttribute("class")=='btn btn-success ope-result'){
            if(i!=operation.length-1)
                cube.turn3(operation[i+1].innerHTML.toLowerCase().replace(/\s*/g,""));
            flag=1
            operation[i].setAttribute("class",'btn btn-default ope-result')
            if(i==operation.length-1){
                $('.alert-dismissible')[3].style['display'] = 'block'
                document.getElementById('playicon').setAttribute("class",'fa  fa-pause')
                window.clearInterval(t1)
            }
        }
        else if(flag==1){
            flag=0
            operation[i].setAttribute("class",'btn btn-success ope-result')
        }

    }
}
converse_operation = {"u":"u'","d":"d'","f":"f'","b":"b'","l":"l'","r":"r'","u'":"u","d'":"d","f'":"f","b'":"b","l'":"l","r'":"r"}
function BackPlaySolution(){
    flag = 0
    operation = document.getElementsByClassName('ope-result')
    for(i=operation.length-1;i>=0;i--){
        if(operation[i].getAttribute("class")=='btn btn-success ope-result'){
            cube.turn3(converse_operation[operation[i].innerHTML.toLowerCase().replace(/\s*/g,"")]);
            flag=1
            operation[i].setAttribute("class",'btn btn-default ope-result')
            if(i==operation.length-1){
                
                window.clearInterval(t1)
                document.getElementById('playicon').setAttribute("class",'fa  fa-play')
                $('.alert-dismissible')[3].style['display'] = 'block'
                document.getElementById('playicon').setAttribute("class",'fa  fa-pause')
            }
        }
        else if(flag==1){
            console.log(1)
            flag=0
            operation[i].setAttribute("class",'btn btn-success ope-result')
        }

    }
}
$("#right").bind("click",PlaySolution)
$("#left").bind("click",BackPlaySolution)
$("#play").bind("click",function(){
    
    playclass = document.getElementById('playicon').getAttribute('class')
    if(playclass=='fa  fa-play'){
        document.getElementById('playicon').setAttribute("class",'fa  fa-pause')
        t1=window.setInterval(PlaySolution,1000)
    }else{
        document.getElementById('playicon').setAttribute("class",'fa  fa-play')
        window.clearInterval(t1)
    }
    
})
$("#empty").bind("click",function(){
    isDiyColor = true
    nowcolor = []
    for(i=0;i<6;i++){
        surface = []
        for(j=0;j<9;j++){
            surface.push(-1)
        }
        nowcolor.push(surface)
    }
    emptycube = []

    for(i=0;i<$('[pos]').length;i++){
        pos = $('[pos]')[i].getAttribute('pos')
        pos = pos.split(',')
        if(pos[1]!='4')
        $('[pos]')[i].style['background'] = 'rgb(220,220,220)'
    }
    
})
$('.close').bind("click",function(){
    $('.alert-dismissible')[2].style['display'] = 'none'
})
$('#close2').bind("click",function(){
    $('.alert-dismissible')[3].style['display'] = 'none'
})
