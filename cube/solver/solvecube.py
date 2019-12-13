from django.http import HttpResponse
import requests,json
from DeepCubeA.code.scripts.solveState import solve_state
import numpy as np
def solve(request):
    print(request.POST["query"])
    print('solved')
    context = {}
    context['answer'] = '1233'
    #testState = np.array(request.POST["query"])
    # url = 'http://10.0.0.39:5005/solve'
    # data = {}
    # data['state'] = [53, 43, 51, 50, 4, 48, 47, 37, 45, 36, 46, 38, 39, 13, 41, 42, 52, 44, 33, 10, 27, 25, 22, 19, 35, 16, 29, 20,
    #      7, 26, 28, 31, 34, 18, 1, 24, 9, 23, 11, 12, 40, 14, 15, 21, 17, 8, 30, 6, 5, 49, 3, 2, 32, 1]
    # r = requests.post(url,data)
    # print(r.content)
    testState = np.array(
        [53, 43, 51, 50, 4, 48, 47, 37, 45, 36, 46, 38, 39, 13, 41, 42, 52, 44, 33, 10, 27, 25, 22, 19, 35, 16, 29, 20,
         7, 26, 28, 31, 34, 18, 1, 24, 9, 23, 11, 12, 40, 14, 15, 21, 17, 8, 30, 6, 5, 49, 3, 2, 32, 0])
    #testState = np.array(request.POST["query"])
    ret, data = solve_state(testState)
    data['state'] = data['state'].tolist()
    print(ret)
    print(data)
    context['ret'] = ret
    context['data'] = data
    return HttpResponse(json.dumps(context),content_type='application/json')