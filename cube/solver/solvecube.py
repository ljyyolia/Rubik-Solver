from django.http import HttpResponse
import requests,json
from DeepCubeA.code.scripts.solveState import solve_state
import numpy as np
def solve(request):
    print(request.POST["query"])
    print('solved')
    context = {}
    context['answer'] = '1233'

    # testState = np.array(
    #     [53, 43, 51, 50, 4, 48, 47, 37, 45, 36, 46, 38, 39, 13, 41, 42, 52, 44, 33, 10, 27, 25, 22, 19, 35, 16, 29, 20,
    #      7, 26, 28, 31, 34, 18, 1, 24, 9, 23, 11, 12, 40, 14, 15, 21, 17, 8, 30, 6, 5, 49, 3, 2, 32, 0])
    status = [int(num) for num in request.POST["query"].split(',')]
    print(status)
    testState = np.array(status)
    print(testState)
    ret, data = solve_state(testState,wait_time = 15)
    print(ret)
    print(data)
    if data!=None:
      data['state'] = data['state'].tolist()

    context['ret'] = ret
    context['data'] = data
    return HttpResponse(json.dumps(context),content_type='application/json')

def challenge(request):
    print(request.POST["step"])
    context = {}
    context['answer'] = '1233'
    return HttpResponse(json.dumps(context), content_type='application/json')