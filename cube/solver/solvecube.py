from django.http import HttpResponse
import requests,json
from DeepCubeA.code.scripts.solveState import solve_state
import numpy as np
def solve(request):
    print(request.POST["query"])
    print('solved')
    context = {}
    context['answer'] = '1233'
    testState = np.array(request.POST["query"])
    ret, data = solve_state(testState)
    print(ret)
    print(data)
    return HttpResponse(json.dumps(context),content_type='application/json')